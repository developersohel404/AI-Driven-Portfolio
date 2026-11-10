import { Request, Response } from 'express';
import { AppError } from '../../middlewares/error-handler';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { profileService } from './profile.service';

export const profileController = {
  /** GET /api/v1/profile — public profile */
  getPublic: asyncHandler(async (_req: Request, res: Response) => {
    const profile = await profileService.getPublic();
    return sendResponse(res, { message: 'Profile fetched', data: profile });
  }),

  /** GET /api/v1/me — public developer bundle */
  getMe: asyncHandler(async (_req: Request, res: Response) => {
    const bundle = await profileService.getPublicBundle();
    return sendResponse(res, { message: 'Developer profile', data: bundle });
  }),

  /** GET /api/v1/admin/profile/me — admin's own profile (auto-create) */
  getMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    const profile = await profileService.getMine(req.user.id);
    return sendResponse(res, { message: 'My profile', data: profile });
  }),

  /** POST /api/v1/admin/profile/me — create profile */
  createMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    const result = await profileService.createMine(req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Profile created',
      data: result,
    });
  }),

  /** PATCH /api/v1/admin/profile/me — update profile (auto-create if missing) */
  updateMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    const profile = await profileService.updateMine(req.user.id, req.body);
    return sendResponse(res, { message: 'Profile updated', data: profile });
  }),
};
