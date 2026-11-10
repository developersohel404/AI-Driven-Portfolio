"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseStudyController = void 0;
const ai_provider_1 = require("../../lib/ai/ai-provider");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const case_study_service_1 = require("./case-study.service");
exports.caseStudyController = {
    generate: (0, async_handler_1.asyncHandler)(async (req, res) => {
        try {
            const result = await case_study_service_1.caseStudyService.generate(req.body);
            return (0, api_response_1.sendResponse)(res, { message: 'Case study draft generated', data: result });
        }
        catch (err) {
            if (err instanceof ai_provider_1.AIProviderError) {
                if (err.code === 'QUOTA_EXHAUSTED') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 429,
                        success: false,
                        message: 'AI quota reached. You can still write the case study manually via PUT /case-study/save.',
                    });
                }
                if (err.code === 'PROVIDER_UNAVAILABLE') {
                    return (0, api_response_1.sendResponse)(res, {
                        statusCode: 503,
                        success: false,
                        message: 'AI unavailable. Manual save still works.',
                    });
                }
            }
            throw err;
        }
    }),
    save: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const { projectId, ...rest } = req.body;
        const result = await case_study_service_1.caseStudyService.save(projectId, rest);
        return (0, api_response_1.sendResponse)(res, { message: 'Case study saved', data: result });
    }),
    listProjects: (0, async_handler_1.asyncHandler)(async (_req, res) => {
        const projects = await case_study_service_1.caseStudyService.listProjectsForCaseStudy();
        return (0, api_response_1.sendResponse)(res, { message: 'Projects for case study', data: projects });
    }),
    getByProjectId: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const projectId = req.params.projectId;
        const data = await case_study_service_1.caseStudyService.getByProjectId(projectId);
        return (0, api_response_1.sendResponse)(res, { message: 'Case study', data });
    }),
};
