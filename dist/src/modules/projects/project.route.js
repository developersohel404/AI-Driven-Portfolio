"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectAdminRouter = exports.projectPublicRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validate_1 = require("../../middlewares/validate");
const project_controller_1 = require("./project.controller");
const project_validation_1 = require("./project.validation");
// ---------- PUBLIC router (mounted at /api/v1/projects) ----------
exports.projectPublicRouter = (0, express_1.Router)();
exports.projectPublicRouter.get('/', (0, validate_1.validate)(project_validation_1.listProjectsQuerySchema, 'query'), project_controller_1.projectController.listPublic);
exports.projectPublicRouter.get('/:slug', project_controller_1.projectController.getBySlugPublic);
// ---------- ADMIN router (mounted at /api/v1/admin/projects) ----------
exports.projectAdminRouter = (0, express_1.Router)();
exports.projectAdminRouter.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
exports.projectAdminRouter.get('/', (0, validate_1.validate)(project_validation_1.listProjectsQuerySchema, 'query'), project_controller_1.projectController.listAdmin);
exports.projectAdminRouter.get('/:id', project_controller_1.projectController.getByIdAdmin);
exports.projectAdminRouter.post('/', (0, validate_1.validate)(project_validation_1.createProjectSchema), project_controller_1.projectController.create);
exports.projectAdminRouter.patch('/:id', (0, validate_1.validate)(project_validation_1.updateProjectSchema), project_controller_1.projectController.update);
exports.projectAdminRouter.delete('/:id', project_controller_1.projectController.remove);
exports.projectAdminRouter.patch('/:id/toggle-featured', project_controller_1.projectController.toggleFeatured);
exports.projectAdminRouter.patch('/:id/status', project_controller_1.projectController.setStatus);
