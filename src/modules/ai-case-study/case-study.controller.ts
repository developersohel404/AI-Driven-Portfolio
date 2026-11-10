import { Request, Response } from 'express';
import { AIProviderError } from '../../lib/ai/ai-provider';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { caseStudyService } from './case-study.service';

export const caseStudyController = {
  generate: asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await caseStudyService.generate(req.body);
      return sendResponse(res, { message: 'Case study draft generated', data: result });
    } catch (err) {
      if (err instanceof AIProviderError) {
        if (err.code === 'QUOTA_EXHAUSTED') {
          return sendResponse(res, {
            statusCode: 429,
            success: false,
            message:
              'AI quota reached. You can still write the case study manually via PUT /case-study/save.',
          });
        }
        if (err.code === 'PROVIDER_UNAVAILABLE') {
          return sendResponse(res, {
            statusCode: 503,
            success: false,
            message: 'AI unavailable. Manual save still works.',
          });
        }
      }
      throw err;
    }
  }),

  save: asyncHandler(async (req: Request, res: Response) => {
    const { projectId, ...rest } = req.body;
    const result = await caseStudyService.save(projectId, rest);
    return sendResponse(res, { message: 'Case study saved', data: result });
  }),

  listProjects: asyncHandler(async (_req: Request, res: Response) => {
    const projects = await caseStudyService.listProjectsForCaseStudy();
    return sendResponse(res, { message: 'Projects for case study', data: projects });
  }),

  getByProjectId: asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.params.projectId as string;
    const data = await caseStudyService.getByProjectId(projectId);
    return sendResponse(res, { message: 'Case study', data });
  }),
};
