// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '../../generated/prisma/client';
// import { env } from '../config/env';
// import { logger } from '../config/logger';

// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     adapter,
//     log: [
//       { emit: 'event', level: 'error' },
//       { emit: 'event', level: 'warn' },
//     ],
//   });

// prisma.$on('error', (e) => {
//   logger.error({ prisma: e }, 'Prisma error');
// });

// prisma.$on('warn', (e) => {
//   logger.warn({ prisma: e }, 'Prisma warning');
// });

// if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { env } from '../config/env';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
