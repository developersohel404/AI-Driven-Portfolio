import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { githubController } from './github.controller';

const ghLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many GitHub requests.' },
});

export const githubRouter = Router();

githubRouter.get('/:username', ghLimiter, githubController.stats);
githubRouter.get('/:username/contributions', ghLimiter, githubController.contributions);
githubRouter.get('/:username/languages', ghLimiter, githubController.languages);
