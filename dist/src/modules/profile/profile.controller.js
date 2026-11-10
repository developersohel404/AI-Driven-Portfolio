"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const error_handler_1 = require("../../middlewares/error-handler");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const profile_service_1 = require("./profile.service");
exports.profileController = {
    /** GET /api/v1/profile — public profile */
    getPublic: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const profile = await profile_service_1.profileService.getPublic();
        return (0, api_response_1.sendResponse)(res, { message: 'Profile fetched', data: profile });
    }),
    /** GET /api/v1/me — public developer bundle */
    getMe: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const bundle = await profile_service_1.profileService.getPublicBundle();
        return (0, api_response_1.sendResponse)(res, { message: 'Developer profile', data: bundle });
    }),
    /** GET /api/v1/admin/profile/me — admin's own profile (auto-create) */
    getMine: (0, async_handler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw new error_handler_1.AppError('Authentication required', 401);
        const profile = await profile_service_1.profileService.getMine(req.user.id);
        return (0, api_response_1.sendResponse)(res, { message: 'My profile', data: profile });
    }),
    /** POST /api/v1/admin/profile/me — create profile */
    createMine: (0, async_handler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw new error_handler_1.AppError('Authentication required', 401);
        const result = await profile_service_1.profileService.createMine(req.user.id, req.body);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Profile created',
            data: result,
        });
    }),
    /** PATCH /api/v1/admin/profile/me — update profile (auto-create if missing) */
    updateMine: (0, async_handler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw new error_handler_1.AppError('Authentication required', 401);
        const profile = await profile_service_1.profileService.updateMine(req.user.id, req.body);
        return (0, api_response_1.sendResponse)(res, { message: 'Profile updated', data: profile });
    }),
};
