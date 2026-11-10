"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactAdminRouter = exports.contactPublicRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validate_1 = require("../../middlewares/validate");
const contact_controller_1 = require("./contact.controller");
const contact_validation_1 = require("./contact.validation");
// Public: visitor submit
exports.contactPublicRouter = (0, express_1.Router)();
exports.contactPublicRouter.post('/', (0, validate_1.validate)(contact_validation_1.submitContactSchema), contact_controller_1.contactController.submit);
// Admin: manage
exports.contactAdminRouter = (0, express_1.Router)();
exports.contactAdminRouter.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
exports.contactAdminRouter.get('/', (0, validate_1.validate)(contact_validation_1.listContactsQuerySchema, 'query'), contact_controller_1.contactController.list);
exports.contactAdminRouter.get('/stats', contact_controller_1.contactController.stats);
exports.contactAdminRouter.get('/:id', contact_controller_1.contactController.getById);
exports.contactAdminRouter.patch('/:id/status', (0, validate_1.validate)(contact_validation_1.updateContactStatusSchema), contact_controller_1.contactController.updateStatus);
exports.contactAdminRouter.delete('/:id', contact_controller_1.contactController.remove);
