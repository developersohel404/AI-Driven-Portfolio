import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../../config/env';
import { validate } from '../../middlewares/validate';
import { assistantController } from './assistant.controller';
import { chatInputSchema } from './assistant.validation';

// AI-specific rate limiter (blueprint: AI_RATE_LIMIT_MAX / WINDOW)
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

export const assistantRouter = Router();

assistantRouter.get('/status', assistantController.status);
assistantRouter.post('/chat', aiLimiter, validate(chatInputSchema), assistantController.chat);
assistantRouter.get('/history/:sessionId', assistantController.history);
