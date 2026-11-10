// import { z } from 'zod';

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

import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password too long')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number');

export const registerSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
