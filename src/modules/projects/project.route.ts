import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { projectController } from './project.controller';
import {
  createProjectSchema,
  listProjectsQuerySchema,
  updateProjectSchema,
} from './project.validation';

// ---------- PUBLIC router (mounted at /api/v1/projects) ----------
export const projectPublicRouter = Router();

projectPublicRouter.get(
  '/',
  validate(listProjectsQuerySchema, 'query'),
  projectController.listPublic
);
projectPublicRouter.get('/:slug', projectController.getBySlugPublic);

// ---------- ADMIN router (mounted at /api/v1/admin/projects) ----------
export const projectAdminRouter = Router();

projectAdminRouter.use(authenticate, authorize('ADMIN'));

projectAdminRouter.get(
  '/',
  validate(listProjectsQuerySchema, 'query'),
  projectController.listAdmin
);
projectAdminRouter.get('/:id', projectController.getByIdAdmin);
projectAdminRouter.post('/', validate(createProjectSchema), projectController.create);
projectAdminRouter.patch('/:id', validate(updateProjectSchema), projectController.update);
projectAdminRouter.delete('/:id', projectController.remove);
projectAdminRouter.patch('/:id/toggle-featured', projectController.toggleFeatured);
projectAdminRouter.patch('/:id/status', projectController.setStatus);
