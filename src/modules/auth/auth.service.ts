import { logger } from '../../config/logger';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middlewares/error-handler';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/password';
import type { AuthResult, AuthUser, TokenPair } from './auth.type';
import type { LoginInput, RegisterInput } from './auth.validation';

const toAuthUser = (u: { id: string; email: string; name: string; role: any }): AuthUser => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});

const issueTokens = (user: AuthUser): TokenPair => ({
  accessToken: signAccessToken({ sub: user.id, role: user.role }),
  refreshToken: signRefreshToken({ sub: user.id, role: user.role }),
});

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (existing) throw new AppError('Email already registered', 409);

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
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

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
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

    if (!user) throw new AppError('Invalid email or password', 401);
    if (!user.isActive) throw new AppError('Account is disabled', 403);

    const ok = await comparePassword(input.password, user.passwordHash);
    if (!ok) throw new AppError('Invalid email or password', 401);

    const authUser = toAuthUser(user);
    return { user: authUser, tokens: issueTokens(authUser) };
  },

  async refresh(refreshToken: string): Promise<AuthResult> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token', 401);
    }
    if (payload.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    const authUser = toAuthUser(user);

    return { user: authUser, tokens: issueTokens(authUser) };
  },

  async me(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) throw new AppError('User not found', 404);
    return toAuthUser(user);
  },

  async logout(refreshToken?: string) {
    if (refreshToken) {
      try {
        verifyRefreshToken(refreshToken);
      } catch {}
    }
    logger.debug('User logout');
  },
};
