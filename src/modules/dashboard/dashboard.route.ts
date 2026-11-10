import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { dashboardController } from './dashboard.controller';

export const dashboardRouter = Router();

// সব dashboard routes admin-only
dashboardRouter.use(authenticate, authorize('ADMIN'));

dashboardRouter.get('/overview', dashboardController.overview);
dashboardRouter.get('/recent', dashboardController.recentActivity);
dashboardRouter.get('/ai-usage', dashboardController.aiUsage);
dashboardRouter.get('/contact-trend', dashboardController.contactTrend);
