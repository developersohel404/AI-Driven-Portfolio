import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const start = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected');

    const app = createApp();
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

start();
