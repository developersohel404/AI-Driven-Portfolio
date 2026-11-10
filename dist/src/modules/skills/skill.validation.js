"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSkillsQuerySchema = exports.updateSkillSchema = exports.createSkillSchema = void 0;
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
const zod_1 = require("zod");
exports.createSkillSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(60).trim(),
    category: zod_1.z.string().min(1).max(40).trim(),
    icon: zod_1.z.string().max(80).optional(),
    level: zod_1.z.number().int().min(0).max(100).optional(),
    order: zod_1.z.number().int().min(0).optional(),
});
exports.updateSkillSchema = exports.createSkillSchema.partial();
exports.listSkillsQuerySchema = zod_1.z.object({
    category: zod_1.z.string().trim().optional(),
    search: zod_1.z.string().trim().optional(),
});
