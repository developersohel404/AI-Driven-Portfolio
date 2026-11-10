"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const dashboard_service_1 = require("./dashboard.service");
exports.dashboardController = {
    overview: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const data = await dashboard_service_1.dashboardService.overview();
        return (0, api_response_1.sendResponse)(res, { message: 'Dashboard overview', data });
    }),
    recentActivity: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const limit = Math.min(Number(req.query.limit) || 5, 20);
        const data = await dashboard_service_1.dashboardService.recentActivity(limit);
        return (0, api_response_1.sendResponse)(res, { message: 'Recent activity', data });
    }),
    aiUsage: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const data = await dashboard_service_1.dashboardService.aiUsage();
        return (0, api_response_1.sendResponse)(res, { message: 'AI usage stats', data });
    }),
    contactTrend: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const data = await dashboard_service_1.dashboardService.contactTrend();
        return (0, api_response_1.sendResponse)(res, { message: 'Contact trend', data });
    }),
};
