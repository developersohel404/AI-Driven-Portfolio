"use strict";
// import { Request, Response } from 'express';
// import { AppError } from '../../middlewares/error-handler';
// import { sendResponse } from '../../utils/api-response';
// import { asyncHandler } from '../../utils/async-handler';
// import { blogService } from './blog.service';
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = void 0;
const ai_provider_1 = require("../../lib/ai/ai-provider");
const error_handler_1 = require("../../middlewares/error-handler");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const blog_service_1 = require("./blog.service");
exports.blogController = {
    // ---------- Public ----------
    listPublic: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await blog_service_1.blogService.list(req.query, false);
        return (0, api_response_1.sendResponse)(res, {
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
    getBySlugPublic: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const slug = req.params.slug;
        const post = await blog_service_1.blogService.getBySlug(slug, false);
        void blog_service_1.blogService.incrementViews(slug);
        return (0, api_response_1.sendResponse)(res, { message: 'Blog post fetched', data: post });
    }),
    listTagsPublic: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const tags = await blog_service_1.blogService.listAllTags();
        return (0, api_response_1.sendResponse)(res, { message: 'Tags fetched', data: tags });
    }),
    // ---------- Admin ----------
    listAdmin: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await blog_service_1.blogService.list(req.query, true);
        return (0, api_response_1.sendResponse)(res, {
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
    getByIdAdmin: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const post = await blog_service_1.blogService.getById(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Blog post fetched', data: post });
    }),
    create: (0, async_handler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw new error_handler_1.AppError('Authentication required', 401);
        const post = await blog_service_1.blogService.create(req.user.id, req.body);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Blog post created',
            data: post,
        });
    }),
    update: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const post = await blog_service_1.blogService.update(id, req.body);
        return (0, api_response_1.sendResponse)(res, { message: 'Blog post updated', data: post });
    }),
    remove: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        await blog_service_1.blogService.remove(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Blog post deleted' });
    }),
    setStatus: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
            throw new error_handler_1.AppError('Invalid status', 422);
        }
        const post = await blog_service_1.blogService.setStatus(id, status);
        return (0, api_response_1.sendResponse)(res, { message: 'Status updated', data: post });
    }),
    // ==========================================================
    // ✅ AI endpoints (admin)
    // ==========================================================
    aiGenerate: (0, async_handler_1.asyncHandler)(async (req, res) => {
        try {
            const result = await blog_service_1.blogService.aiGenerate(req.body);
            return (0, api_response_1.sendResponse)(res, {
                message: result.imageWarning
                    ? 'Blog generated (image may still be loading)'
                    : 'Blog generated',
                data: result,
            });
        }
        catch (err) {
            if (err instanceof ai_provider_1.AIProviderError) {
                if (err.code === 'QUOTA_EXHAUSTED') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 429,
                        success: false,
                        message: 'AI quota reached. You can still write the blog manually.',
                    });
                }
                if (err.code === 'PROVIDER_UNAVAILABLE') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 503,
                        success: false,
                        message: 'AI unavailable. Manual editing still works.',
                    });
                }
            }
            throw err;
        }
    }),
    aiRegenerateImage: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { prompt } = req.body;
        const result = await blog_service_1.blogService.aiRegenerateImage(prompt);
        return (0, api_response_1.sendResponse)(res, { message: 'Image regenerated', data: result });
    }),
};
