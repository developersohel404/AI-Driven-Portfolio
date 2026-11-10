"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const contact_service_1 = require("./contact.service");
exports.contactController = {
    submit: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await contact_service_1.contactService.submit(req.body);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Message received. Thank you!',
            data: result,
        });
    }),
    list: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await contact_service_1.contactService.list(req.query);
        return (0, api_response_1.sendResponse)(res, {
            message: 'Contact messages fetched',
            data: result.items,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            },
        });
    }),
    getById: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const message = await contact_service_1.contactService.getById(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Contact message fetched', data: message });
    }),
    updateStatus: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const { status } = req.body;
        const message = await contact_service_1.contactService.updateStatus(id, status);
        return (0, api_response_1.sendResponse)(res, { message: 'Status updated', data: message });
    }),
    remove: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        await contact_service_1.contactService.remove(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Contact message deleted' });
    }),
    stats: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const stats = await contact_service_1.contactService.stats();
        return (0, api_response_1.sendResponse)(res, { message: 'Contact stats', data: stats });
    }),
};
