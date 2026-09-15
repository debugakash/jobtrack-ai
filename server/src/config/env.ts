import dotenv from "dotenv";
import type { StringValue } from "ms";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  JWT_EXPIRES_IN: z.string().default("7d"),

  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  PORT: parsedEnv.PORT,
  DATABASE_URL: parsedEnv.DATABASE_URL,
  NODE_ENV: parsedEnv.NODE_ENV,
  JWT_SECRET: parsedEnv.JWT_SECRET,
  JWT_EXPIRES_IN: parsedEnv.JWT_EXPIRES_IN as StringValue,
  CLIENT_URL: parsedEnv.CLIENT_URL,
};
