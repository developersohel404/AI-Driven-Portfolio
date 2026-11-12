"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_2 = require("./config/cors");
const env_1 = require("./config/env");
const error_handler_1 = require("./middlewares/error-handler");
const not_found_1 = require("./middlewares/not-found");
const rate_limit_1 = require("./middlewares/rate-limit");
const assistant_route_1 = require("./modules/ai-assistant/assistant.route");
const case_study_route_1 = require("./modules/ai-case-study/case-study.route");
const explainer_route_1 = require("./modules/ai-explainer/explainer.route");
const reviewer_route_1 = require("./modules/ai-reviewer/reviewer.route");
const auth_route_1 = require("./modules/auth/auth.route");
const blog_route_1 = require("./modules/blogs/blog.route");
const contact_route_1 = require("./modules/contact/contact.route");
const dashboard_route_1 = require("./modules/dashboard/dashboard.route");
const discover_route_1 = require("./modules/discover/discover.route");
const github_route_1 = require("./modules/github/github.route");
const profile_controller_1 = require("./modules/profile/profile.controller");
const profile_route_1 = require("./modules/profile/profile.route");
const project_route_1 = require("./modules/projects/project.route");
const service_route_1 = require("./modules/services/service.route");
const skill_route_1 = require("./modules/skills/skill.route");
const createApp = () => {
    const app = (0, express_1.default)();
    app.set('etag', false);
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)(cors_2.corsOptions));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((_req, res, next) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        next();
    });
    if (env_1.env.NODE_ENV === 'development')
        app.use((0, morgan_1.default)('dev'));
    app.get('/health', (_req, res) => res.json({ success: true, message: 'OK', uptime: process.uptime() }));
    app.use(`${env_1.env.API_PREFIX}`, rate_limit_1.apiLimiter);
    // Auth
    app.use(`${env_1.env.API_PREFIX}/auth`, auth_route_1.authRouter);
    // Projects
    app.use(`${env_1.env.API_PREFIX}/projects`, project_route_1.projectPublicRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/projects`, project_route_1.projectAdminRouter);
    // Skills
    app.use(`${env_1.env.API_PREFIX}/skills`, skill_route_1.skillPublicRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/skills`, skill_route_1.skillAdminRouter);
    // Services
    app.use(`${env_1.env.API_PREFIX}/services`, service_route_1.servicePublicRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/services`, service_route_1.serviceAdminRouter);
    // Blog
    app.use(`${env_1.env.API_PREFIX}/blog`, blog_route_1.blogPublicRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/blogs`, blog_route_1.blogAdminRouter);
    // Profile
    app.use(`${env_1.env.API_PREFIX}/profile`, profile_route_1.profilePublicRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/profile`, profile_route_1.profileAdminRouter);
    // Public /me (শুধু একবার)
    app.get(`${env_1.env.API_PREFIX}/me`, profile_controller_1.profileController.getMe);
    // Contact
    app.use(`${env_1.env.API_PREFIX}/contact`, contact_route_1.contactPublicRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/contact`, contact_route_1.contactAdminRouter);
    // AI
    app.use(`${env_1.env.API_PREFIX}/ai/assistant`, assistant_route_1.assistantRouter);
    app.use(`${env_1.env.API_PREFIX}/ai/explainer`, explainer_route_1.explainerRouter);
    app.use(`${env_1.env.API_PREFIX}/ai/reviewer`, reviewer_route_1.reviewerRouter);
    app.use(`${env_1.env.API_PREFIX}/admin/ai/case-study`, case_study_route_1.caseStudyRouter);
    // Dashboard
    app.use(`${env_1.env.API_PREFIX}/admin/dashboard`, dashboard_route_1.dashboardRouter);
    // GitHub
    app.use(`${env_1.env.API_PREFIX}/github`, github_route_1.githubRouter);
    // Discoverability (/llms.txt)
    app.use('/', discover_route_1.discoverRouter);
    app.use(not_found_1.notFound);
    app.use(error_handler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
