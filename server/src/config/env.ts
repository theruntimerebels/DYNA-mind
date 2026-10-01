import 'dotenv/config';
import { z } from 'zod';

const bool = z.enum(['true', 'false']).default('false').transform((v) => v === 'true');
const schema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),
  GEMINI_API_KEY: z.string().default(''),
  GEMINI_MODEL: z.string().default(''),
  GEMINI_TTS_MODEL: z.string().default(''),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017'),
  MONGODB_DB: z.string().default('dynamind'),
  DEMO_MODE: bool,
  SESSION_SECRET: z.string().default('dev-only-insecure-secret'),
  COUNSELLOR_ACCESS_CODE: z.string().default(''),
  CRISIS_GUIDANCE: z.string().default(
    'If you may be in immediate danger or thinking about harming yourself, please contact your local emergency number or a local crisis line right now, or reach someone you trust who can be with you.'
  ),
});

export type Env = z.infer<typeof schema>;
export function loadEnv(src: NodeJS.ProcessEnv = process.env): Env {
  const parsed = schema.safeParse(src);
  if (!parsed.success) {
    throw new Error('Invalid environment: ' + parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
  }
  const env = parsed.data;
  if (env.NODE_ENV === 'production' && env.SESSION_SECRET === 'dev-only-insecure-secret') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  return env;
}
