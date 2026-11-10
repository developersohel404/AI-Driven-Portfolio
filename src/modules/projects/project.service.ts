import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import { generateSlug } from '../../utils/slug';
import type { ProjectListResult } from './project.type';
import type {
  CreateProjectInput,
  ListProjectsInput,
  UpdateProjectInput,
} from './project.validation';

const withTechs = { technologies: true } as const;

async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${++i}`;
  }
}

export const projectService = {
  async list(input: ListProjectsInput, includeDrafts = false): Promise<ProjectListResult> {
    const { page, limit, search, featured, status } = input;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // status: public request-এ সবসময় PUBLISHED, admin চাইলে override
    if (!includeDrafts) where.status = 'PUBLISHED';
    else if (status) where.status = status;

    if (typeof featured === 'boolean') where.featured = featured;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDesc: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: withTechs,
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getBySlug(slug: string, includeDrafts = false) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: withTechs,
    });
    if (!project) throw new AppError('Project not found', 404);
    if (!includeDrafts && project.status !== 'PUBLISHED') {
      throw new AppError('Project not found', 404);
    }
    return project;
  },

  async create(input: CreateProjectInput) {
    const slug = await ensureUniqueSlug(input.slug ?? generateSlug(input.title));

    const { technologies, ...rest } = input;

    return prisma.project.create({
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

  async update(id: string, input: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { id: true, slug: true, title: true },
    });
    if (!existing) throw new AppError('Project not found', 404);

    // slug পরিবর্তন দরকার?
    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = await ensureUniqueSlug(input.slug, id);
    } else if (!input.slug && input.title && input.title !== existing.title) {
      // title বদলালে auto-slug (explicit slug না দিলে)
      slug = await ensureUniqueSlug(generateSlug(input.title), id);
    }

    const { technologies, ...rest } = input;

    return prisma.project.update({
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

  async remove(id: string) {
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new AppError('Project not found', 404);
    await prisma.project.delete({ where: { id } });
  },

  async incrementViews(slug: string) {
    await prisma.project
      .update({ where: { slug }, data: { views: { increment: 1 } } })
      .catch(() => {
        /* silent — analytics should never break the page */
      });
  },

  async toggleFeatured(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { featured: true },
    });
    if (!project) throw new AppError('Project not found', 404);
    return prisma.project.update({
      where: { id },
      data: { featured: !project.featured },
      include: withTechs,
    });
  },

  async setStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
    return prisma.project.update({
      where: { id },
      data: { status },
      include: withTechs,
    });
  },
};
