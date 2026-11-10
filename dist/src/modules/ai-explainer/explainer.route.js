"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainerRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../../config/env");
const validate_1 = require("../../middlewares/validate");
const explainer_controller_1 = require("./explainer.controller");
const explainer_validation_1 = require("./explainer.validation");
const aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: Number(env_1.env.AI_RATE_LIMIT_WINDOW_MS),
    max: Number(env_1.env.AI_RATE_LIMIT_MAX),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many AI requests. Please slow down.',
    },
});
exports.explainerRouter = (0, express_1.Router)();
exports.explainerRouter.post('/explain', aiLimiter, (0, validate_1.validate)(explainer_validation_1.explainInputSchema), explainer_controller_1.explainerController.explain);
