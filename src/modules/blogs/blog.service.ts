// import { prisma } from '../../lib/prisma';
// import { AppError } from '../../middlewares/error-handler';
// import { generateSlug } from '../../utils/slug';
// import type { BlogListResult } from './blog.type';
// import type { CreateBlogInput, ListBlogsInput, UpdateBlogInput } from './blog.validation';

// const authorSelect = { select: { id: true, name: true, email: true } } as const;

// async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
//   let slug = base;
//   let i = 1;
//   while (true) {
//     const existing = await prisma.blogPost.findUnique({
//       where: { slug },
//       select: { id: true },
//     });
//     if (!existing || existing.id === ignoreId) return slug;
//     slug = `${base}-${++i}`;
//   }
// }

// export const blogService = {
//   async list(input: ListBlogsInput, includeDrafts = false): Promise<BlogListResult> {
//     const { page, limit, search, tag, status } = input;
//     const skip = (page - 1) * limit;

//     const where: Record<string, unknown> = {};

//     if (!includeDrafts) {
//       where.status = 'PUBLISHED';
//     } else if (status) {
//       where.status = status;
//     }

//     if (tag) {
//       where.tags = { some: { name: tag } };
//     }

//     if (search) {
//       where.OR = [
//         { title: { contains: search, mode: 'insensitive' } },
//         { excerpt: { contains: search, mode: 'insensitive' } },
//         { content: { contains: search, mode: 'insensitive' } },
//       ];
//     }

//     const [items, total] = await Promise.all([
//       prisma.blogPost.findMany({
//         where,
//         include: { tags: true, author: authorSelect },
//         orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
//         skip,
//         take: limit,
//       }),
//       prisma.blogPost.count({ where }),
//     ]);

//     return {
//       items,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit) || 1,
//     };
//   },

//   async getBySlug(slug: string, includeDrafts = false) {
//     const post = await prisma.blogPost.findUnique({
//       where: { slug },
//       include: { tags: true, author: authorSelect },
//     });
//     if (!post) throw new AppError('Blog post not found', 404);
//     if (!includeDrafts && post.status !== 'PUBLISHED') {
//       throw new AppError('Blog post not found', 404);
//     }
//     return post;
//   },

//   async getById(id: string) {
//     const post = await prisma.blogPost.findUnique({
//       where: { id },
//       include: { tags: true, author: authorSelect },
//     });
//     if (!post) throw new AppError('Blog post not found', 404);
//     return post;
//   },

//   async create(authorId: string, input: CreateBlogInput) {
//     const slug = await ensureUniqueSlug(input.slug ?? generateSlug(input.title));

//     const { tags, ...rest } = input;
//     const publishedAt = input.status === 'PUBLISHED' ? new Date() : null;

//     return prisma.blogPost.create({
//       data: {
//         ...rest,
//         slug,
//         authorId,
//         publishedAt,
//         tags: tags?.length ? { create: tags.map((name) => ({ name })) } : undefined,
//       },
//       include: { tags: true, author: authorSelect },
//     });
//   },

//   async update(id: string, input: UpdateBlogInput) {
//     const existing = await this.getById(id);

//     let slug = existing.slug;
//     if (input.slug && input.slug !== existing.slug) {
//       slug = await ensureUniqueSlug(input.slug, id);
//     } else if (!input.slug && input.title && input.title !== existing.title) {
//       slug = await ensureUniqueSlug(generateSlug(input.title), id);
//     }

//     // publishedAt logic
//     let publishedAt = existing.publishedAt;
//     if (input.status) {
//       if (input.status === 'PUBLISHED' && !publishedAt) {
//         publishedAt = new Date();
//       } else if (input.status !== 'PUBLISHED') {
//         // DRAFT/ARCHIVED-এ ফেরত গেলে publishedAt মুছে ফেলি না (history রাখি)
//         // চাইলে null করে দিতে পারেন
//       }
//     }

//     const { tags, ...rest } = input;

//     return prisma.blogPost.update({
//       where: { id },
//       data: {
//         ...rest,
//         slug,
//         publishedAt,
//         ...(tags
//           ? {
//               tags: {
//                 deleteMany: {},
//                 create: tags.map((name) => ({ name })),
//               },
//             }
//           : {}),
//       },
//       include: { tags: true, author: authorSelect },
//     });
//   },

//   async remove(id: string) {
//     await this.getById(id);
//     await prisma.blogPost.delete({ where: { id } });
//   },

//   async incrementViews(slug: string) {
//     await prisma.blogPost
//       .update({ where: { slug }, data: { views: { increment: 1 } } })
//       .catch(() => {
//         /* silent — analytics never breaks page */
//       });
//   },

//   async setStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
//     const existing = await this.getById(id);
//     const publishedAt =
//       status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt;

//     return prisma.blogPost.update({
//       where: { id },
//       data: { status, publishedAt },
//       include: { tags: true, author: authorSelect },
//     });
//   },

//   async listAllTags() {
//     const tags = await prisma.blogTag.findMany({
//       select: { name: true },
//       distinct: ['name'],
//       orderBy: { name: 'asc' },
//     });
//     return tags.map((t) => t.name);
//   },
// };

import { env } from '../../config/env';
import { logger } from '../../config/logger';
import type { AIMessage } from '../../lib/ai/ai-provider';
import { aiService } from '../../lib/ai/ai-service';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import { generateSlug } from '../../utils/slug';
import type { BlogListResult } from './blog.type';
import type {
  AIGenerateBlogInput,
  CreateBlogInput,
  ListBlogsInput,
  UpdateBlogInput,
} from './blog.validation';

// ============================================================
// Helper: Author Select
// ============================================================

const authorSelect = { select: { id: true, name: true, email: true } } as const;

// ============================================================
// Helper: Unique Slug
// ============================================================

async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${++i}`;
  }
}

// ============================================================
// AI: System Prompt
// ============================================================

const AI_SYSTEM_PROMPT = `You are a technical blog writer that outputs ONLY valid JSON.

CRITICAL RULES:
1. Start your response with { on the very first character.
2. End your response with } on the very last character.
3. NO text before or after the JSON.
4. NO markdown fences around the JSON.
5. All string values must use DOUBLE quotes.
6. Escape newlines inside strings as \\n.
7. Escape double quotes inside strings as \\".

JSON shape:
{
  "title": "string (10-120 chars)",
  "excerpt": "string (50-280 chars, one sentence)",
  "content": "string (markdown, use \\n for line breaks, ## for sections)",
  "tags": ["tag1", "tag2", "tag3"],
  "metaTitle": "string (max 60 chars)",
  "metaDesc": "string (max 155 chars)",
  "imagePrompt": "string (60 words max, modern minimal dark illustration, cyan/navy palette, no text)"
}

Blog content rules:
- Short intro paragraph
- Use ## for section headings (not #)
- 3-5 sections with concrete examples
- Use **bold** and bullet lists
- End with a conclusion
- Total: 600-1200 words

Return ONLY the JSON object.`;

// ============================================================
// AI: Types & Builders
// ============================================================

interface ParsedAIDraft {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  metaTitle: string;
  metaDesc: string;
  imagePrompt: string;
}

function buildAIMessages(input: AIGenerateBlogInput): AIMessage[] {
  const parts = [
    `Topic: ${input.topic}`,
    input.outline ? `Outline:\n${input.outline}` : '',
    `Tone: ${input.tone}`,
    `Target length: ~${input.targetWords} words`,
    `Return JSON only. No prose. No code fences.`,
  ].filter(Boolean);

  return [
    { role: 'system', content: AI_SYSTEM_PROMPT },
    { role: 'user', content: parts.join('\n\n') },
  ];
}

function parseAIBlogJson(text: string): ParsedAIDraft {
  console.log('='.repeat(60));
  console.log('[AIBlog] Raw length:', text.length);
  console.log('[AIBlog] First 300:', text.slice(0, 300));
  console.log('[AIBlog] Last 150:', text.slice(-150));
  console.log('='.repeat(60));

  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json|JSON)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?```\s*$/i, '');

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  try {
    const o = JSON.parse(cleaned);
    console.log('[AIBlog] ✅ Parsed, keys:', Object.keys(o));

    const s = (k: string, fb = '') =>
      typeof o?.[k] === 'string' && o[k].trim() ? o[k].trim() : fb;
    const tags = Array.isArray(o?.tags)
      ? o.tags
          .filter((t: unknown) => typeof t === 'string' && (t as string).trim())
          .slice(0, 5)
          .map((t: string) => t.trim().toLowerCase())
      : [];

    return {
      title: s('title', 'Untitled'),
      excerpt: s('excerpt').slice(0, 280),
      content: s('content', '## Coming soon'),
      tags,
      metaTitle: s('metaTitle').slice(0, 60),
      metaDesc: s('metaDesc').slice(0, 155),
      imagePrompt: s(
        'imagePrompt',
        'A minimal dark developer workspace with cyan accents, isometric, no text'
      ),
    };
  } catch (err) {
    console.error('[AIBlog] ❌ Parse failed:', (err as Error).message);
    console.error('[AIBlog] Cleaned (first 500):', cleaned.slice(0, 500));

    const lines = text.split('\n');
    const titleLine = lines.find((l) => l.trim().startsWith('#'));
    const title = titleLine
      ? titleLine
          .replace(/^#+\s*/, '')
          .trim()
          .slice(0, 160)
      : 'Generated draft';

    return {
      title: title || 'Generated draft',
      excerpt:
        'AI returned an unparseable response. Raw content is preserved below — please review and edit.',
      content: text,
      tags: [],
      metaTitle: '',
      metaDesc: '',
      imagePrompt: 'A minimal dark developer workspace',
    };
  }
}

// ============================================================
// Pollinations URL Builder
// ============================================================

function buildPollinationsUrl(prompt: string): string {
  const encoded = encodeURIComponent(prompt.slice(0, 300));
  const seed = Math.floor(Math.random() * 1_000_000);

  if (env.POLLINATIONS_API_KEY) {
    return `https://gen.pollinations.ai/image/${encoded}?width=1200&height=630&seed=${seed}&model=flux&key=${env.POLLINATIONS_API_KEY}`;
  }
  return `https://image.pollinations.ai/prompt/${encoded}?width=1200&height=630&seed=${seed}&nologo=true`;
}

// ============================================================
// Blog Service
// ============================================================

export const blogService = {
  async list(input: ListBlogsInput, includeDrafts = false): Promise<BlogListResult> {
    const { page, limit, search, tag, status } = input;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};

    if (!includeDrafts) where.status = 'PUBLISHED';
    else if (status) where.status = status;

    if (tag) where.tags = { some: { name: tag } };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: { tags: true, author: authorSelect },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getBySlug(slug: string, includeDrafts = false) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { tags: true, author: authorSelect },
    });
    if (!post) throw new AppError('Blog post not found', 404);
    if (!includeDrafts && post.status !== 'PUBLISHED') {
      throw new AppError('Blog post not found', 404);
    }
    return post;
  },

  async getById(id: string) {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true, author: authorSelect },
    });
    if (!post) throw new AppError('Blog post not found', 404);
    return post;
  },

  async create(authorId: string, input: CreateBlogInput) {
    const slug = await ensureUniqueSlug(input.slug ?? generateSlug(input.title));
    const { tags, ...rest } = input;
    const publishedAt = input.status === 'PUBLISHED' ? new Date() : null;

    return prisma.blogPost.create({
      data: {
        ...rest,
        slug,
        authorId,
        publishedAt,
        tags: tags?.length ? { create: tags.map((name) => ({ name })) } : undefined,
      },
      include: { tags: true, author: authorSelect },
    });
  },

  async update(id: string, input: UpdateBlogInput) {
    const existing = await this.getById(id);
    let slug = existing.slug;
    if (input.slug && input.slug !== existing.slug) {
      slug = await ensureUniqueSlug(input.slug, id);
    } else if (!input.slug && input.title && input.title !== existing.title) {
      slug = await ensureUniqueSlug(generateSlug(input.title), id);
    }

    let publishedAt = existing.publishedAt;
    if (input.status) {
      if (input.status === 'PUBLISHED' && !publishedAt) publishedAt = new Date();
    }

    const { tags, ...rest } = input;

    return prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        slug,
        publishedAt,
        ...(tags
          ? {
              tags: {
                deleteMany: {},
                create: tags.map((name) => ({ name })),
              },
            }
          : {}),
      },
      include: { tags: true, author: authorSelect },
    });
  },

  async remove(id: string) {
    await this.getById(id);
    await prisma.blogPost.delete({ where: { id } });
  },

  async incrementViews(slug: string) {
    await prisma.blogPost
      .update({ where: { slug }, data: { views: { increment: 1 } } })
      .catch(() => {
        /* silent */
      });
  },

  async setStatus(id: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
    const existing = await this.getById(id);
    const publishedAt =
      status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt;

    return prisma.blogPost.update({
      where: { id },
      data: { status, publishedAt },
      include: { tags: true, author: authorSelect },
    });
  },

  async listAllTags() {
    const tags = await prisma.blogTag.findMany({
      select: { name: true },
      distinct: ['name'],
      orderBy: { name: 'asc' },
    });
    return tags.map((t) => t.name);
  },

  async aiGenerate(input: AIGenerateBlogInput): Promise<{
    draft: ParsedAIDraft & { coverUrl: string | null };
    provider: string;
    tokensIn: number;
    tokensOut: number;
    imageProvider: string;
    imageWarning?: string;
  }> {
    const messages = buildAIMessages(input);
    const result = await aiService.generate('BLOG_ASSISTANT', messages, {
      maxOutputTokens: 2000,
      temperature: 0.6,
    });

    logger.info(
      {
        responseLength: result.text.length,
        firstChars: result.text.slice(0, 200),
      },
      'AI blog raw response'
    );

    const parsed = parseAIBlogJson(result.text);

    let coverUrl: string | null = null;
    let imageProvider = 'none';
    let imageWarning: string | undefined;

    if (input.generateImage && parsed.imagePrompt) {
      coverUrl = buildPollinationsUrl(parsed.imagePrompt);
      imageProvider = env.POLLINATIONS_API_KEY ? 'pollinations-gen' : 'pollinations-classic';
      imageWarning =
        "Cover image may take 5-30 seconds to appear. If broken, click 'Regenerate image'.";
      logger.info({ imageProvider }, 'AI blog cover URL generated');
    }

    return {
      draft: { ...parsed, coverUrl },
      provider: result.provider,
      tokensIn: result.tokensIn,
      tokensOut: result.tokensOut,
      imageProvider,
      imageWarning,
    };
  },

  async aiRegenerateImage(prompt: string): Promise<{ coverUrl: string }> {
    if (!prompt.trim()) throw new AppError('Prompt is required', 422);
    return { coverUrl: buildPollinationsUrl(prompt) };
  },
};
