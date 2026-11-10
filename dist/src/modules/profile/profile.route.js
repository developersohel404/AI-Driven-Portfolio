"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileAdminRouter = exports.profilePublicRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validate_1 = require("../../middlewares/validate");
const profile_controller_1 = require("./profile.controller");
const profile_validation_1 = require("./profile.validation");
// ---------- PUBLIC ----------
exports.profilePublicRouter = (0, express_1.Router)();
exports.profilePublicRouter.get('/', profile_controller_1.profileController.getPublic);
// ---------- ADMIN ----------
exports.profileAdminRouter = (0, express_1.Router)();
exports.profileAdminRouter.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
exports.profileAdminRouter.get('/me', profile_controller_1.profileController.getMine);
exports.profileAdminRouter.post('/me', (0, validate_1.validate)(profile_validation_1.updateProfileSchema), profile_controller_1.profileController.createMine);
exports.profileAdminRouter.patch('/me', (0, validate_1.validate)(profile_validation_1.updateProfileSchema), profile_controller_1.profileController.updateMine);
