"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('5000'),
    API_PREFIX: zod_1.z.string().default('/api/v1'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:3000'),
    AI_PROVIDER: zod_1.z.enum(['gemini', 'ollama', 'disabled']).default('disabled'),
    GEMINI_API_KEY: zod_1.z.string().optional(),
    GEMINI_MODEL: zod_1.z.string().default('gemini-1.5-flash'),
    OLLAMA_BASE_URL: zod_1.z.string().default('http://localhost:11434'),
    OLLAMA_MODEL: zod_1.z.string().default('llama3.2'),
    POLLINATIONS_API_KEY: zod_1.z.string().optional(),
    GITHUB_TOKEN: zod_1.z.string().optional(),
    AI_RATE_LIMIT_MAX: zod_1.z.string().default('10'),
    AI_RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('60000'),
    AUTH_RATE_LIMIT_MAX: zod_1.z.string().default('5'),
    AUTH_RATE_LIMIT_WINDOW_MS: zod_1.z.string().default('900000'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
