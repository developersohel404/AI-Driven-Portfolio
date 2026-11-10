"use strict";
// import { NextFunction, Request, Response } from 'express';
// import { ZodError } from 'zod';
// import { Prisma } from '../../generated/prisma/client';
// import { env } from '../config/env';
// import { logger } from '../config/logger';
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
const env_1 = require("../config/env");
const logger_1 = require("../config/logger");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Internal server error';
    let details;
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 422;
        message = 'Validation failed';
        details = err.flatten().fieldErrors;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Resource already exists';
        }
        else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Resource not found';
        }
        else {
            statusCode = 400;
            message = `Database error: ${err.code}`;
        }
    }
    else if (err instanceof Error) {
        message = env_1.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    }
    if (statusCode >= 500)
        logger_1.logger.error({ err }, 'Unhandled error');
    res.status(statusCode).json({
        success: false,
        message,
        details,
        ...(env_1.env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : {}),
    });
};
exports.errorHandler = errorHandler;
