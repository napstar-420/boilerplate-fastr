import type { Config } from 'drizzle-kit';

export default {
  driver: 'mysql2',
  schema: './src/schema.ts',
  dbCredentials: {
    uri: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@aws.connect.psdb.cloud/${process.env.DATABASE_NAME}?ssl={"rejectUnauthorized":true}`,
  },
} satisfies Config;
