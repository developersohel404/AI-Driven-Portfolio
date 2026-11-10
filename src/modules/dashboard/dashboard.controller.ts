import { Request, Response } from 'express';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  overview: asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.overview();
    return sendResponse(res, { message: 'Dashboard overview', data });
  }),

  recentActivity: asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const data = await dashboardService.recentActivity(limit);
    return sendResponse(res, { message: 'Recent activity', data });
  }),

  aiUsage: asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.aiUsage();
    return sendResponse(res, { message: 'AI usage stats', data });
  }),

  contactTrend: asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.contactTrend();
    return sendResponse(res, { message: 'Contact trend', data });
  }),
};
