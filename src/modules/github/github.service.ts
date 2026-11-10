import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { AppError } from '../../middlewares/error-handler';

const GITHUB_API = 'https://api.github.com';
const CACHE_TTL_MS = 5 * 60 * 1000;
const CONTRIB_CACHE_TTL_MS = 30 * 60 * 1000;

interface GithubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
}

interface GithubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  updated_at: string;
}

interface CachedStats {
  user: GithubUser;
  repos: GithubRepo[];
  totalStars: number;
  fetchedAt: number;
}

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface CachedContributions {
  total: Record<string, number>;
  contributions: ContributionDay[];
  fetchedAt: number;
}

interface LanguageStat {
  name: string;
  bytes: number;
  percent: number;
}

interface CachedLanguages {
  languages: LanguageStat[];
  totalBytes: number;
  topLanguage: string | null;
  fetchedAt: number;
}

let statsCache: CachedStats | null = null;
let statsCacheUsername: string | null = null;
const contributionsCache = new Map<string, CachedContributions>();
const languageCache = new Map<string, CachedLanguages>();

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sohel-portfolio',
  };
  if (env.GITHUB_TOKEN) h.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  return h;
}

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: headers() });
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get('x-ratelimit-reset');
    throw new AppError(
      `GitHub API rate limit reached. Try again ${
        reset ? `after ${new Date(Number(reset) * 1000).toISOString()}` : 'later'
      }.`,
      429
    );
  }
  if (res.status === 404) {
    throw new AppError('GitHub user not found', 404);
  }
  if (!res.ok) {
    throw new AppError(`GitHub API error: ${res.status}`, 502);
  }
  return res.json() as Promise<T>;
}

export const githubService = {
  async getStats(username: string, force = false) {
    if (!username) throw new AppError('GitHub username is required', 400);

    if (
      !force &&
      statsCache &&
      statsCacheUsername === username &&
      Date.now() - statsCache.fetchedAt < CACHE_TTL_MS
    ) {
      return { ...statsCache, cached: true };
    }

    try {
      const [user, repos] = await Promise.all([
        ghFetch<GithubUser>(`/users/${username}`),
        ghFetch<GithubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`),
      ]);

      const ownRepos = repos
        .filter((r) => !r.fork)
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

      const data: CachedStats = {
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
    } catch (err) {
      if (statsCache && statsCacheUsername === username) {
        logger.warn({ err }, 'GitHub fetch failed, using stale cache');
        return { ...statsCache, cached: true, stale: true };
      }
      throw err;
    }
  },

  async getContributions(username: string) {
    if (!username) throw new AppError('GitHub username is required', 400);

    const cached = contributionsCache.get(username);
    if (cached && Date.now() - cached.fetchedAt < CONTRIB_CACHE_TTL_MS) {
      return {
        total: cached.total,
        contributions: cached.contributions,
        cached: true,
      };
    }

    try {
      const res = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        { headers: { 'User-Agent': 'sohel-portfolio' } }
      );

      if (!res.ok) throw new Error(`Contributions API ${res.status}`);

      const data = (await res.json()) as {
        total: Record<string, number>;
        contributions: ContributionDay[];
      };

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
    } catch (err) {
      logger.warn({ err, username }, 'Failed to fetch GitHub contributions');
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

  async getLanguageStats(username: string) {
    if (!username) throw new AppError('GitHub username is required', 400);

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
      const repos = await ghFetch<GithubRepo[]>(
        `/users/${username}/repos?per_page=100&sort=updated`
      );

      // ✅ Fork বাদ + limit 100
      const own = repos.filter((r) => !r.fork).slice(0, 100);

      const results = await Promise.allSettled(
        own.map((r) => ghFetch<Record<string, number>>(`/repos/${r.full_name}/languages`))
      );

      const totals: Record<string, number> = {};
      for (const res of results) {
        if (res.status !== 'fulfilled') continue;
        for (const [lang, bytes] of Object.entries(res.value)) {
          totals[lang] = (totals[lang] ?? 0) + bytes;
        }
      }

      const totalBytes = Object.values(totals).reduce((a, b) => a + b, 0);
      const languages: LanguageStat[] = Object.entries(totals)
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
    } catch (err) {
      logger.warn({ err, username }, 'Failed to fetch GitHub language stats');
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
