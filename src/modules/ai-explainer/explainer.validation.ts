// import { z } from 'zod';

// export const explainInputSchema = z.object({
//   code: z.string().min(5, 'Code is too short').max(4000, 'Code is too long (max 4000 chars)'),
//   language: z.string().max(30).trim().optional(),
//   question: z.string().max(300).trim().optional(),
// });

// export type ExplainInput = z.infer<typeof explainInputSchema>;
import { z } from 'zod';

export const explainInputSchema = z.object({
  code: z.string().min(5, 'Code is too short').max(4000, 'Code is too long (max 4000 chars)'),
  language: z.string().max(30).trim().optional(),
  question: z.string().max(300).trim().optional(),
});

export type ExplainInput = z.infer<typeof explainInputSchema>;
