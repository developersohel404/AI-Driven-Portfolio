import { Request, Response } from 'express';
import { AIProviderError } from '../../lib/ai/ai-provider';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { explainerService } from './explainer.service';

export const explainerController = {
  explain: asyncHandler(async (req: Request, res: Response) => {
    try {
      const result = await explainerService.explain(req.body);
      return sendResponse(res, {
        message: 'Code explanation',
        data: result,
      });
    } catch (err) {
      if (err instanceof AIProviderError) {
        if (err.code === 'QUOTA_EXHAUSTED') {
          return sendResponse(res, {
            statusCode: 429,
            success: false,
            message:
              'The AI code explainer has reached its quota. Please try again later — all other site features still work.',
          });
        }
        if (err.code === 'PROVIDER_UNAVAILABLE') {
          return sendResponse(res, {
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
