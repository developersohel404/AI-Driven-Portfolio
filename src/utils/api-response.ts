import { Response } from 'express';

interface ApiResponseOptions<T> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendResponse = <T>(res: Response, options: ApiResponseOptions<T> = {}) => {
  const { statusCode = 200, success = true, message, data, meta } = options;
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};
