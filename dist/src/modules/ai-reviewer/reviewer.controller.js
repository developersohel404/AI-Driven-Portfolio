"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewerController = void 0;
const ai_provider_1 = require("../../lib/ai/ai-provider");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const reviewer_service_1 = require("./reviewer.service");
exports.reviewerController = {
    review: (0, async_handler_1.asyncHandler)(async (req, res) => {
        try {
            const result = await reviewer_service_1.reviewerService.review(req.body);
            return (0, api_response_1.sendResponse)(res, { message: 'Code review', data: result });
        }
        catch (err) {
            if (err instanceof ai_provider_1.AIProviderError) {
                if (err.code === 'QUOTA_EXHAUSTED') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 429,
                        success: false,
                        message: 'AI code reviewer quota reached. Try again later.',
                    });
                }
                if (err.code === 'PROVIDER_UNAVAILABLE') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 503,
                        success: false,
                        message: 'AI is currently unavailable.',
                    });
                }
            }
            throw err;
        }
    }),
};
