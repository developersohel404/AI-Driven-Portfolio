import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { serviceController } from './service.controller';
import {
  createServiceSchema,
  listServicesQuerySchema,
  updateServiceSchema,
} from './service.validation';

export const servicePublicRouter = Router();

servicePublicRouter.get(
  '/',
  validate(listServicesQuerySchema, 'query'),
  serviceController.listPublic
);
servicePublicRouter.get('/:slug', serviceController.getBySlugPublic);

export const serviceAdminRouter = Router();

serviceAdminRouter.use(authenticate, authorize('ADMIN'));

serviceAdminRouter.get(
  '/',
  validate(listServicesQuerySchema, 'query'),
  serviceController.listAdmin
);
serviceAdminRouter.get('/:id', serviceController.getByIdAdmin);
serviceAdminRouter.post('/', validate(createServiceSchema), serviceController.create);
serviceAdminRouter.patch('/:id', validate(updateServiceSchema), serviceController.update);
serviceAdminRouter.delete('/:id', serviceController.remove);
serviceAdminRouter.patch('/:id/toggle-published', serviceController.togglePublished);
