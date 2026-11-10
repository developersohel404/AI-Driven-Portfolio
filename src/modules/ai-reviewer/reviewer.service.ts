import { AI_LIMITS } from '../../config/constants';
import { aiService } from '../../lib/ai/ai-service';
import { reviewerFetcher } from './reviewer.fetcher';
import { buildReviewerMessages, parseReviewJson } from './reviewer.prompt';
import type { ReviewReply } from './reviewer.type';
import type { ReviewInput } from './reviewer.validation';
import { parseGithubUrl } from './reviewer.validation';

const CACHE_TTL_MS = 10 * 60 * 1000; // ১০ মিনিট
const cache = new Map<string, { reply: ReviewReply; ts: number }>();

export const reviewerService = {
  async review(input: ReviewInput): Promise<ReviewReply> {
    const { owner, repo } = parseGithubUrl(input.repoUrl);
    const key = `${owner}/${repo}:${input.focus ?? 'general'}`;

    const hit = cache.get(key);
    if (hit && Date.now() - hit.ts < CACHE_TTL_MS) {
      return { ...hit.reply, cached: true };
    }

    const { repoMeta, files } = await reviewerFetcher.fetchRepoContent(owner, repo);
    if (files.length === 0) {
      throw new Error('No reviewable files found in repository.');
    }

    const messages = buildReviewerMessages(input, files);
    const result = await aiService.generate('CODE_REVIEW', messages, {
      maxOutputTokens: AI_LIMITS.MAX_OUTPUT_TOKENS,
      temperature: 0.2,
    });

    const parsed = parseReviewJson(result.text);

    const reply: ReviewReply = {
      repo: `${owner}/${repo}`,
      reviewedFiles: files.map((f) => f.path),
      summary: parsed.summary,
      findings: parsed.findings.map((f) => ({
        file: f.file,
        issue: f.issue,
        severity: f.severity as ReviewReply['findings'][number]['severity'],
        suggestion: f.suggestion,
      })),
      provider: result.provider,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      cached: false,
      disclaimer: 'This is a limited static review of a few files, not a full security audit.',
    };

    cache.set(key, { reply, ts: Date.now() });
    return reply;
  },
};
