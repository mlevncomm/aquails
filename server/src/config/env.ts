import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

loadDotenv();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  DATABASE_URL: z
    .string()
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      { message: 'DATABASE_URL must be a PostgreSQL connection string' },
    )
    .optional(),
  JWT_SECRET: z.string().min(32).optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    console.error('Invalid environment variables:', formatted);
    process.exit(1);
  }

  const env = result.data;

  if (env.NODE_ENV === 'production') {
    if (!env.JWT_SECRET) {
      console.error('JWT_SECRET is required in production');
      process.exit(1);
    }

    if (!env.DATABASE_URL) {
      console.error('DATABASE_URL is required in production');
      process.exit(1);
    }
  }

  return env;
}

export const env = parseEnv();

export type Env = typeof env;
