import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../../config/env';
import { validate } from '../../middlewares/validate';
import { explainerController } from './explainer.controller';
import { explainInputSchema } from './explainer.validation';

const aiLimiter = rateLimit({
  windowMs: Number(env.AI_RATE_LIMIT_WINDOW_MS),
  max: Number(env.AI_RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests. Please slow down.',
  },
});

export const explainerRouter = Router();

explainerRouter.post(
  '/explain',
  aiLimiter,
  validate(explainInputSchema),
  explainerController.explain
);
