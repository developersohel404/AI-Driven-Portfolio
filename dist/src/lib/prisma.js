"use strict";
// import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaClient } from '../../generated/prisma/client';
// import { env } from '../config/env';
// import { logger } from '../config/logger';
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
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
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../../generated/prisma/client");
const env_1 = require("../config/env");
const globalForPrisma = globalThis;
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: env_1.env.DATABASE_URL,
});
exports.prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        adapter,
        log: [
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
        ],
    });
if (env_1.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
