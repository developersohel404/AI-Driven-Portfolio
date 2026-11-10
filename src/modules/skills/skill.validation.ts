// import { z } from 'zod';

// export const createSkillSchema = z.object({
//   name: z.string().min(1).max(60).trim(),
//   category: z.string().min(1).max(40).trim(),
//   icon: z.string().max(80).optional(),
//   level: z.number().int().min(0).max(100).optional(),
//   order: z.number().int().min(0).optional(),
// });

// export const updateSkillSchema = createSkillSchema.partial();

// export const listSkillsQuerySchema = z.object({
//   category: z.string().trim().optional(),
//   search: z.string().trim().optional(),
// });

// export type CreateSkillInput = z.infer<typeof createSkillSchema>;
// export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
// export type ListSkillsInput = z.infer<typeof listSkillsQuerySchema>;

import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(1).max(60).trim(),
  category: z.string().min(1).max(40).trim(),
  icon: z.string().max(80).optional(),
  level: z.number().int().min(0).max(100).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateSkillSchema = createSkillSchema.partial();

export const listSkillsQuerySchema = z.object({
  category: z.string().trim().optional(),
  search: z.string().trim().optional(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
export type ListSkillsInput = z.infer<typeof listSkillsQuerySchema>;
