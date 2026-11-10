import { Request, Response } from 'express';
import { AIProviderError } from '../../lib/ai/ai-provider';
import { aiService } from '../../lib/ai/ai-service';
import { AppError } from '../../middlewares/error-handler';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { assistantService } from './assistant.service';

export const assistantController = {
  /** Provider status দেখার জন্য (frontend disabled-state দেখাতে পারে) */
  status: asyncHandler(async (_req: Request, res: Response) => {
    return sendResponse(res, {
      message: 'AI status',
      data: aiService.getStatus(),
    });
  }),

  chat: asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await assistantService.chat({
        sessionId: req.body.sessionId,
        message: req.body.message,
        userId: req.user?.id,
        ip: req.ip,
      });
      return sendResponse(res, {
        message: 'Assistant reply',
        data: result,
      });
    } catch (err) {
      if (err instanceof AIProviderError) {
        if (err.code === 'QUOTA_EXHAUSTED') {
          return sendResponse(res, {
            statusCode: 429,
            success: false,
            message:
              'The AI assistant has reached its daily quota. Please try again later — all other parts of the site still work.',
          });
        }
        if (err.code === 'PROVIDER_UNAVAILABLE') {
          return sendResponse(res, {
            statusCode: 503,
            success: false,
            message: 'The AI assistant is currently unavailable. Please try again later.',
          });
        }
      }
      throw err;
    }
  }),

  history: asyncHandler(async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId as string;
    const history = await assistantService.getHistory(sessionId);
    if (!history) throw new AppError('Session not found', 404);
    return sendResponse(res, { message: 'Session history', data: history });
  }),
};
