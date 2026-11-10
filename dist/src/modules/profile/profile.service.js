"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = void 0;
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const publicSelect = {
    id: true,
    headline: true,
    shortBio: true,
    bio: true,
    location: true,
    email: true,
    phone: true,
    avatarUrl: true,
    resumeUrl: true,
    githubUrl: true,
    linkedinUrl: true,
    twitterUrl: true,
    websiteUrl: true,
    availableForWork: true,
    updatedAt: true,
    user: { select: { name: true, email: true } },
};
/** Auto-create Profile if missing for a user */
async function ensureProfile(userId) {
    const existing = await prisma_1.prisma.profile.findUnique({
        where: { userId },
        select: publicSelect,
    });
    if (existing)
        return existing;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
    });
    if (!user)
        throw new error_handler_1.AppError('User not found', 404);
    return prisma_1.prisma.profile.create({
        data: {
            userId,
            headline: 'Full-Stack Web Developer',
            shortBio: 'I build web applications.',
            bio: 'Full bio coming soon.',
            email: user.email,
            availableForWork: true,
        },
        select: publicSelect,
    });
}
exports.profileService = {
    /** Public — প্রথম profile (admin-এর) */
    async getPublic() {
        const profile = await prisma_1.prisma.profile.findFirst({
            select: publicSelect,
        });
        if (!profile)
            throw new error_handler_1.AppError('Profile not set up yet', 404);
        return profile;
    },
    /** Admin — logged-in admin-এর নিজের profile (auto-create if missing) */
    async getMine(userId) {
        return ensureProfile(userId);
    },
    /** Admin — নতুন profile তৈরি */
    async createMine(userId, input) {
        const existing = await prisma_1.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (existing)
            throw new error_handler_1.AppError('Profile already exists for this user', 409);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        return prisma_1.prisma.profile.create({
            data: {
                userId,
                headline: input.headline ?? 'Full-Stack Web Developer',
                shortBio: input.shortBio ?? 'I build web applications.',
                bio: input.bio ?? 'Full bio here.',
                location: input.location,
                email: input.email ?? user?.email,
                phone: input.phone,
                avatarUrl: input.avatarUrl,
                resumeUrl: input.resumeUrl,
                githubUrl: input.githubUrl,
                linkedinUrl: input.linkedinUrl,
                twitterUrl: input.twitterUrl,
                websiteUrl: input.websiteUrl,
                availableForWork: input.availableForWork ?? true,
            },
            select: publicSelect,
        });
    },
    /** Admin — profile update (auto-create if missing) */
    async updateMine(userId, input) {
        // Ensure profile exists (auto-create), then update
        await ensureProfile(userId);
        const data = {};
        if (input.headline !== undefined)
            data.headline = input.headline;
        if (input.shortBio !== undefined)
            data.shortBio = input.shortBio;
        if (input.bio !== undefined)
            data.bio = input.bio;
        if (input.location !== undefined)
            data.location = input.location;
        if (input.email !== undefined)
            data.email = input.email;
        if (input.phone !== undefined)
            data.phone = input.phone;
        if (input.avatarUrl !== undefined)
            data.avatarUrl = input.avatarUrl;
        if (input.resumeUrl !== undefined)
            data.resumeUrl = input.resumeUrl;
        if (input.githubUrl !== undefined)
            data.githubUrl = input.githubUrl;
        if (input.linkedinUrl !== undefined)
            data.linkedinUrl = input.linkedinUrl;
        if (input.twitterUrl !== undefined)
            data.twitterUrl = input.twitterUrl;
        if (input.websiteUrl !== undefined)
            data.websiteUrl = input.websiteUrl;
        if (input.availableForWork !== undefined) {
            data.availableForWork = input.availableForWork;
        }
        return prisma_1.prisma.profile.update({
            where: { userId },
            data,
            select: publicSelect,
        });
    },
    /** `/api/v1/me` — public developer bundle */
    async getPublicBundle() {
        const [profile, skills] = await Promise.all([
            prisma_1.prisma.profile.findFirst({ select: publicSelect }),
            prisma_1.prisma.skill.findMany({
                select: { name: true, category: true, level: true },
                orderBy: [{ order: 'asc' }, { name: 'asc' }],
            }),
        ]);
        if (!profile)
            throw new error_handler_1.AppError('Profile not set up yet', 404);
        return {
            name: profile.user.name,
            title: profile.headline,
            bio: profile.bio,
            shortBio: profile.shortBio,
            location: profile.location,
            email: profile.email,
            avatarUrl: profile.avatarUrl,
            resumeUrl: profile.resumeUrl,
            socials: {
                github: profile.githubUrl,
                linkedin: profile.linkedinUrl,
                twitter: profile.twitterUrl,
                website: profile.websiteUrl,
            },
            availableForWork: profile.availableForWork,
            skills: skills.reduce((acc, s) => {
                (acc[s.category] ??= []).push(s.name);
                return acc;
            }, {}),
        };
    },
};
