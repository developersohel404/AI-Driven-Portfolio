import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const authLimiter = rateLimit({
  windowMs: Number(env.AUTH_RATE_LIMIT_WINDOW_MS),
  max: Number(env.AUTH_RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
  },
});

export const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
