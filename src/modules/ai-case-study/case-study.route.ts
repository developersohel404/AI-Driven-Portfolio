import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { caseStudyController } from './case-study.controller';
import { generateCaseStudySchema, saveCaseStudySchema } from './case-study.validation';

const genLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many generations. Slow down.' },
});

export const caseStudyRouter = Router();

// সব admin-only
caseStudyRouter.use(authenticate, authorize('ADMIN'));

caseStudyRouter.get('/projects', caseStudyController.listProjects);
caseStudyRouter.get('/project/:projectId', caseStudyController.getByProjectId);
caseStudyRouter.post(
  '/generate',
  genLimiter,
  validate(generateCaseStudySchema),
  caseStudyController.generate
);
caseStudyRouter.post('/save', validate(saveCaseStudySchema), caseStudyController.save);
