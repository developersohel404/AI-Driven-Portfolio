"use strict";
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
// const passwordSchema = z
//   .string()
//   .min(8, 'Password must be at least 8 characters')
//   .max(72, 'Password too long')
//   .regex(/[a-z]/, 'Must contain a lowercase letter')
//   .regex(/[A-Z]/, 'Must contain an uppercase letter')
//   .regex(/[0-9]/, 'Must contain a number');
// export const registerSchema = z.object({
//   name: z.string().min(2).max(80).trim(),
//   email: z.string().email().toLowerCase().trim(),
//   password: passwordSchema,
// });
// export const loginSchema = z.object({
//   email: z.string().email().toLowerCase().trim(),
//   password: z.string().min(1, 'Password is required'),
// });
// export const refreshSchema = z.object({
//   refreshToken: z.string().min(1).optional(),
// });
// export type RegisterInput = z.infer<typeof registerSchema>;
// export type LoginInput = z.infer<typeof loginSchema>;
const zod_1 = require("zod");
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number');
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80).trim(),
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: passwordSchema,
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1).optional(),
});
