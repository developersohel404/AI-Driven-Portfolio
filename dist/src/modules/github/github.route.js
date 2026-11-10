"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const github_controller_1 = require("./github.controller");
const ghLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many GitHub requests.' },
});
exports.githubRouter = (0, express_1.Router)();
exports.githubRouter.get('/:username', ghLimiter, github_controller_1.githubController.stats);
exports.githubRouter.get('/:username/contributions', ghLimiter, github_controller_1.githubController.contributions);
exports.githubRouter.get('/:username/languages', ghLimiter, github_controller_1.githubController.languages);
