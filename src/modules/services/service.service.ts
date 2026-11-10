import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import { generateSlug } from '../../utils/slug';
import type { ServiceListResult } from './service.type';
import type {
  CreateServiceInput,
  ListServicesInput,
  UpdateServiceInput,
} from './service.validation';

async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.service.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${++i}`;
  }
}

export const serviceService = {
  async list(input: ListServicesInput, includeDrafts = false): Promise<ServiceListResult> {
    const where: Record<string, unknown> = {};

    if (!includeDrafts) where.published = true;
    else if (typeof input.published === 'boolean') where.published = input.published;

    if (input.search) {
      where.OR = [
        { title: { contains: input.search, mode: 'insensitive' } },
        { description: { contains: input.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.service.count({ where }),
    ]);

    return { items, total };
  },

  async getBySlug(slug: string, includeDrafts = false) {
    const service = await prisma.service.findUnique({ where: { slug } });
    if (!service) throw new AppError('Service not found', 404);
    if (!includeDrafts && !service.published) {
      throw new AppError('Service not found', 404);
    }
    return service;
  },

  async getById(id: string) {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new AppError('Service not found', 404);
    return service;
  },

  async create(input: CreateServiceInput) {
    const slug = await ensureUniqueSlug(input.slug ?? generateSlug(input.title));
    return prisma.service.create({ data: { ...input, slug } });
  },

  async update(id: string, input: UpdateServiceInput) {
    const existing = await this.getById(id);

    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = await ensureUniqueSlug(input.slug, id);
    } else if (!input.slug && input.title && input.title !== existing.title) {
      slug = await ensureUniqueSlug(generateSlug(input.title), id);
    }

    return prisma.service.update({
      where: { id },
      data: { ...input, slug },
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.service.delete({ where: { id } });
  },

  async togglePublished(id: string) {
    const service = await this.getById(id);
    return prisma.service.update({
      where: { id },
      data: { published: !service.published },
    });
  },
};
