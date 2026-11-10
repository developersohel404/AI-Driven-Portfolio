import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authLimiter } from '../../middlewares/rate-limit';
import { validate } from '../../middlewares/validate';
import { authController } from './auth.controller';
import { loginSchema, refreshSchema, registerSchema } from './auth.validation';

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), authController.register);
authRouter.post('/login', authLimiter, validate(loginSchema), authController.login);
authRouter.post('/refresh', authLimiter, validate(refreshSchema), authController.refresh);
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authenticate, authController.me);
