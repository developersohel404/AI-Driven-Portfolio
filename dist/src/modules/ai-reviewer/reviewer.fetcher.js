"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewerFetcher = void 0;
const env_1 = require("../../config/env");
const error_handler_1 = require("../../middlewares/error-handler");
const GH_API = 'https://api.github.com';
/** কেবল এই এক্সটেনশনগুলোই পড়া হবে — no binaries, no configs with secrets */
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.md'];
/** বাদ দেওয়া হবে এমন ফাইল */
const IGNORED_PATTERNS = [
    /\.env/i,
    /\.pem$/i,
    /\.key$/i,
    /secret/i,
    /credential/i,
    /node_modules\//i,
    /dist\//i,
    /build\//i,
    /\.min\./i,
    /package-lock\.json$/i,
    /yarn\.lock$/i,
    /pnpm-lock\.yaml$/i,
];
const MAX_FILE_BYTES = 15_000; // প্রতি ফাইল ১৫KB
const MAX_TOTAL_FILES = 6; // মোট ৬টি ফাইল
const MAX_TOTAL_BYTES = 60_000; // মোট ৬০KB
function ghHeaders() {
    const h = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'sohel-portfolio-reviewer',
    };
    if (env_1.env.GITHUB_TOKEN)
        h.Authorization = `Bearer ${env_1.env.GITHUB_TOKEN}`;
    return h;
}
async function ghFetch(path) {
    const res = await fetch(`${GH_API}${path}`, { headers: ghHeaders() });
    if (res.status === 404)
        throw new error_handler_1.AppError('Repository or file not found', 404);
    if (res.status === 403 || res.status === 429) {
        throw new error_handler_1.AppError('GitHub API rate limit reached. Try again later.', 429);
    }
    if (!res.ok)
        throw new error_handler_1.AppError(`GitHub API error: ${res.status}`, 502);
    return res.json();
}
exports.reviewerFetcher = {
    async fetchRepoContent(owner, repo) {
        // 1. Repo meta
        const repoMeta = await ghFetch(`/repos/${owner}/${repo}`);
        // repo বড় হলে বাদ (ডিফেন্স)
        if (repoMeta.size > 50_000) {
            throw new error_handler_1.AppError('Repository is too large to review safely', 413);
        }
        // 2. Tree
        const tree = await ghFetch(`/repos/${owner}/${repo}/git/trees/${repoMeta.default_branch}?recursive=1`);
        // 3. README খুঁজি (সর্বোচ্চ প্রায়োরিটি)
        const readmeEntry = tree.tree.find((t) => t.type === 'blob' && /^readme(\.md|\.markdown)?$/i.test(t.path.split('/').pop() ?? ''));
        // 4. নিরাপদ source files
        const candidates = tree.tree
            .filter((t) => {
            if (t.type !== 'blob')
                return false;
            if (!t.size || t.size > MAX_FILE_BYTES)
                return false;
            if (IGNORED_PATTERNS.some((p) => p.test(t.path)))
                return false;
            const lower = t.path.toLowerCase();
            return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
        })
            // deep nest বাদ, বড় ফাইল বাদ
            .sort((a, b) => a.path.split('/').length - b.path.split('/').length);
        const selected = new Set();
        let totalBytes = 0;
        if (readmeEntry) {
            selected.add(readmeEntry.path);
            totalBytes += readmeEntry.size ?? 0;
        }
        for (const c of candidates) {
            if (selected.size >= MAX_TOTAL_FILES)
                break;
            if (selected.has(c.path))
                continue;
            const size = c.size ?? 0;
            if (totalBytes + size > MAX_TOTAL_BYTES)
                break;
            selected.add(c.path);
            totalBytes += size;
        }
        // 5. Contents fetch (parallel, তবে সীমিত)
        const contents = await Promise.all(Array.from(selected).map(async (path) => {
            const data = await ghFetch(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`);
            const text = data.encoding === 'base64'
                ? Buffer.from(data.content, 'base64').toString('utf-8')
                : data.content;
            return { path, content: text.slice(0, MAX_FILE_BYTES) };
        }));
        return {
            repoMeta: {
                default_branch: repoMeta.default_branch,
                description: repoMeta.description,
                stars: repoMeta.stargazers_count,
                language: repoMeta.language,
            },
            files: contents,
        };
    },
};
