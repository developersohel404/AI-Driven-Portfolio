"use strict";
// import { Router } from 'express';
// import { authenticate } from '../../middlewares/authenticate';
// import { authorize } from '../../middlewares/authorize';
// import { validate } from '../../middlewares/validate';
// import { blogController } from './blog.controller';
// import { createBlogSchema, listBlogsQuerySchema, updateBlogSchema } from './blog.validation';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogAdminRouter = exports.blogPublicRouter = void 0;
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
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validate_1 = require("../../middlewares/validate");
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
// ---------- PUBLIC ----------
exports.blogPublicRouter = (0, express_1.Router)();
exports.blogPublicRouter.get('/', (0, validate_1.validate)(blog_validation_1.listBlogsQuerySchema, 'query'), blog_controller_1.blogController.listPublic);
exports.blogPublicRouter.get('/tags', blog_controller_1.blogController.listTagsPublic);
exports.blogPublicRouter.get('/:slug', blog_controller_1.blogController.getBySlugPublic);
// ---------- ADMIN ----------
exports.blogAdminRouter = (0, express_1.Router)();
const aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 5,
    message: { success: false, message: 'Too many AI requests. Slow down.' },
});
exports.blogAdminRouter.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
// ✅ AI routes (specific — আগে রাখতে হবে)
exports.blogAdminRouter.post('/ai/generate', aiLimiter, (0, validate_1.validate)(blog_validation_1.aiGenerateBlogSchema), blog_controller_1.blogController.aiGenerate);
exports.blogAdminRouter.post('/ai/regenerate-image', aiLimiter, (0, validate_1.validate)(blog_validation_1.aiRegenerateImageSchema), blog_controller_1.blogController.aiRegenerateImage);
// CRUD
exports.blogAdminRouter.get('/', (0, validate_1.validate)(blog_validation_1.listBlogsQuerySchema, 'query'), blog_controller_1.blogController.listAdmin);
exports.blogAdminRouter.get('/:id', blog_controller_1.blogController.getByIdAdmin);
exports.blogAdminRouter.post('/', (0, validate_1.validate)(blog_validation_1.createBlogSchema), blog_controller_1.blogController.create);
exports.blogAdminRouter.patch('/:id', (0, validate_1.validate)(blog_validation_1.updateBlogSchema), blog_controller_1.blogController.update);
exports.blogAdminRouter.delete('/:id', blog_controller_1.blogController.remove);
exports.blogAdminRouter.patch('/:id/status', blog_controller_1.blogController.setStatus);
