// import { z } from 'zod';

// export const reviewInputSchema = z.object({
//   repoUrl: z
//     .string()
//     .url('Must be a valid URL')
//     .refine(
//       (url) => /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(url),
//       'Must be a GitHub repo URL like https://github.com/user/repo'
//     ),
//   focus: z.enum(['general', 'security', 'performance', 'readability']).optional(),
// });

// export type ReviewInput = z.infer<typeof reviewInputSchema>;

// /** URL normalize: https://github.com/user/repo → { owner, repo } */
// export function parseGithubUrl(url: string): { owner: string; repo: string } {
//   const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)/i);
//   if (!match) throw new Error('Invalid GitHub URL');
//   return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
// }

import { z } from 'zod';

export const reviewInputSchema = z.object({
  repoUrl: z
    .string()
    .url('Must be a valid URL')
    .refine(
      (url) => /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(url),
      'Must be a GitHub repo URL like https://github.com/user/repo'
    ),
  focus: z.enum(['general', 'security', 'performance', 'readability']).optional(),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;

export function parseGithubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}
