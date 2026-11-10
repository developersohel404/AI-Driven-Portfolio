"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceController = void 0;
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const service_service_1 = require("./service.service");
exports.serviceController = {
    listPublic: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await service_service_1.serviceService.list(req.query, false);
        return (0, api_response_1.sendResponse)(res, {
            message: 'Services fetched',
            data: result.items,
            meta: { total: result.total },
        });
    }),
    getBySlugPublic: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const slug = req.params.slug;
        const service = await service_service_1.serviceService.getBySlug(slug, false);
        return (0, api_response_1.sendResponse)(res, { message: 'Service fetched', data: service });
    }),
    listAdmin: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await service_service_1.serviceService.list(req.query, true);
        return (0, api_response_1.sendResponse)(res, {
            message: 'Services fetched',
            data: result.items,
            meta: { total: result.total },
        });
    }),
    getByIdAdmin: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const service = await service_service_1.serviceService.getById(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Service fetched', data: service });
    }),
    create: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const service = await service_service_1.serviceService.create(req.body);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Service created',
            data: service,
        });
    }),
    update: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const service = await service_service_1.serviceService.update(id, req.body);
        return (0, api_response_1.sendResponse)(res, { message: 'Service updated', data: service });
    }),
    remove: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        await service_service_1.serviceService.remove(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Service deleted' });
    }),
    togglePublished: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const service = await service_service_1.serviceService.togglePublished(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Published toggled', data: service });
    }),
};
