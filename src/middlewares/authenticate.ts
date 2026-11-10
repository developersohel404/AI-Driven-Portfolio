import { NextFunction, Request, Response } from 'express';
import type { Role } from '../config/constants';
import { prisma } from '../lib/prisma';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './error-handler';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      token = header.slice(7);
    } else if (typeof req.cookies?.accessToken === 'string') {
      token = req.cookies.accessToken;
    }

    if (!token) throw new AppError('Authentication required', 401);

    const payload = verifyAccessToken(token);
    if (payload.type !== 'access') throw new AppError('Invalid token', 401);

    req.user = {
      id: payload.sub,
      email: '',
      role: payload.role as Role,
    };

    // ✅ ADMIN হলে Profile থাকতে হবে, না থাকলে auto-create
    if (payload.role === 'ADMIN') {
      const exists = await prisma.profile.findUnique({
        where: { userId: payload.sub },
        select: { id: true },
      });

      if (!exists) {
        const user = await prisma.user.findUnique({
          where: { id: payload.sub },
          select: { name: true, email: true },
        });

        if (user) {
          await prisma.profile.create({
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
  } catch (err) {
    if (err instanceof AppError) return next(err);
    next(new AppError('Invalid or expired token', 401));
  }
};
