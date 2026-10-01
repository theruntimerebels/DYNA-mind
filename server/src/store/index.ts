import type { Env } from '../config/env.ts';
import type { Store } from './types.ts';
import { createMemoryStore } from './memory.ts';
import { log } from '../utils/logger.ts';

/** DEMO_MODE=true -> memory store (explicit). Otherwise MongoDB is required; failure is fatal, never silent. */
export async function createStore(env: Env): Promise<Store> {
  if (env.DEMO_MODE) {
    log.warn('DEMO_MODE=true: using in-memory store. Data is NOT persisted.');
    return createMemoryStore();
  }
  const { createMongoStore } = await import('./mongo.ts');
  const s = await createMongoStore(env.MONGODB_URI, env.MONGODB_DB);
  log.info('MongoDB connected', { db: env.MONGODB_DB });
  return s;
}
