## Setup — Creating the First Admin

1. Register a user via `POST /api/v1/auth/register`.
2. Promote it to admin using one of:
   - `npx prisma studio` → edit `User.role` to `ADMIN`
   - `npx ts-node -r tsconfig-paths/register scripts/promote-admin.ts <email>`
   - Neon SQL: `UPDATE "User" SET role = 'ADMIN' WHERE email = '...';`
3. Run `npm run db:seed` to insert starter content.

No admin credentials are stored in environment variables — roles are set explicitly in the database.
