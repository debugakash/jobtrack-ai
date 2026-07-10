# Backend Architecture

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- JWT Authentication
- bcrypt

## Project Structure

```
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── index.ts
```

## Prisma Configuration

This project uses Prisma 7 with the PostgreSQL adapter.

Prisma client is initialized using:

- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

instead of using `new PrismaClient()` without an adapter.

The database connection is configured through `prisma.config.ts`.
