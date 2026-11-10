// import { NextFunction, Request, Response } from 'express';
// import { ZodSchema } from 'zod';

// type Target = 'body' | 'query' | 'params';

// export const validate =
//   (schema: ZodSchema, target: Target = 'body') =>
//   (req: Request, _res: Response, next: NextFunction) => {
//     try {
//       const parsed = schema.parse(req[target]);
//       (req as any)[target] = parsed;
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };

// import { NextFunction, Request, Response } from 'express';
// import { ZodSchema } from 'zod';

// type Target = 'body' | 'query' | 'params';

// export const validate =
//   (schema: ZodSchema, target: Target = 'body') =>
//   (req: Request, _res: Response, next: NextFunction) => {
//     try {
//       const parsed = schema.parse(req[target]);

//       if (target === 'query') {
//         // Express 5-এ req.query immutable — defineProperty দিয়ে replace করি
//         Object.defineProperty(req, 'query', {
//           value: parsed,
//           writable: true,
//           configurable: true,
//           enumerable: true,
//         });
//       } else {
//         (req as any)[target] = parsed;
//       }

//       next();
//     } catch (err) {
//       next(err);
//     }
//   };

import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

type Target = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodSchema, target: Target = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
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
      } else if (target === 'params') {
        // params-ও কখনো readonly হতে পারে Express version-এর ওপর নির্ভর করে
        Object.defineProperty(req, 'params', {
          value: parsed,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      } else {
        (req as any)[target] = parsed;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(err); // errorHandler ZodError ধরবে
      }
      next(err);
    }
  };
