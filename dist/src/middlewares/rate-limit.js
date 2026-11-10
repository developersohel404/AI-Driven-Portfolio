"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: Number(env_1.env.AUTH_RATE_LIMIT_WINDOW_MS),
    max: Number(env_1.env.AUTH_RATE_LIMIT_MAX),
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many attempts. Please try again later.',
    },
});
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
});
