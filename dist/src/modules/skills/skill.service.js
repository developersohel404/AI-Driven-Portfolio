"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillService = void 0;
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
exports.skillService = {
    async list(input) {
        const where = {};
        if (input.category)
            where.category = input.category;
        if (input.search) {
            where.OR = [
                { name: { contains: input.search, mode: 'insensitive' } },
                { category: { contains: input.search, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            prisma_1.prisma.skill.findMany({
                where,
                orderBy: [{ order: 'asc' }, { name: 'asc' }],
            }),
            prisma_1.prisma.skill.count({ where }),
        ]);
        return { items, total };
    },
    async getById(id) {
        const skill = await prisma_1.prisma.skill.findUnique({ where: { id } });
        if (!skill)
            throw new error_handler_1.AppError('Skill not found', 404);
        return skill;
    },
    async create(input) {
        const existing = await prisma_1.prisma.skill.findUnique({
            where: { name: input.name },
            select: { id: true },
        });
        if (existing)
            throw new error_handler_1.AppError('Skill already exists', 409);
        return prisma_1.prisma.skill.create({ data: input });
    },
    async update(id, input) {
        await this.getById(id);
        if (input.name) {
            const dup = await prisma_1.prisma.skill.findUnique({
                where: { name: input.name },
                select: { id: true },
            });
            if (dup && dup.id !== id) {
                throw new error_handler_1.AppError('Skill with this name already exists', 409);
            }
        }
        return prisma_1.prisma.skill.update({ where: { id }, data: input });
    },
    async remove(id) {
        await this.getById(id);
        await prisma_1.prisma.skill.delete({ where: { id } });
    },
};
