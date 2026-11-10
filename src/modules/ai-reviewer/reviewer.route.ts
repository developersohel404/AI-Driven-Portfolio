import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validate } from '../../middlewares/validate';
import { reviewerController } from './reviewer.controller';
import { reviewInputSchema } from './reviewer.validation';

const reviewLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // ১০ মিনিট
  max: 3, // প্রতি ১০ মিনিটে ৩টি review
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many code reviews. Please wait.' },
});

export const reviewerRouter = Router();

reviewerRouter.post(
  '/review',
  reviewLimiter,
  validate(reviewInputSchema),
  reviewerController.review
);
