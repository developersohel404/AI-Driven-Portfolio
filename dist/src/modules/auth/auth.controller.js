"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const env_1 = require("../../config/env");
const error_handler_1 = require("../../middlewares/error-handler");
const api_response_1 = require("../../utils/api-response");
const async_handler_1 = require("../../utils/async-handler");
const auth_service_1 = require("./auth.service");
const isProd = env_1.env.NODE_ENV === 'production';
const cookieBase = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
};
const setAuthCookies = (res, tokens) => {
    res.cookie('accessToken', tokens.accessToken, {
        ...cookieBase,
        maxAge: 15 * 60 * 1000, // 15m
    });
    res.cookie('refreshToken', tokens.refreshToken, {
        ...cookieBase,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
};
const clearAuthCookies = (res) => {
    res.clearCookie('accessToken', cookieBase);
    res.clearCookie('refreshToken', cookieBase);
};
exports.authController = {
    register: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.register(req.body);
        setAuthCookies(res, result.tokens);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 201,
            message: 'Registration successful',
            data: { user: result.user, tokens: result.tokens },
        });
    }),
    login: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const result = await auth_service_1.authService.login(req.body);
        setAuthCookies(res, result.tokens);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 200,
            message: 'Login successful',
            data: { user: result.user, tokens: result.tokens },
        });
    }),
    refresh: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const token = req.body?.refreshToken ??
            (typeof req.cookies?.refreshToken === 'string' ? req.cookies.refreshToken : undefined);
        if (!token)
            throw new error_handler_1.AppError('Refresh token required', 401);
        const result = await auth_service_1.authService.refresh(token);
        setAuthCookies(res, result.tokens);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 200,
            message: 'Token refreshed',
            data: { user: result.user, tokens: result.tokens },
        });
    }),
    logout: (0, async_handler_1.asyncHandler)(async (req, res) => {
        const refreshToken = typeof req.cookies?.refreshToken === 'string' ? req.cookies.refreshToken : undefined;
        await auth_service_1.authService.logout(refreshToken);
        clearAuthCookies(res);
        return (0, api_response_1.sendResponse)(res, { statusCode: 200, message: 'Logged out' });
    }),
    me: (0, async_handler_1.asyncHandler)(async (req, res) => {
        if (!req.user)
            throw new error_handler_1.AppError('Authentication required', 401);
        const user = await auth_service_1.authService.me(req.user.id);
        return (0, api_response_1.sendResponse)(res, {
            statusCode: 200,
            message: 'Current user',
            data: user,
        });
    }),
};
