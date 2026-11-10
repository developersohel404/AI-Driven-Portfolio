"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewInputSchema = void 0;
exports.parseGithubUrl = parseGithubUrl;
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
const zod_1 = require("zod");
exports.reviewInputSchema = zod_1.z.object({
    repoUrl: zod_1.z
        .string()
        .url('Must be a valid URL')
        .refine((url) => /^https?:\/\/github\.com\/[^/]+\/[^/]+\/?$/.test(url), 'Must be a GitHub repo URL like https://github.com/user/repo'),
    focus: zod_1.z.enum(['general', 'security', 'performance', 'readability']).optional(),
});
function parseGithubUrl(url) {
    const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)/i);
    if (!match)
        throw new Error('Invalid GitHub URL');
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}
