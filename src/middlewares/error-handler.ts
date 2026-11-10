// import { NextFunction, Request, Response } from 'express';
// import { ZodError } from 'zod';
// import { Prisma } from '../../generated/prisma/client';
// import { env } from '../config/env';
// import { logger } from '../config/logger';

// export class AppError extends Error {
//   statusCode: number;
//   isOperational: boolean;
//   constructor(message: string, statusCode = 500, isOperational = true) {
//     super(message);
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//   }
// }

// export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
//   let statusCode = 500;
//   let message = 'Internal server error';
//   let details: unknown;

//   if (err instanceof AppError) {
//     statusCode = err.statusCode;
//     message = err.message;
//   } else if (err instanceof ZodError) {
//     statusCode = 422;
//     message = 'Validation failed';
//     details = err.flatten().fieldErrors;
//   } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
//     if (err.code === 'P2002') {
//       statusCode = 409;
//       message = 'Resource already exists';
//     } else if (err.code === 'P2025') {
//       statusCode = 404;
//       message = 'Resource not found';
//     } else {
//       statusCode = 400;
//       message = `Database error: ${err.code}`;
//     }
//   } else if (err instanceof Error) {
//     message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
//   }

//   if (statusCode >= 500) {
//     logger.error({ err }, 'Unhandled error');
//   }

//   res.status(statusCode).json({
//     success: false,
//     message,
//     details,
//     ...(env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : {}),
//   });
// };

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '../../generated/prisma/client';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    message = 'Validation failed';
    details = err.flatten().fieldErrors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Resource already exists';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      statusCode = 400;
      message = `Database error: ${err.code}`;
    }
  } else if (err instanceof Error) {
    message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  }

  if (statusCode >= 500) logger.error({ err }, 'Unhandled error');

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(env.NODE_ENV === 'development' && err instanceof Error ? { stack: err.stack } : {}),
  });
};
