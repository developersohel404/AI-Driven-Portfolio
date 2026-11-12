"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const prisma_1 = require("./lib/prisma");
// ✅ App এখানেই তৈরি (Vercel export-এর জন্য দরকার)
const app = (0, app_1.createApp)();
/**
 * Local development server starter।
 * Vercel-এ এই ফাংশন কল হয় না — Vercel নিজেই app.handle() করে।
 */
const start = async () => {
    try {
        await prisma_1.prisma.$connect();
        logger_1.logger.info('✅ Database connected');
        const server = app.listen(env_1.env.PORT, () => {
            logger_1.logger.info(`🚀 Server running at http://localhost:${env_1.env.PORT}${env_1.env.API_PREFIX}`);
        });
        const shutdown = async (signal) => {
            logger_1.logger.info(`${signal} received — shutting down`);
            server.close(async () => {
                await prisma_1.prisma.$disconnect();
                process.exit(0);
            });
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }
    catch (err) {
        logger_1.logger.error({ err }, 'Failed to start server');
        process.exit(1);
    }
};
// ⚠️ শুধু local/dev-এ listen করি
if (process.env.NODE_ENV !== 'production') {
    start();
}
// ✅ Vercel serverless function-এর জন্য export
exports.default = app;
