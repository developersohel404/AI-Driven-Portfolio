/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // ✅ env() নয়, process.env ব্যবহার করুন
    url: process.env.DATABASE_URL ?? '',
  },
});
