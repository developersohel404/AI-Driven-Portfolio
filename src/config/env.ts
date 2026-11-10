import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  API_PREFIX: z.string().default('/api/v1'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  FRONTEND_URL: z.string().default('http://localhost:3000'),

  AI_PROVIDER: z.enum(['gemini', 'ollama', 'disabled']).default('disabled'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  OLLAMA_BASE_URL: z.string().default('http://localhost:11434'),
  OLLAMA_MODEL: z.string().default('llama3.2'),
  POLLINATIONS_API_KEY: z.string().optional(),

  GITHUB_TOKEN: z.string().optional(),

  AI_RATE_LIMIT_MAX: z.string().default('10'),
  AI_RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
  AUTH_RATE_LIMIT_MAX: z.string().default('5'),
  AUTH_RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
