"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewerRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const validate_1 = require("../../middlewares/validate");
const reviewer_controller_1 = require("./reviewer.controller");
const reviewer_validation_1 = require("./reviewer.validation");
const reviewLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // ১০ মিনিট
    max: 3, // প্রতি ১০ মিনিটে ৩টি review
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many code reviews. Please wait.' },
});
exports.reviewerRouter = (0, express_1.Router)();
exports.reviewerRouter.post('/review', reviewLimiter, (0, validate_1.validate)(reviewer_validation_1.reviewInputSchema), reviewer_controller_1.reviewerController.review);
