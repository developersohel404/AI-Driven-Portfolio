"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseStudyRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authenticate_1 = require("../../middlewares/authenticate");
const authorize_1 = require("../../middlewares/authorize");
const validate_1 = require("../../middlewares/validate");
const case_study_controller_1 = require("./case-study.controller");
const case_study_validation_1 = require("./case-study.validation");
const genLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many generations. Slow down.' },
});
exports.caseStudyRouter = (0, express_1.Router)();
// সব admin-only
exports.caseStudyRouter.use(authenticate_1.authenticate, (0, authorize_1.authorize)('ADMIN'));
exports.caseStudyRouter.get('/projects', case_study_controller_1.caseStudyController.listProjects);
exports.caseStudyRouter.get('/project/:projectId', case_study_controller_1.caseStudyController.getByProjectId);
exports.caseStudyRouter.post('/generate', genLimiter, (0, validate_1.validate)(case_study_validation_1.generateCaseStudySchema), case_study_controller_1.caseStudyController.generate);
exports.caseStudyRouter.post('/save', (0, validate_1.validate)(case_study_validation_1.saveCaseStudySchema), case_study_controller_1.caseStudyController.save);
