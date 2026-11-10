"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCaseStudySchema = exports.generateCaseStudySchema = void 0;
// export const generateCaseStudySchema = z.object({
//   projectId: z.string().min(1, 'projectId is required'),
//   source: z.enum(['readme', 'manual']).default('manual'),
//   readme: z.string().max(20_000).optional(),
//   description: z.string().max(5_000).optional(),
//   techStack: z.array(z.string().min(1).max(40)).max(20).optional(),
//   problem: z.string().max(3_000).optional(),
//   saveAsDraft: z.boolean().default(false),
// });
// export const saveCaseStudySchema = z.object({
//   projectId: z.string().min(1),
//   problem: z.string().max(3000).optional(),
//   goals: z.string().max(3000).optional(),
//   solution: z.string().max(3000).optional(),
//   architecture: z.string().max(4000).optional(),
//   decisions: z.string().max(3000).optional(),
//   challenges: z.string().max(3000).optional(),
//   lessonsLearned: z.string().max(3000).optional(),
//   futureWork: z.string().max(3000).optional(),
//   publish: z.boolean().default(false),
// });
// export type GenerateCaseStudyInput = z.infer<typeof generateCaseStudySchema>;
// export type SaveCaseStudyInput = z.infer<typeof saveCaseStudySchema>;
const zod_1 = require("zod");
exports.generateCaseStudySchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1, 'projectId is required'),
    source: zod_1.z.enum(['readme', 'manual']).default('manual'),
    readme: zod_1.z.string().max(20_000).optional(),
    description: zod_1.z.string().max(5_000).optional(),
    techStack: zod_1.z.array(zod_1.z.string().min(1).max(40)).max(20).optional(),
    problem: zod_1.z.string().max(3_000).optional(),
    saveAsDraft: zod_1.z.boolean().default(false),
});
exports.saveCaseStudySchema = zod_1.z.object({
    projectId: zod_1.z.string().min(1),
    problem: zod_1.z.string().max(3000).optional(),
    goals: zod_1.z.string().max(3000).optional(),
    solution: zod_1.z.string().max(3000).optional(),
    architecture: zod_1.z.string().max(4000).optional(),
    decisions: zod_1.z.string().max(3000).optional(),
    challenges: zod_1.z.string().max(3000).optional(),
    lessonsLearned: zod_1.z.string().max(3000).optional(),
    futureWork: zod_1.z.string().max(3000).optional(),
    publish: zod_1.z.boolean().default(false),
});
