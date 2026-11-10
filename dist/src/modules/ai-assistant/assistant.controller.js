"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantController = void 0;
const ai_provider_1 = require("../../lib/ai/ai-provider");
const ai_service_1 = require("../../lib/ai/ai-service");
const error_handler_1 = require("../../middlewares/error-handler");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const assistant_service_1 = require("./assistant.service");
exports.assistantController = {
    /** Provider status দেখার জন্য (frontend disabled-state দেখাতে পারে) */
    status: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        return (0, api_response_1.sendResponse)(res, {
            message: 'AI status',
            data: ai_service_1.aiService.getStatus(),
        });
    }),
    chat: (0, async_handler_1.asyncHandler)(async (req, res) => {
        try {
            const result = await assistant_service_1.assistantService.chat({
                sessionId: req.body.sessionId,
                message: req.body.message,
                userId: req.user?.id,
                ip: req.ip,
            });
            return (0, api_response_1.sendResponse)(res, {
                message: 'Assistant reply',
                data: result,
            });
        }
        catch (err) {
            if (err instanceof ai_provider_1.AIProviderError) {
                if (err.code === 'QUOTA_EXHAUSTED') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 429,
                        success: false,
                        message: 'The AI assistant has reached its daily quota. Please try again later — all other parts of the site still work.',
                    });
                }
                if (err.code === 'PROVIDER_UNAVAILABLE') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 503,
                        success: false,
                        message: 'The AI assistant is currently unavailable. Please try again later.',
                    });
                }
            }
            throw err;
        }
    }),
    history: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const sessionId = req.params.sessionId;
        const history = await assistant_service_1.assistantService.getHistory(sessionId);
        if (!history)
            throw new error_handler_1.AppError('Session not found', 404);
        return (0, api_response_1.sendResponse)(res, { message: 'Session history', data: history });
    }),
};
