import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

// ✅ App এখানেই তৈরি (Vercel export-এর জন্য দরকার)
const app = createApp();

/**
 * Local development server starter।
 * Vercel-এ এই ফাংশন কল হয় না — Vercel নিজেই app.handle() করে।
 */
const start = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${env.PORT}${env.API_PREFIX}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down`);
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

// ⚠️ শুধু local/dev-এ listen করি
if (process.env.NODE_ENV !== 'production') {
  start();
}

// ✅ Vercel serverless function-এর জন্য export
export default app;
