"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProjectsQuerySchema = exports.updateProjectSchema = exports.createProjectSchema = void 0;
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
const zod_1 = require("zod");
const techSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50).trim(),
    icon: zod_1.z.string().max(80).optional(),
});
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(120).trim(),
    slug: zod_1.z
        .string()
        .min(2)
        .max(120)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
        .optional(),
    shortDesc: zod_1.z.string().min(10).max(240).trim(),
    description: zod_1.z.string().min(20).trim(),
    problem: zod_1.z.string().trim().optional(),
    solution: zod_1.z.string().trim().optional(),
    architecture: zod_1.z.string().trim().optional(),
    challenges: zod_1.z.string().trim().optional(),
    lessonsLearned: zod_1.z.string().trim().optional(),
    futureWork: zod_1.z.string().trim().optional(),
    thumbnailUrl: zod_1.z.string().url().optional(),
    images: zod_1.z.array(zod_1.z.string().url()).max(10).optional(),
    liveUrl: zod_1.z.string().url().optional(),
    repoUrl: zod_1.z.string().url().optional(),
    featured: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    order: zod_1.z.number().int().min(0).optional(),
    technologies: zod_1.z.array(techSchema).max(20).optional(),
});
exports.updateProjectSchema = exports.createProjectSchema.partial();
exports.listProjectsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(12),
    search: zod_1.z.string().trim().optional(),
    featured: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false'])])
        .transform((v) => v === true || v === 'true' ? true : v === false || v === 'false' ? false : undefined)
        .optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});
