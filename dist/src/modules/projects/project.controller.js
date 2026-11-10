"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const project_service_1 = require("./project.service");
exports.projectController = {
    listPublic: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await project_service_1.projectService.list(req.query, false);
        return (0, api_response_1.sendResponse)(res, {
            message: 'Projects fetched',
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
        const slug = req.params.slug; // ✅ cast
        const project = await project_service_1.projectService.getBySlug(slug, false);
        void project_service_1.projectService.incrementViews(slug);
        return (0, api_response_1.sendResponse)(res, { message: 'Project fetched', data: project });
    }),
    listAdmin: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await project_service_1.projectService.list(req.query, true);
        return (0, api_response_1.sendResponse)(res, {
            message: 'Projects fetched',
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
        const id = req.params.id; // ✅ cast
        // slug বা id — দুটোই support করি
        let project = null;
        try {
            project = await project_service_1.projectService.getBySlug(id, true);
        }
        catch {
            project = await prisma_1.prisma.project.findUnique({
                where: { id },
                include: { technologies: true },
            });
        }
        if (!project)
            throw new error_handler_1.AppError('Project not found', 404);
        return (0, api_response_1.sendResponse)(res, { message: 'Project fetched', data: project });
    }),
    create: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const project = await project_service_1.projectService.create(req.body);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Project created',
            data: project,
        });
    }),
    update: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id; // ✅ cast
        const project = await project_service_1.projectService.update(id, req.body);
        return (0, api_response_1.sendResponse)(res, { message: 'Project updated', data: project });
    }),
    remove: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id; // ✅ cast
        await project_service_1.projectService.remove(id);
        return (0, api_response_1.sendResponse)(res, { statusCode: 200, message: 'Project deleted' });
    }),
    toggleFeatured: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id; // ✅ cast
        const project = await project_service_1.projectService.toggleFeatured(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Featured toggled', data: project });
    }),
    setStatus: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id; // ✅ cast
        const { status } = req.body;
        if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
            throw new error_handler_1.AppError('Invalid status', 422);
        }
        const project = await project_service_1.projectService.setStatus(id, status);
        return (0, api_response_1.sendResponse)(res, { message: 'Status updated', data: project });
    }),
};
