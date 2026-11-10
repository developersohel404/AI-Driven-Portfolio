import { Request, Response } from 'express';
import { AIProviderError } from '../../lib/ai/ai-provider';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { reviewerService } from './reviewer.service';

export const reviewerController = {
  review: asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await reviewerService.review(req.body);
      return sendResponse(res, { message: 'Code review', data: result });
    } catch (err) {
      if (err instanceof AIProviderError) {
        if (err.code === 'QUOTA_EXHAUSTED') {
          return sendResponse(res, {
            statusCode: 429,
            success: false,
            message: 'AI code reviewer quota reached. Try again later.',
          });
        }
        if (err.code === 'PROVIDER_UNAVAILABLE') {
          return sendResponse(res, {
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
