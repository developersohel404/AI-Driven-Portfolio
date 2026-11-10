"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewerService = void 0;
const constants_1 = require("../../config/constants");
const ai_service_1 = require("../../lib/ai/ai-service");
const reviewer_fetcher_1 = require("./reviewer.fetcher");
const reviewer_prompt_1 = require("./reviewer.prompt");
const reviewer_validation_1 = require("./reviewer.validation");
const CACHE_TTL_MS = 10 * 60 * 1000; // ১০ মিনিট
const cache = new Map();
exports.reviewerService = {
    async review(input) {
        const { owner, repo } = (0, reviewer_validation_1.parseGithubUrl)(input.repoUrl);
        const key = `${owner}/${repo}:${input.focus ?? 'general'}`;
        const hit = cache.get(key);
        if (hit && Date.now() - hit.ts < CACHE_TTL_MS) {
            return { ...hit.reply, cached: true };
        }
        const { repoMeta, files } = await reviewer_fetcher_1.reviewerFetcher.fetchRepoContent(owner, repo);
        if (files.length === 0) {
            throw new Error('No reviewable files found in repository.');
        }
        const messages = (0, reviewer_prompt_1.buildReviewerMessages)(input, files);
        const result = await ai_service_1.aiService.generate('CODE_REVIEW', messages, {
            maxOutputTokens: constants_1.AI_LIMITS.MAX_OUTPUT_TOKENS,
            temperature: 0.2,
        });
        const parsed = (0, reviewer_prompt_1.parseReviewJson)(result.text);
        const reply = {
            repo: `${owner}/${repo}`,
            reviewedFiles: files.map((f) => f.path),
            summary: parsed.summary,
            findings: parsed.findings.map((f) => ({
                file: f.file,
                issue: f.issue,
                severity: f.severity,
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
