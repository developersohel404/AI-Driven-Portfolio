"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const ai_service_1 = require("../../lib/ai/ai-service");
const prisma_1 = require("../../lib/prisma");
exports.dashboardService = {
    /** মূল overview — সব module-এর quick counts */
    async overview() {
        const [projectsTotal, projectsPublished, projectsDraft, projectsFeatured, blogsTotal, blogsPublished, blogsDraft, skillsTotal, servicesTotal, servicesPublished, contactsTotal, contactsNew, usersTotal, aiAvailable,] = await Promise.all([
            prisma_1.prisma.project.count(),
            prisma_1.prisma.project.count({ where: { status: 'PUBLISHED' } }),
            prisma_1.prisma.project.count({ where: { status: 'DRAFT' } }),
            prisma_1.prisma.project.count({ where: { featured: true } }),
            prisma_1.prisma.blogPost.count(),
            prisma_1.prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
            prisma_1.prisma.blogPost.count({ where: { status: 'DRAFT' } }),
            prisma_1.prisma.skill.count(),
            prisma_1.prisma.service.count(),
            prisma_1.prisma.service.count({ where: { published: true } }),
            prisma_1.prisma.contactMessage.count(),
            prisma_1.prisma.contactMessage.count({ where: { status: 'NEW' } }),
            prisma_1.prisma.user.count(),
            Promise.resolve(ai_service_1.aiService.getStatus()),
        ]);
        return {
            projects: {
                total: projectsTotal,
                published: projectsPublished,
                draft: projectsDraft,
                featured: projectsFeatured,
            },
            blogs: {
                total: blogsTotal,
                published: blogsPublished,
                draft: blogsDraft,
            },
            skills: { total: skillsTotal },
            services: { total: servicesTotal, published: servicesPublished },
            contacts: { total: contactsTotal, new: contactsNew },
            users: { total: usersTotal },
            ai: aiAvailable,
        };
    },
    /** সাম্প্রতিক activity — নতুন contact, নতুন project, নতুন blog */
    async recentActivity(limit = 5) {
        const [recentProjects, recentBlogs, recentContacts] = await Promise.all([
            prisma_1.prisma.project.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                    createdAt: true,
                },
            }),
            prisma_1.prisma.blogPost.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    status: true,
                    createdAt: true,
                },
            }),
            prisma_1.prisma.contactMessage.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    subject: true,
                    status: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            projects: recentProjects,
            blogs: recentBlogs,
            contacts: recentContacts,
        };
    },
    /** AI usage — শেষ ২৪ ঘণ্টা + শেষ ৭ দিন */
    async aiUsage() {
        const now = Date.now();
        const day = new Date(now - 24 * 60 * 60 * 1000);
        const week = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const [last24h, last7d, byTool, recentFailures] = await Promise.all([
            prisma_1.prisma.aIUsageLog.aggregate({
                where: { createdAt: { gte: day } },
                _count: true,
                _sum: { tokensIn: true, tokensOut: true },
            }),
            prisma_1.prisma.aIUsageLog.aggregate({
                where: { createdAt: { gte: week } },
                _count: true,
                _sum: { tokensIn: true, tokensOut: true },
            }),
            prisma_1.prisma.aIUsageLog.groupBy({
                by: ['tool'],
                where: { createdAt: { gte: week } },
                _count: true,
            }),
            prisma_1.prisma.aIUsageLog.findMany({
                where: { success: false, createdAt: { gte: week } },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    tool: true,
                    provider: true,
                    errorMessage: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            last24h: {
                requests: last24h._count,
                tokensIn: last24h._sum.tokensIn ?? 0,
                tokensOut: last24h._sum.tokensOut ?? 0,
            },
            last7d: {
                requests: last7d._count,
                tokensIn: last7d._sum.tokensIn ?? 0,
                tokensOut: last7d._sum.tokensOut ?? 0,
            },
            byTool: byTool.map((t) => ({ tool: t.tool, count: t._count })),
            recentFailures,
        };
    },
    /** Contact message trend — শেষ ৭ দিনের প্রতিদিনের সংখ্যা */
    async contactTrend() {
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const messages = await prisma_1.prisma.contactMessage.findMany({
            where: { createdAt: { gte: since } },
            select: { createdAt: true, status: true },
        });
        // দিন অনুযায়ী bucket
        const buckets = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().slice(0, 10);
            buckets[key] = { total: 0, new: 0 };
        }
        for (const m of messages) {
            const key = m.createdAt.toISOString().slice(0, 10);
            if (buckets[key]) {
                buckets[key].total++;
                if (m.status === 'NEW')
                    buckets[key].new++;
            }
        }
        return Object.entries(buckets)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, v]) => ({ date, ...v }));
    },
};
