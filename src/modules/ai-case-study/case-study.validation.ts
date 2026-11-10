// import { z } from 'zod';

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
import { z } from 'zod';

export const generateCaseStudySchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
  source: z.enum(['readme', 'manual']).default('manual'),
  readme: z.string().max(20_000).optional(),
  description: z.string().max(5_000).optional(),
  techStack: z.array(z.string().min(1).max(40)).max(20).optional(),
  problem: z.string().max(3_000).optional(),
  saveAsDraft: z.boolean().default(false),
});

export const saveCaseStudySchema = z.object({
  projectId: z.string().min(1),
  problem: z.string().max(3000).optional(),
  goals: z.string().max(3000).optional(),
  solution: z.string().max(3000).optional(),
  architecture: z.string().max(4000).optional(),
  decisions: z.string().max(3000).optional(),
  challenges: z.string().max(3000).optional(),
  lessonsLearned: z.string().max(3000).optional(),
  futureWork: z.string().max(3000).optional(),
  publish: z.boolean().default(false),
});

export type GenerateCaseStudyInput = z.infer<typeof generateCaseStudySchema>;
export type SaveCaseStudyInput = z.infer<typeof saveCaseStudySchema>;
