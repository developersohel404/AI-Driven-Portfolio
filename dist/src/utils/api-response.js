"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, options = {}) => {
    const { statusCode = 200, success = true, message, data, meta } = options;
    return res.status(statusCode).json({
        success,
        message,
        data,
        meta,
    });
};
exports.sendResponse = sendResponse;
