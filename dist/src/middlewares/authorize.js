"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const error_handler_1 = require("./error-handler");
const authorize = (...allowedRoles) => (req, _res, next) => {
    if (!req.user)
        return next(new error_handler_1.AppError('Authentication required', 401));
    if (!allowedRoles.includes(req.user.role)) {
        return next(new error_handler_1.AppError('Insufficient permissions', 403));
    }
    next();
};
exports.authorize = authorize;
