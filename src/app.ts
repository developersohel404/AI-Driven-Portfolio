import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/error-handler';
import { notFound } from './middlewares/not-found';
import { apiLimiter } from './middlewares/rate-limit';
import { assistantRouter } from './modules/ai-assistant/assistant.route';
import { caseStudyRouter } from './modules/ai-case-study/case-study.route';
import { explainerRouter } from './modules/ai-explainer/explainer.route';
import { reviewerRouter } from './modules/ai-reviewer/reviewer.route';
import { authRouter } from './modules/auth/auth.route';
import { blogAdminRouter, blogPublicRouter } from './modules/blogs/blog.route';
import { contactAdminRouter, contactPublicRouter } from './modules/contact/contact.route';
import { dashboardRouter } from './modules/dashboard/dashboard.route';
import { discoverRouter } from './modules/discover/discover.route';
import { githubRouter } from './modules/github/github.route';
import { profileController } from './modules/profile/profile.controller';

import { profileAdminRouter, profilePublicRouter } from './modules/profile/profile.route';
import { projectAdminRouter, projectPublicRouter } from './modules/projects/project.route';
import { serviceAdminRouter, servicePublicRouter } from './modules/services/service.route';
import { skillAdminRouter, skillPublicRouter } from './modules/skills/skill.route';

export const createApp = () => {
  const app = express();

  app.set('etag', false); // ✅ 304 disable
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Cache-control: API সব response-এ no-store
  app.use((_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  if (env.NODE_ENV === 'development') app.use(morgan('dev'));

  app.get('/health', (_req, res) =>
    res.json({ success: true, message: 'OK', uptime: process.uptime() })
  );

  app.use(`${env.API_PREFIX}`, apiLimiter);

  // Auth
  app.use(`${env.API_PREFIX}/auth`, authRouter);

  // Projects
  app.use(`${env.API_PREFIX}/projects`, projectPublicRouter);
  app.use(`${env.API_PREFIX}/admin/projects`, projectAdminRouter);

  // Skills
  app.use(`${env.API_PREFIX}/skills`, skillPublicRouter);
  app.use(`${env.API_PREFIX}/admin/skills`, skillAdminRouter);

  // Services
  app.use(`${env.API_PREFIX}/services`, servicePublicRouter);
  app.use(`${env.API_PREFIX}/admin/services`, serviceAdminRouter);

  // Blog
  app.use(`${env.API_PREFIX}/blog`, blogPublicRouter);
  app.use(`${env.API_PREFIX}/admin/blogs`, blogAdminRouter);

  // Profile
  app.use(`${env.API_PREFIX}/profile`, profilePublicRouter);
  app.use(`${env.API_PREFIX}/admin/profile`, profileAdminRouter);

  // Public /me
  app.get(`${env.API_PREFIX}/me`, profileController.getMe);

  // Contact
  app.use(`${env.API_PREFIX}/contact`, contactPublicRouter);
  app.use(`${env.API_PREFIX}/admin/contact`, contactAdminRouter);

  // AI
  app.use(`${env.API_PREFIX}/ai/assistant`, assistantRouter);
  app.use(`${env.API_PREFIX}/ai/explainer`, explainerRouter);
  app.use(`${env.API_PREFIX}/ai/reviewer`, reviewerRouter);
  app.use(`${env.API_PREFIX}/admin/ai/case-study`, caseStudyRouter);

  // Dashboard
  app.use(`${env.API_PREFIX}/admin/dashboard`, dashboardRouter);

  // GitHub
  app.use(`${env.API_PREFIX}/github`, githubRouter);
  app.get(`${env.API_PREFIX}/me`, profileController.getMe);

  // Discoverability (/llms.txt)
  app.use('/', discoverRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
