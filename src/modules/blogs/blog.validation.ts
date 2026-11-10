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

import { z } from 'zod';

// ============================================
// CRUD Schemas
// ============================================

export const createBlogSchema = z.object({
  title: z.string().min(3).max(160).trim(),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case')
    .optional(),
  excerpt: z.string().min(10).max(300).trim(),
  content: z.string().min(20).trim(),

  // ✅ Empty string / null / undefined — সব handle
  coverUrl: z
    .union([z.string().url(), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v === '' || v === null || v === undefined ? undefined : v))
    .optional(),
  metaTitle: z
    .union([z.string().max(160), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v === '' || v === null || v === undefined ? undefined : v))
    .optional(),
  metaDesc: z
    .union([z.string().max(300), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v === '' || v === null || v === undefined ? undefined : v))
    .optional(),

  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  tags: z.array(z.string().min(1).max(40).trim()).max(10).optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const listBlogsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// ============================================
// AI Generate Schemas
// ============================================

export const aiGenerateBlogSchema = z.object({
  topic: z.string().min(5, 'Topic is too short').max(200).trim(),

  // ✅ Outline — empty / null / undefined সব accept
  outline: z
    .union([z.string().max(3000), z.literal(''), z.null(), z.undefined()])
    .transform((v) => (v === '' || v === null || v === undefined ? undefined : v.trim()))
    .optional(),

  tone: z.enum(['professional', 'casual', 'technical', 'tutorial']).catch('technical'),

  targetWords: z.coerce.number().int().min(200).max(2000).catch(800),

  generateImage: z
    .union([z.boolean(), z.enum(['true', 'false']), z.literal('')])
    .transform((v) => v === true || v === 'true')
    .catch(true),
});

export const aiRegenerateImageSchema = z.object({
  prompt: z.string().min(3).max(500).trim(),
});

// ============================================
// Types
// ============================================

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type ListBlogsInput = z.infer<typeof listBlogsQuerySchema>;
export type AIGenerateBlogInput = z.infer<typeof aiGenerateBlogSchema>;
export type AIRegenerateImageInput = z.infer<typeof aiRegenerateImageSchema>;
