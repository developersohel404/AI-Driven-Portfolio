"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assistantRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../../config/env");
const validate_1 = require("../../middlewares/validate");
const assistant_controller_1 = require("./assistant.controller");
const assistant_validation_1 = require("./assistant.validation");
// AI-specific rate limiter (blueprint: AI_RATE_LIMIT_MAX / WINDOW)
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
exports.assistantRouter = (0, express_1.Router)();
exports.assistantRouter.get('/status', assistant_controller_1.assistantController.status);
exports.assistantRouter.post('/chat', aiLimiter, (0, validate_1.validate)(assistant_validation_1.chatInputSchema), assistant_controller_1.assistantController.chat);
exports.assistantRouter.get('/history/:sessionId', assistant_controller_1.assistantController.history);
