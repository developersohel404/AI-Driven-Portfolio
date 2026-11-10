// import { z } from 'zod';

// const techSchema = z.object({
//   name: z.string().min(1).max(50).trim(),
//   icon: z.string().max(80).optional(),
// });

// export const createProjectSchema = z.object({
//   title: z.string().min(2).max(120).trim(),
//   slug: z
//     .string()
//     .min(2)
//     .max(120)
//     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
//     .optional(),
//   shortDesc: z.string().min(10).max(240).trim(),
//   description: z.string().min(20).trim(),
//   problem: z.string().trim().optional(),
//   solution: z.string().trim().optional(),
//   architecture: z.string().trim().optional(),
//   challenges: z.string().trim().optional(),
//   lessonsLearned: z.string().trim().optional(),
//   futureWork: z.string().trim().optional(),
//   thumbnailUrl: z.string().url().optional(),
//   images: z.array(z.string().url()).max(10).optional(),
//   liveUrl: z.string().url().optional(),
//   repoUrl: z.string().url().optional(),
//   featured: z.boolean().optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
//   order: z.number().int().min(0).optional(),
//   technologies: z.array(techSchema).max(20).optional(),
// });

// export const updateProjectSchema = createProjectSchema.partial();

// export const listProjectsQuerySchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(12),
//   search: z.string().trim().optional(),
//   featured: z
//     .union([z.boolean(), z.enum(['true', 'false'])])
//     .transform((v) =>
//       v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined
//     )
//     .optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
// });

// export type CreateProjectInput = z.infer<typeof createProjectSchema>;
// export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
// export type ListProjectsInput = z.infer<typeof listProjectsQuerySchema>;

import { z } from 'zod';

const techSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  icon: z.string().max(80).optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(2).max(120).trim(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
    .optional(),
  shortDesc: z.string().min(10).max(240).trim(),
  description: z.string().min(20).trim(),
  problem: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  architecture: z.string().trim().optional(),
  challenges: z.string().trim().optional(),
  lessonsLearned: z.string().trim().optional(),
  futureWork: z.string().trim().optional(),
  thumbnailUrl: z.string().url().optional(),
  images: z.array(z.string().url()).max(10).optional(),
  liveUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  order: z.number().int().min(0).optional(),
  technologies: z.array(techSchema).max(20).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().optional(),
  featured: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((v) =>
      v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined
    )
    .optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsInput = z.infer<typeof listProjectsQuerySchema>;
