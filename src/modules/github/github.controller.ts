import { Request, Response } from 'express';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { githubService } from './github.service';

export const githubController = {
  stats: asyncHandler(async (req: Request, res: Response) => {
    const username = req.params.username as string;
    const force = req.query.force === 'true';
    const data = await githubService.getStats(username, force);
    return sendResponse(res, { message: 'GitHub stats', data });
  }),

  contributions: asyncHandler(async (req: Request, res: Response) => {
    const username = req.params.username as string;
    const data = await githubService.getContributions(username);
    return sendResponse(res, { message: 'GitHub contributions', data });
  }),

  languages: asyncHandler(async (req: Request, res: Response) => {
    const username = req.params.username as string;
    const data = await githubService.getLanguageStats(username);
    return sendResponse(res, { message: 'GitHub languages', data });
  }),
};
