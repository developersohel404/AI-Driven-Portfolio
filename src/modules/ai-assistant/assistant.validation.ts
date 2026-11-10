// import { z } from 'zod';

// export const chatInputSchema = z.object({
//   sessionId: z.string().uuid().optional(),
//   message: z.string().min(1).max(2000).trim(),
// });

// export type ChatInput = z.infer<typeof chatInputSchema>;

import { z } from 'zod';

export const chatInputSchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().min(1).max(2000).trim(),
});

export type ChatInput = z.infer<typeof chatInputSchema>;
