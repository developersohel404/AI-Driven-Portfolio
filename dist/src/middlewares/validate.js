"use strict";
// import { NextFunction, Request, Response } from 'express';
// import { ZodSchema } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema, target = 'body') => (req, _res, next) => {
    try {
        const parsed = schema.parse(req[target]);
        if (target === 'query') {
            // Express 5-এ req.query getter-only
            Object.defineProperty(req, 'query', {
                value: parsed,
                writable: true,
                configurable: true,
                enumerable: true,
            });
        }
        else if (target === 'params') {
            // params-ও কখনো readonly হতে পারে Express version-এর ওপর নির্ভর করে
            Object.defineProperty(req, 'params', {
                value: parsed,
                writable: true,
                configurable: true,
                enumerable: true,
            });
        }
        else {
            req[target] = parsed;
        }
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return next(err); // errorHandler ZodError ধরবে
        }
        next(err);
    }
};
exports.validate = validate;
