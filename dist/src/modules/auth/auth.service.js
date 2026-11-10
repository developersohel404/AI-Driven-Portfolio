"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const logger_1 = require("../../config/logger");
const prisma_1 = require("../../lib/prisma");
const error_handler_1 = require("../../middlewares/error-handler");
const jwt_1 = require("../../utils/jwt");
const password_1 = require("../../utils/password");
const toAuthUser = (u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
});
const issueTokens = (user) => ({
    accessToken: (0, jwt_1.signAccessToken)({ sub: user.id, role: user.role }),
    refreshToken: (0, jwt_1.signRefreshToken)({ sub: user.id, role: user.role }),
});
exports.authService = {
    async register(input) {
        const existing = await prisma_1.prisma.user.findUnique({
            where: { email: input.email },
            select: { id: true },
        });
        if (existing)
            throw new error_handler_1.AppError('Email already registered', 409);
        const passwordHash = await (0, password_1.hashPassword)(input.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
                passwordHash,
                role: 'USER',
            },
            select: { id: true, email: true, name: true, role: true },
        });
        const authUser = toAuthUser(user);
        return { user: authUser, tokens: issueTokens(authUser) };
    },
    async login(input) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: input.email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                passwordHash: true,
                isActive: true,
            },
        });
        if (!user)
            throw new error_handler_1.AppError('Invalid email or password', 401);
        if (!user.isActive)
            throw new error_handler_1.AppError('Account is disabled', 403);
        const ok = await (0, password_1.comparePassword)(input.password, user.passwordHash);
        if (!ok)
            throw new error_handler_1.AppError('Invalid email or password', 401);
        const authUser = toAuthUser(user);
        return { user: authUser, tokens: issueTokens(authUser) };
    },
    async refresh(refreshToken) {
        let payload;
        try {
            payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        }
        catch {
            throw new error_handler_1.AppError('Invalid or expired refresh token', 401);
        }
        if (payload.type !== 'refresh') {
            throw new error_handler_1.AppError('Invalid token type', 401);
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.sub },
            select: { id: true, email: true, name: true, role: true, isActive: true },
        });
        if (!user || !user.isActive) {
            throw new error_handler_1.AppError('User not found or inactive', 401);
        }
        const authUser = toAuthUser(user);
        return { user: authUser, tokens: issueTokens(authUser) };
    },
    async me(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!user)
            throw new error_handler_1.AppError('User not found', 404);
        return toAuthUser(user);
    },
    async logout(refreshToken) {
        if (refreshToken) {
            try {
                (0, jwt_1.verifyRefreshToken)(refreshToken);
            }
            catch { }
        }
        logger_1.logger.debug('User logout');
    },
};
