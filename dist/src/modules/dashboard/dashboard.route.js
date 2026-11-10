"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const dashboard_controller_1 = require("./dashboard.controller");
exports.dashboardRouter = (0, express_1.Router)();
// সব dashboard routes admin-only
exports.dashboardRouter.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
exports.dashboardRouter.get('/overview', dashboard_controller_1.dashboardController.overview);
exports.dashboardRouter.get('/recent', dashboard_controller_1.dashboardController.recentActivity);
exports.dashboardRouter.get('/ai-usage', dashboard_controller_1.dashboardController.aiUsage);
exports.dashboardRouter.get('/contact-trend', dashboard_controller_1.dashboardController.contactTrend);
