import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { contactController } from './contact.controller';
import {
  listContactsQuerySchema,
  submitContactSchema,
  updateContactStatusSchema,
} from './contact.validation';

// Public: visitor submit
export const contactPublicRouter = Router();
contactPublicRouter.post('/', validate(submitContactSchema), contactController.submit);

// Admin: manage
export const contactAdminRouter = Router();
contactAdminRouter.use(authenticate, authorize('ADMIN'));

contactAdminRouter.get('/', validate(listContactsQuerySchema, 'query'), contactController.list);
contactAdminRouter.get('/stats', contactController.stats);
contactAdminRouter.get('/:id', contactController.getById);
contactAdminRouter.patch(
  '/:id/status',
  validate(updateContactStatusSchema),
  contactController.updateStatus
);
contactAdminRouter.delete('/:id', contactController.remove);
