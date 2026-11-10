"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainerController = void 0;
const ai_provider_1 = require("../../lib/ai/ai-provider");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const explainer_service_1 = require("./explainer.service");
exports.explainerController = {
    explain: (0, async_handler_1.asyncHandler)(async (req, res) => {
        try {
            const result = await explainer_service_1.explainerService.explain(req.body);
            return (0, api_response_1.sendResponse)(res, {
                message: 'Code explanation',
                data: result,
            });
        }
        catch (err) {
            if (err instanceof ai_provider_1.AIProviderError) {
                if (err.code === 'QUOTA_EXHAUSTED') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 429,
                        success: false,
                        message: 'The AI code explainer has reached its quota. Please try again later — all other site features still work.',
                    });
                }
                if (err.code === 'PROVIDER_UNAVAILABLE') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 503,
                        success: false,
                        message: 'AI is currently unavailable. Please try again later.',
                    });
                }
            }
            throw err;
        }
    }),
};
