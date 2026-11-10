"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubService = void 0;
const env_1 = require("../../config/env");
const logger_1 = require("../../config/logger");
const error_handler_1 = require("../../middlewares/error-handler");
const GITHUB_API = 'https://api.github.com';
const CACHE_TTL_MS = 5 * 60 * 1000;
const CONTRIB_CACHE_TTL_MS = 30 * 60 * 1000;
let statsCache = null;
let statsCacheUsername = null;
const contributionsCache = new Map();
const languageCache = new Map();
function headers() {
    const h = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'sohel-portfolio',
    };
    if (env_1.env.GITHUB_TOKEN)
        h.Authorization = `Bearer ${env_1.env.GITHUB_TOKEN}`;
    return h;
}
async function ghFetch(path) {
    const res = await fetch(`${GITHUB_API}${path}`, { headers: headers() });
    if (res.status === 403 || res.status === 429) {
        const reset = res.headers.get('x-ratelimit-reset');
        throw new error_handler_1.AppError(`GitHub API rate limit reached. Try again ${reset ? `after ${new Date(Number(reset) * 1000).toISOString()}` : 'later'}.`, 429);
    }
    if (res.status === 404) {
        throw new error_handler_1.AppError('GitHub user not found', 404);
    }
    if (!res.ok) {
        throw new error_handler_1.AppError(`GitHub API error: ${res.status}`, 502);
    }
    return res.json();
}
exports.githubService = {
    async getStats(username, force = false) {
        if (!username)
            throw new error_handler_1.AppError('GitHub username is required', 400);
        if (!force &&
            statsCache &&
            statsCacheUsername === username &&
            Date.now() - statsCache.fetchedAt < CACHE_TTL_MS) {
            return { ...statsCache, cached: true };
        }
        try {
            const [user, repos] = await Promise.all([
                ghFetch(`/users/${username}`),
                ghFetch(`/users/${username}/repos?per_page=100&sort=updated`),
            ]);
            const ownRepos = repos
                .filter((r) => !r.fork)
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
            const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
            const data = {
                user,
                repos: ownRepos,
                totalStars,
                fetchedAt: Date.now(),
            };
            statsCache = data;
            statsCacheUsername = username;
            return {
                user,
                repos: ownRepos.slice(0, 12),
                totalStars,
                repoCount: ownRepos.length,
                cached: false,
            };
        }
        catch (err) {
            if (statsCache && statsCacheUsername === username) {
                logger_1.logger.warn({ err }, 'GitHub fetch failed, using stale cache');
                return { ...statsCache, cached: true, stale: true };
            }
            throw err;
        }
    },
    async getContributions(username) {
        if (!username)
            throw new error_handler_1.AppError('GitHub username is required', 400);
        const cached = contributionsCache.get(username);
        if (cached && Date.now() - cached.fetchedAt < CONTRIB_CACHE_TTL_MS) {
            return {
                total: cached.total,
                contributions: cached.contributions,
                cached: true,
            };
        }
        try {
            const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, { headers: { 'User-Agent': 'sohel-portfolio' } });
            if (!res.ok)
                throw new Error(`Contributions API ${res.status}`);
            const data = (await res.json());
            contributionsCache.set(username, {
                total: data.total,
                contributions: data.contributions,
                fetchedAt: Date.now(),
            });
            return {
                total: data.total,
                contributions: data.contributions,
                cached: false,
            };
        }
        catch (err) {
            logger_1.logger.warn({ err, username }, 'Failed to fetch GitHub contributions');
            if (cached) {
                return {
                    total: cached.total,
                    contributions: cached.contributions,
                    cached: true,
                    stale: true,
                };
            }
            return { total: {}, contributions: [], cached: false };
        }
    },
    async getLanguageStats(username) {
        if (!username)
            throw new error_handler_1.AppError('GitHub username is required', 400);
        const cached = languageCache.get(username);
        if (cached && Date.now() - cached.fetchedAt < CONTRIB_CACHE_TTL_MS) {
            return {
                languages: cached.languages,
                totalBytes: cached.totalBytes,
                topLanguage: cached.topLanguage,
                cached: true,
            };
        }
        try {
            // ✅ 100টি repo পর্যন্ত
            const repos = await ghFetch(`/users/${username}/repos?per_page=100&sort=updated`);
            // ✅ Fork বাদ + limit 100
            const own = repos.filter((r) => !r.fork).slice(0, 100);
            const results = await Promise.allSettled(own.map((r) => ghFetch(`/repos/${r.full_name}/languages`)));
            const totals = {};
            for (const res of results) {
                if (res.status !== 'fulfilled')
                    continue;
                for (const [lang, bytes] of Object.entries(res.value)) {
                    totals[lang] = (totals[lang] ?? 0) + bytes;
                }
            }
            const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0);
            const languages = Object.entries(totals)
                .sort(([, a], [, b]) => b - a)
                .map(([name, bytes]) => ({
                name,
                bytes,
                percent: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
            }));
            const data = {
                languages,
                totalBytes,
                topLanguage: languages[0]?.name ?? null,
            };
            languageCache.set(username, { ...data, fetchedAt: Date.now() });
            return { ...data, cached: false };
        }
        catch (err) {
            logger_1.logger.warn({ err, username }, 'Failed to fetch GitHub language stats');
            if (cached) {
                return {
                    languages: cached.languages,
                    totalBytes: cached.totalBytes,
                    topLanguage: cached.topLanguage,
                    cached: true,
                    stale: true,
                };
            }
            return { languages: [], totalBytes: 0, topLanguage: null, cached: false };
        }
    },
};
