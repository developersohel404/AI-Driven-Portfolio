"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubController = void 0;
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const github_service_1 = require("./github.service");
exports.githubController = {
    stats: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const username = req.params.username;
        const force = req.query.force === 'true';
        const data = await github_service_1.githubService.getStats(username, force);
        return (0, api_response_1.sendResponse)(res, { message: 'GitHub stats', data });
    }),
    contributions: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const username = req.params.username;
        const data = await github_service_1.githubService.getContributions(username);
        return (0, api_response_1.sendResponse)(res, { message: 'GitHub contributions', data });
    }),
    languages: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const username = req.params.username;
        const data = await github_service_1.githubService.getLanguageStats(username);
        return (0, api_response_1.sendResponse)(res, { message: 'GitHub languages', data });
    }),
};
