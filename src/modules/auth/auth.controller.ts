import { Request, Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../../middlewares/error-handler';
import { sendResponse } from '../../utils/api-response';
import { asyncHandler } from '../../utils/async-handler';
import { authService } from './auth.service';
import type { TokenPair } from './auth.type';

const isProd = env.NODE_ENV === 'production';

const cookieBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ('none' as const) : ('lax' as const),
  path: '/',
};

const setAuthCookies = (res: Response, tokens: TokenPair) => {
  res.cookie('accessToken', tokens.accessToken, {
    ...cookieBase,
    maxAge: 15 * 60 * 1000, // 15m
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', cookieBase);
  res.clearCookie('refreshToken', cookieBase);
};

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    setAuthCookies(res, result.tokens);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Registration successful',
      data: { user: result.user, tokens: result.tokens },
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    setAuthCookies(res, result.tokens);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Login successful',
      data: { user: result.user, tokens: result.tokens },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token =
      (req.body?.refreshToken as string | undefined) ??
      (typeof req.cookies?.refreshToken === 'string' ? req.cookies.refreshToken : undefined);
    if (!token) throw new AppError('Refresh token required', 401);

    const result = await authService.refresh(token);
    setAuthCookies(res, result.tokens);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Token refreshed',
      data: { user: result.user, tokens: result.tokens },
    });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken =
      typeof req.cookies?.refreshToken === 'string' ? req.cookies.refreshToken : undefined;
    await authService.logout(refreshToken);
    clearAuthCookies(res);
    return sendResponse(res, { statusCode: 200, message: 'Logged out' });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Authentication required', 401);
    const user = await authService.me(req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Current user',
      data: user,
    });
  }),
};
