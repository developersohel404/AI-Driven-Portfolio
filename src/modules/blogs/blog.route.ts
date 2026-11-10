// import { Router } from 'express';
// import { authenticate } from '../../middlewares/authenticate';
// import { authorize } from '../../middlewares/authorize';
// import { validate } from '../../middlewares/validate';
// import { blogController } from './blog.controller';
// import { createBlogSchema, listBlogsQuerySchema, updateBlogSchema } from './blog.validation';

// export const blogPublicRouter = Router();

// blogPublicRouter.get('/', validate(listBlogsQuerySchema, 'query'), blogController.listPublic);
// blogPublicRouter.get('/tags', blogController.listTagsPublic);
// blogPublicRouter.get('/:slug', blogController.getBySlugPublic);

// export const blogAdminRouter = Router();

// blogAdminRouter.use(authenticate, authorize('ADMIN'));

// blogAdminRouter.get('/', validate(listBlogsQuerySchema, 'query'), blogController.listAdmin);
// blogAdminRouter.get('/:id', blogController.getByIdAdmin);
// blogAdminRouter.post('/', validate(createBlogSchema), blogController.create);
// blogAdminRouter.patch('/:id', validate(updateBlogSchema), blogController.update);
// blogAdminRouter.delete('/:id', blogController.remove);
// blogAdminRouter.patch('/:id/status', blogController.setStatus);

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { blogController } from './blog.controller';
import {
  aiGenerateBlogSchema,
  aiRegenerateImageSchema,
  createBlogSchema,
  listBlogsQuerySchema,
  updateBlogSchema,
} from './blog.validation';

// ---------- PUBLIC ----------
export const blogPublicRouter = Router();

blogPublicRouter.get('/', validate(listBlogsQuerySchema, 'query'), blogController.listPublic);
blogPublicRouter.get('/tags', blogController.listTagsPublic);
blogPublicRouter.get('/:slug', blogController.getBySlugPublic);

// ---------- ADMIN ----------
export const blogAdminRouter = Router();

const aiLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  message: { success: false, message: 'Too many AI requests. Slow down.' },
});

blogAdminRouter.use(authenticate, authorize('ADMIN'));

// ✅ AI routes (specific — আগে রাখতে হবে)
blogAdminRouter.post(
  '/ai/generate',
  aiLimiter,
  validate(aiGenerateBlogSchema),
  blogController.aiGenerate
);
blogAdminRouter.post(
  '/ai/regenerate-image',
  aiLimiter,
  validate(aiRegenerateImageSchema),
  blogController.aiRegenerateImage
);

// CRUD
blogAdminRouter.get('/', validate(listBlogsQuerySchema, 'query'), blogController.listAdmin);
blogAdminRouter.get('/:id', blogController.getByIdAdmin);
blogAdminRouter.post('/', validate(createBlogSchema), blogController.create);
blogAdminRouter.patch('/:id', validate(updateBlogSchema), blogController.update);
blogAdminRouter.delete('/:id', blogController.remove);
blogAdminRouter.patch('/:id/status', blogController.setStatus);
