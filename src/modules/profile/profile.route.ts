import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { profileController } from './profile.controller';
import { updateProfileSchema } from './profile.validation';

// ---------- PUBLIC ----------
export const profilePublicRouter = Router();
profilePublicRouter.get('/', profileController.getPublic);

// ---------- ADMIN ----------
export const profileAdminRouter = Router();
profileAdminRouter.use(authenticate, authorize('ADMIN'));

profileAdminRouter.get('/me', profileController.getMine);
profileAdminRouter.post('/me', validate(updateProfileSchema), profileController.createMine);
profileAdminRouter.patch('/me', validate(updateProfileSchema), profileController.updateMine);
