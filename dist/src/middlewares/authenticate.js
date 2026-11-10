"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const prisma_1 = require("../lib/prisma");
const jwt_1 = require("../utils/jwt");
const error_handler_1 = require("./error-handler");
const authenticate = async (req, _res, next) => {
    try {
        let token;
        const header = req.headers.authorization;
        if (header?.startsWith('Bearer ')) {
            token = header.slice(7);
        }
        else if (typeof req.cookies?.accessToken === 'string') {
            token = req.cookies.accessToken;
        }
        if (!token)
            throw new error_handler_1.AppError('Authentication required', 401);
        const payload = (0, jwt_1.verifyAccessToken)(token);
        if (payload.type !== 'access')
            throw new error_handler_1.AppError('Invalid token', 401);
        req.user = {
            id: payload.sub,
            email: '',
            role: payload.role,
        };
        // ✅ ADMIN হলে Profile থাকতে হবে, না থাকলে auto-create
        if (payload.role === 'ADMIN') {
            const exists = await prisma_1.prisma.profile.findUnique({
                where: { userId: payload.sub },
                select: { id: true },
            });
            if (!exists) {
                const user = await prisma_1.prisma.user.findUnique({
                    where: { id: payload.sub },
                    select: { name: true, email: true },
                });
                if (user) {
                    await prisma_1.prisma.profile.create({
                        data: {
                            userId: payload.sub,
                            headline: 'Full-Stack Web Developer',
                            shortBio: 'I build web applications.',
                            bio: 'Full bio coming soon.',
                            email: user.email,
                            availableForWork: true,
                        },
                    });
                }
            }
        }
        next();
    }
    catch (err) {
        if (err instanceof error_handler_1.AppError)
            return next(err);
        next(new error_handler_1.AppError('Invalid or expired token', 401));
    }
};
exports.authenticate = authenticate;
