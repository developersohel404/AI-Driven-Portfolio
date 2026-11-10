"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const slug_1 = require("../../utils/slug");
const withTechs = { technologies: true };
async function ensureUniqueSlug(base, ignoreId) {
    let slug = base;
    let i = 1;
    while (true) {
        const existing = await prisma_1.prisma.project.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!existing || existing.id === ignoreId)
            return slug;
        slug = `${base}-${++i}`;
    }
}
exports.projectService = {
    async list(input, includeDrafts = false) {
        const { page, limit, search, featured, status } = input;
        const skip = (page - 1) * limit;
        const where = {};
        // status: public request-এ সবসময় PUBLISHED, admin চাইলে override
        if (!includeDrafts)
            where.status = 'PUBLISHED';
        else if (status)
            where.status = status;
        if (typeof featured === 'boolean')
            where.featured = featured;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { shortDesc: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            prisma_1.prisma.project.findMany({
                where,
                include: withTechs,
                orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            prisma_1.prisma.project.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    },
    async getBySlug(slug, includeDrafts = false) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { slug },
            include: withTechs,
        });
        if (!project)
            throw new error_handler_1.AppError('Project not found', 404);
        if (!includeDrafts && project.status !== 'PUBLISHED') {
            throw new error_handler_1.AppError('Project not found', 404);
        }
        return project;
    },
    async create(input) {
        const slug = await ensureUniqueSlug(input.slug ?? (0, slug_1.generateSlug)(input.title));
        const { technologies, ...rest } = input;
        return prisma_1.prisma.project.create({
            data: {
                ...rest,
                slug,
                technologies: technologies
                    ? { create: technologies.map((t) => ({ name: t.name, icon: t.icon })) }
                    : undefined,
            },
            include: withTechs,
        });
    },
    async update(id, input) {
        const existing = await prisma_1.prisma.project.findUnique({
            where: { id },
            select: { id: true, slug: true, title: true },
        });
        if (!existing)
            throw new error_handler_1.AppError('Project not found', 404);
        // slug পরিবর্তন দরকার?
        let slug = existing.slug;
        if (input.slug && input.slug !== existing.slug) {
            slug = await ensureUniqueSlug(input.slug, id);
        }
        else if (!input.slug && input.title && input.title !== existing.title) {
            // title বদলালে auto-slug (explicit slug না দিলে)
            slug = await ensureUniqueSlug((0, slug_1.generateSlug)(input.title), id);
        }
        const { technologies, ...rest } = input;
        return prisma_1.prisma.project.update({
            where: { id },
            data: {
                ...rest,
                slug,
                // technologies দিলে replace, না দিলে untouched
                ...(technologies
                    ? {
                        technologies: {
                            deleteMany: {},
                            create: technologies.map((t) => ({ name: t.name, icon: t.icon })),
                        },
                    }
                    : {}),
            },
            include: withTechs,
        });
    },
    async remove(id) {
        const existing = await prisma_1.prisma.project.findUnique({
            where: { id },
            select: { id: true },
        });
        if (!existing)
            throw new error_handler_1.AppError('Project not found', 404);
        await prisma_1.prisma.project.delete({ where: { id } });
    },
    async incrementViews(slug) {
        await prisma_1.prisma.project
            .update({ where: { slug }, data: { views: { increment: 1 } } })
            .catch(() => {
            /* silent — analytics should never break the page */
        });
    },
    async toggleFeatured(id) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { id },
            select: { featured: true },
        });
        if (!project)
            throw new error_handler_1.AppError('Project not found', 404);
        return prisma_1.prisma.project.update({
            where: { id },
            data: { featured: !project.featured },
            include: withTechs,
        });
    },
    async setStatus(id, status) {
        return prisma_1.prisma.project.update({
            where: { id },
            data: { status },
            include: withTechs,
        });
    },
};
