"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceService = void 0;
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const slug_1 = require("../../utils/slug");
async function ensureUniqueSlug(base, ignoreId) {
    let slug = base;
    let i = 1;
    while (true) {
        const existing = await prisma_1.prisma.service.findUnique({
            where: { slug },
            select: { id: true },
        });
        if (!existing || existing.id === ignoreId)
            return slug;
        slug = `${base}-${++i}`;
    }
}
exports.serviceService = {
    async list(input, includeDrafts = false) {
        const where = {};
        if (!includeDrafts)
            where.published = true;
        else if (typeof input.published === 'boolean')
            where.published = input.published;
        if (input.search) {
            where.OR = [
                { title: { contains: input.search, mode: 'insensitive' } },
                { description: { contains: input.search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            prisma_1.prisma.service.findMany({
                where,
                orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
            }),
            prisma_1.prisma.service.count({ where }),
        ]);
        return { items, total };
    },
    async getBySlug(slug, includeDrafts = false) {
        const service = await prisma_1.prisma.service.findUnique({ where: { slug } });
        if (!service)
            throw new error_handler_1.AppError('Service not found', 404);
        if (!includeDrafts && !service.published) {
            throw new error_handler_1.AppError('Service not found', 404);
        }
        return service;
    },
    async getById(id) {
        const service = await prisma_1.prisma.service.findUnique({ where: { id } });
        if (!service)
            throw new error_handler_1.AppError('Service not found', 404);
        return service;
    },
    async create(input) {
        const slug = await ensureUniqueSlug(input.slug ?? (0, slug_1.generateSlug)(input.title));
        return prisma_1.prisma.service.create({ data: { ...input, slug } });
    },
    async update(id, input) {
        const existing = await this.getById(id);
        let slug = existing.slug;
        if (input.slug && input.slug !== existing.slug) {
            slug = await ensureUniqueSlug(input.slug, id);
        }
        else if (!input.slug && input.title && input.title !== existing.title) {
            slug = await ensureUniqueSlug((0, slug_1.generateSlug)(input.title), id);
        }
        return prisma_1.prisma.service.update({
            where: { id },
            data: { ...input, slug },
        });
    },
    async remove(id) {
        await this.getById(id);
        await prisma_1.prisma.service.delete({ where: { id } });
    },
    async togglePublished(id) {
        const service = await this.getById(id);
        return prisma_1.prisma.service.update({
            where: { id },
            data: { published: !service.published },
        });
    },
};
