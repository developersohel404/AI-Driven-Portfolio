"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactStatusSchema = exports.listContactsQuerySchema = exports.submitContactSchema = void 0;
// export const submitContactSchema = z.object({
//   name: z.string().min(2).max(80).trim(),
//   email: z.string().email().toLowerCase().trim(),
//   phone: z.string().max(30).trim().optional(),
//   subject: z.string().max(160).trim().optional(),
//   message: z.string().min(10).max(3000).trim(),
//   projectType: z.string().max(80).trim().optional(),
//   budget: z.string().max(60).trim().optional(),
//   deadline: z.string().max(60).trim().optional(),
//   techStack: z.array(z.string().min(1).max(40)).max(20).optional(),
//   brief: z.string().max(2000).trim().optional(),
// });
// export const listContactsQuerySchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(20),
//   status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
//   search: z.string().trim().optional(),
// });
// export const updateContactStatusSchema = z.object({
//   status: z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']),
// });
// export type SubmitContactInput = z.infer<typeof submitContactSchema>;
// export type ListContactsInput = z.infer<typeof listContactsQuerySchema>;
// export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>;
const zod_1 = require("zod");
exports.submitContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80).trim(),
    email: zod_1.z.string().email().toLowerCase().trim(),
    phone: zod_1.z.string().max(30).trim().optional(),
    subject: zod_1.z.string().max(160).trim().optional(),
    message: zod_1.z.string().min(10).max(3000).trim(),
    projectType: zod_1.z.string().max(80).trim().optional(),
    budget: zod_1.z.string().max(60).trim().optional(),
    deadline: zod_1.z.string().max(60).trim().optional(),
    techStack: zod_1.z.array(zod_1.z.string().min(1).max(40)).max(20).optional(),
    brief: zod_1.z.string().max(2000).trim().optional(),
});
exports.listContactsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
    status: zod_1.z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']).optional(),
    search: zod_1.z.string().trim().optional(),
});
exports.updateContactStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['NEW', 'READ', 'REPLIED', 'ARCHIVED']),
});
