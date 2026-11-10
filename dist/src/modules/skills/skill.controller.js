"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillController = void 0;
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const skill_service_1 = require("./skill.service");
exports.skillController = {
    listPublic: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await skill_service_1.skillService.list(req.query);
        return (0, api_response_1.sendResponse)(res, {
            message: 'Skills fetched',
            data: result.items,
            meta: { total: result.total },
        });
    }),
    getByIdAdmin: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const skill = await skill_service_1.skillService.getById(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Skill fetched', data: skill });
    }),
    create: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const skill = await skill_service_1.skillService.create(req.body);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Skill created',
            data: skill,
        });
    }),
    update: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        const skill = await skill_service_1.skillService.update(id, req.body);
        return (0, api_response_1.sendResponse)(res, { message: 'Skill updated', data: skill });
    }),
    remove: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const id = req.params.id;
        await skill_service_1.skillService.remove(id);
        return (0, api_response_1.sendResponse)(res, { message: 'Skill deleted' });
    }),
};
