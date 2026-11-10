// import { Request, Response } from 'express';
// import { AppError } from '../../middlewares/error-handler';
// import { sendResponse } from '../../utils/api-response';
// import { asyncHandler } from '../../utils/async-handler';
// import { blogService } from './blog.service';

// export const blogController = {
//   // ---------- PUBLIC ----------
//   listPublic: asyncHandler(async (req: Request, res: Response) => {
//     const result = await blogService.list(req.query as any, false);
//     return sendResponse(res, {
//       message: 'Blog posts fetched',
//       data: result.items,
//       meta: {
//         total: result.total,
//         page: result.page,
//         limit: result.limit,
//         totalPages: result.totalPages,
//       },
//     });
//   }),

//   getBySlugPublic: asyncHandler(async (req: Request, res: Response) => {
//     const slug = req.params.slug as string;
//     const post = await blogService.getBySlug(slug, false);
//     void blogService.incrementViews(slug);
//     return sendResponse(res, { message: 'Blog post fetched', data: post });
//   }),

//   listTagsPublic: asyncHandler(async (_req: Request, res: Response) => {
//     const tags = await blogService.listAllTags();
//     return sendResponse(res, { message: 'Tags fetched', data: tags });
//   }),

//   // ---------- ADMIN ----------
//   listAdmin: asyncHandler(async (req: Request, res: Response) => {
//     const result = await blogService.list(req.query as any, true);
//     return sendResponse(res, {
//       message: 'Blog posts fetched',
//       data: result.items,
//       meta: {
//         total: result.total,
//         page: result.page,
//         limit: result.limit,
//         totalPages: result.totalPages,
//       },
//     });
//   }),

//   getByIdAdmin: asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id as string;
//     const post = await blogService.getById(id);
//     return sendResponse(res, { message: 'Blog post fetched', data: post });
//   }),

//   create: asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) throw new AppError('Authentication required', 401);
//     const post = await blogService.create(req.user.id, req.body);
//     return sendResponse(res, {
//       statusCode: 201,
//       message: 'Blog post created',
//       data: post,
//     });
//   }),

//   update: asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id as string;
//     const post = await blogService.update(id, req.body);
//     return sendResponse(res, { message: 'Blog post updated', data: post });
//   }),

//   remove: asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id as string;
//     await blogService.remove(id);
//     return sendResponse(res, { message: 'Blog post deleted' });
//   }),

//   setStatus: asyncHandler(async (req: Request, res: Response) => {
//     const id = req.params.id as string;
//     const { status } = req.body as { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' };
//     if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
//       throw new AppError('Invalid status', 422);
//     }
//     const post = await blogService.setStatus(id, status);
//     return sendResponse(res, { message: 'Status updated', data: post });
//   }),
// };

import { Request, Response } from 'express';
import { AIProviderError } from '../../lib/ai/ai-provider';
import { AppError } from '../../middlewares/error-handler';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { blogService } from './blog.service';

export const blogController = {
  // ---------- Public ----------
  listPublic: asyncHandler(async (req: Request, res: Response) => {
    const result = await blogService.list(req.query as any, false);
    return sendResponse(res, {
      message: 'Blog posts fetched',
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }),

  getBySlugPublic: asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const post = await blogService.getBySlug(slug, false);
    void blogService.incrementViews(slug);
    return sendResponse(res, { message: 'Blog post fetched', data: post });
  }),

  listTagsPublic: asyncHandler(async (_req: Request, res: Response) => {
    const tags = await blogService.listAllTags();
    return sendResponse(res, { message: 'Tags fetched', data: tags });
  }),

  // ---------- Admin ----------
  listAdmin: asyncHandler(async (req: Request, res: Response) => {
    const result = await blogService.list(req.query as any, true);
    return sendResponse(res, {
      message: 'Blog posts fetched',
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  }),

  getByIdAdmin: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const post = await blogService.getById(id);
    return sendResponse(res, { message: 'Blog post fetched', data: post });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    const post = await blogService.create(req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Blog post created',
      data: post,
    });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const post = await blogService.update(id, req.body);
    return sendResponse(res, { message: 'Blog post updated', data: post });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await blogService.remove(id);
    return sendResponse(res, { message: 'Blog post deleted' });
  }),

  setStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body as { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' };
    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      throw new AppError('Invalid status', 422);
    }
    const post = await blogService.setStatus(id, status);
    return sendResponse(res, { message: 'Status updated', data: post });
  }),

  // ==========================================================
  // ✅ AI endpoints (admin)
  // ==========================================================
  aiGenerate: asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await blogService.aiGenerate(req.body);
      return sendResponse(res, {
        message: result.imageWarning
          ? 'Blog generated (image may still be loading)'
          : 'Blog generated',
        data: result,
      });
    } catch (err) {
      if (err instanceof AIProviderError) {
        if (err.code === 'QUOTA_EXHAUSTED') {
          return sendResponse(res, {
            statusCode: 429,
            success: false,
            message: 'AI quota reached. You can still write the blog manually.',
          });
        }
        if (err.code === 'PROVIDER_UNAVAILABLE') {
          return sendResponse(res, {
            statusCode: 503,
            success: false,
            message: 'AI unavailable. Manual editing still works.',
          });
        }
      }
      throw err;
    }
  }),

  aiRegenerateImage: asyncHandler(async (req: Request, res: Response) => {
    const { prompt } = req.body as { prompt: string };
    const result = await blogService.aiRegenerateImage(prompt);
    return sendResponse(res, { message: 'Image regenerated', data: result });
  }),
};
