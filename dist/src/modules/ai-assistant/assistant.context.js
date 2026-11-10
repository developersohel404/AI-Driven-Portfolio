"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPortfolioContext = buildPortfolioContext;
exports.rankProjectsByQuery = rankProjectsByQuery;
const constants_1 = require("../../config/constants");
const prisma_1 = require("../../lib/prisma");
/**
 * Portfolio data DB থেকে retrieve করে structured context তৈরি করে।
 * AI-তে পাঠানোর আগে token বাঁচাতে যা যা দরকার শুধু তাই নেয়।
 */
async function buildPortfolioContext(userQuery) {
    const [profileRaw, projectsRaw, skillsRaw, servicesRaw] = await Promise.all([
        prisma_1.prisma.profile.findFirst({
            select: {
                headline: true,
                shortBio: true,
                bio: true,
                location: true,
                availableForWork: true,
                githubUrl: true,
                linkedinUrl: true,
                twitterUrl: true,
                websiteUrl: true,
                user: { select: { name: true } },
            },
        }),
        prisma_1.prisma.project.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                title: true,
                slug: true,
                shortDesc: true,
                liveUrl: true,
                repoUrl: true,
                technologies: { select: { name: true } },
            },
            orderBy: [{ featured: 'desc' }, { order: 'asc' }],
            take: constants_1.AI_LIMITS.MAX_CONTEXT_ITEMS * 4, // top 20 projects
        }),
        prisma_1.prisma.skill.findMany({
            select: { name: true, category: true },
            orderBy: [{ order: 'asc' }, { name: 'asc' }],
        }),
        prisma_1.prisma.service.findMany({
            where: { published: true },
            select: { title: true, slug: true, description: true },
            orderBy: { order: 'asc' },
            take: 10,
        }),
    ]);
    // skills কে category অনুযায়ী group
    const skillsGrouped = {};
    for (const s of skillsRaw) {
        (skillsGrouped[s.category] ??= []).push(s.name);
    }
    return {
        profile: profileRaw
            ? {
                name: profileRaw.user.name,
                title: profileRaw.headline,
                bio: profileRaw.bio,
                shortBio: profileRaw.shortBio,
                location: profileRaw.location ?? undefined,
                availableForWork: profileRaw.availableForWork,
                socials: {
                    github: profileRaw.githubUrl,
                    linkedin: profileRaw.linkedinUrl,
                    twitter: profileRaw.twitterUrl,
                    website: profileRaw.websiteUrl,
                },
            }
            : null,
        projects: projectsRaw.map((p) => ({
            title: p.title,
            slug: p.slug,
            shortDesc: p.shortDesc,
            technologies: p.technologies.map((t) => t.name),
            liveUrl: p.liveUrl,
            repoUrl: p.repoUrl,
        })),
        skills: skillsGrouped,
        services: servicesRaw,
    };
}
/**
 * Context থেকে এমন project গুলো বেছে নেয় যেগুলো query-তে mention বা tech মিলে।
 * Naive keyword matching — pgvector পরে যোগ হবে।
 */
function rankProjectsByQuery(ctx, query, limit = constants_1.AI_LIMITS.MAX_CONTEXT_ITEMS) {
    const q = query.toLowerCase();
    const scored = ctx.projects.map((p) => {
        let score = 0;
        if (p.title.toLowerCase().includes(q))
            score += 10;
        if (p.shortDesc.toLowerCase().includes(q))
            score += 5;
        for (const tech of p.technologies) {
            if (q.includes(tech.toLowerCase()))
                score += 8;
        }
        return { p, score };
    });
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.p);
}
