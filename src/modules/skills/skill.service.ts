import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import type { SkillListResult } from './skill.type';
import type { CreateSkillInput, ListSkillsInput, UpdateSkillInput } from './skill.validation';

export const skillService = {
  async list(input: ListSkillsInput): Promise<SkillListResult> {
    const where: Record<string, unknown> = {};
    if (input.category) where.category = input.category;
    if (input.search) {
      where.OR = [
        { name: { contains: input.search, mode: 'insensitive' } },
        { category: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
      }),
      prisma.skill.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string) {
    const skill = await prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new AppError('Skill not found', 404);
    return skill;
  },

  async create(input: CreateSkillInput) {
    const existing = await prisma.skill.findUnique({
      where: { name: input.name },
      select: { id: true },
    });
    if (existing) throw new AppError('Skill already exists', 409);
    return prisma.skill.create({ data: input });
  },

  async update(id: string, input: UpdateSkillInput) {
    await this.getById(id);

    if (input.name) {
      const dup = await prisma.skill.findUnique({
        where: { name: input.name },
        select: { id: true },
      });
      if (dup && dup.id !== id) {
        throw new AppError('Skill with this name already exists', 409);
      }
    }

    return prisma.skill.update({ where: { id }, data: input });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.skill.delete({ where: { id } });
  },
};
