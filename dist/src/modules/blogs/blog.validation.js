"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRegenerateImageSchema = exports.aiGenerateBlogSchema = exports.listBlogsQuerySchema = exports.updateBlogSchema = exports.createBlogSchema = void 0;
// export const createBlogSchema = z.object({
//   title: z.string().min(3).max(160).trim(),
//   slug: z
//     .string()
//     .min(2)
//     .max(160)
//     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
//     .optional(),
//   excerpt: z.string().min(10).max(300).trim(),
//   content: z.string().min(20).trim(),
//   coverUrl: z.string().url().optional(),
//   metaTitle: z.string().max(160).optional(),
//   metaDesc: z.string().max(300).optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
//   tags: z.array(z.string().min(1).max(40).trim()).max(10).optional(),
// });
// export const updateBlogSchema = createBlogSchema.partial();
// export const listBlogsQuerySchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(50).default(10),
//   search: z.string().trim().optional(),
//   tag: z.string().trim().optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
// });
// export type CreateBlogInput = z.infer<typeof createBlogSchema>;
// export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
// export type ListBlogsInput = z.infer<typeof listBlogsQuerySchema>;
// import { z } from 'zod';
// export const createBlogSchema = z.object({
//   title: z.string().min(3).max(160).trim(),
//   slug: z
//     .string()
//     .min(2)
//     .max(160)
//     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
//     .optional(),
//   excerpt: z.string().min(10).max(300).trim(),
//   content: z.string().min(20).trim(),
//   coverUrl: z.string().url().optional(),
//   metaTitle: z.string().max(160).optional(),
//   metaDesc: z.string().max(300).optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
//   tags: z.array(z.string().min(1).max(40).trim()).max(10).optional(),
// });
// export const updateBlogSchema = createBlogSchema.partial();
// export const listBlogsQuerySchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(50).default(10),
//   search: z.string().trim().optional(),
//   tag: z.string().trim().optional(),
//   status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
// });
// export type CreateBlogInput = z.infer<typeof createBlogSchema>;
// export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
// export type ListBlogsInput = z.infer<typeof listBlogsQuerySchema>;
const zod_1 = require("zod");
// ============================================
// CRUD Schemas
// ============================================
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(160).trim(),
    slug: zod_1.z
        .string()
        .min(2)
        .max(160)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
        .optional(),
    excerpt: zod_1.z.string().min(10).max(300).trim(),
    content: zod_1.z.string().min(20).trim(),
    // ✅ Empty string / null / undefined — সব handle
    coverUrl: zod_1.z
        .union([zod_1.z.string().url(), zod_1.z.literal(''), zod_1.z.null(), zod_1.z.undefined()])
        .transform((v) => (v === '' || v === null || v === undefined ? undefined : v))
        .optional(),
    metaTitle: zod_1.z
        .union([zod_1.z.string().max(160), zod_1.z.literal(''), zod_1.z.null(), zod_1.z.undefined()])
        .transform((v) => (v === '' || v === null || v === undefined ? undefined : v))
        .optional(),
    metaDesc: zod_1.z
        .union([zod_1.z.string().max(300), zod_1.z.literal(''), zod_1.z.null(), zod_1.z.undefined()])
        .transform((v) => (v === '' || v === null || v === undefined ? undefined : v))
        .optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    tags: zod_1.z.array(zod_1.z.string().min(1).max(40).trim()).max(10).optional(),
});
exports.updateBlogSchema = exports.createBlogSchema.partial();
exports.listBlogsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(10),
    search: zod_1.z.string().trim().optional(),
    tag: zod_1.z.string().trim().optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});
// ============================================
// AI Generate Schemas
// ============================================
exports.aiGenerateBlogSchema = zod_1.z.object({
    topic: zod_1.z.string().min(5, 'Topic is too short').max(200).trim(),
    // ✅ Outline — empty / null / undefined সব accept
    outline: zod_1.z
        .union([zod_1.z.string().max(3000), zod_1.z.literal(''), zod_1.z.null(), zod_1.z.undefined()])
        .transform((v) => (v === '' || v === null || v === undefined ? undefined : v.trim()))
        .optional(),
    tone: zod_1.z.enum(['professional', 'casual', 'technical', 'tutorial']).catch('technical'),
    targetWords: zod_1.z.coerce.number().int().min(200).max(2000).catch(800),
    generateImage: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.enum(['true', 'false']), zod_1.z.literal('')])
        .transform((v) => v === true || v === 'true')
        .catch(true),
});
exports.aiRegenerateImageSchema = zod_1.z.object({
    prompt: zod_1.z.string().min(3).max(500).trim(),
});
