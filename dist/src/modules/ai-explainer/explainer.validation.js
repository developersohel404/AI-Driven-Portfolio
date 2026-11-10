"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainInputSchema = void 0;
// export const explainInputSchema = z.object({
//   code: z.string().min(5, 'Code is too short').max(4000, 'Code is too long (max 4000 chars)'),
//   language: z.string().max(30).trim().optional(),
//   question: z.string().max(300).trim().optional(),
// });
// export type ExplainInput = z.infer<typeof explainInputSchema>;
const zod_1 = require("zod");
exports.explainInputSchema = zod_1.z.object({
    code: zod_1.z.string().min(5, 'Code is too short').max(4000, 'Code is too long (max 4000 chars)'),
    language: zod_1.z.string().max(30).trim().optional(),
    question: zod_1.z.string().max(300).trim().optional(),
});
