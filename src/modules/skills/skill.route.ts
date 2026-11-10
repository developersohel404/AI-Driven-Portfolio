// import { Router } from 'express';
// import { authenticate } from '../../middlewares/authenticate';
// import { authorize } from '../../middlewares/authorize';
// import { validate } from '../../middlewares/validate';
// import { skillController } from './skill.controller';
// import { createSkillSchema, listSkillsQuerySchema, updateSkillSchema } from './skill.validation';

// export const skillPublicRouter = Router();

// skillPublicRouter.get('/', validate(listSkillsQuerySchema, 'query'), skillController.listPublic);

// export const skillAdminRouter = Router();

// skillAdminRouter.use(authenticate, authorize('ADMIN'));

// skillAdminRouter.get('/:id', skillController.getByIdAdmin);
// skillAdminRouter.post('/', validate(createSkillSchema), skillController.create);
// skillAdminRouter.patch('/:id', validate(updateSkillSchema), skillController.update);
// skillAdminRouter.delete('/:id', skillController.remove);

import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { skillController } from './skill.controller';
import { createSkillSchema, listSkillsQuerySchema, updateSkillSchema } from './skill.validation';

export const skillPublicRouter = Router();
skillPublicRouter.get(
  '/',
  validate(listSkillsQuerySchema, 'query'), // ← এখানে query validation
  skillController.listPublic
);

export const skillAdminRouter = Router();
skillAdminRouter.use(authenticate, authorize('ADMIN'));
skillAdminRouter.get('/:id', skillController.getByIdAdmin);
skillAdminRouter.post('/', validate(createSkillSchema), skillController.create);
skillAdminRouter.patch('/:id', validate(updateSkillSchema), skillController.update);
skillAdminRouter.delete('/:id', skillController.remove);
