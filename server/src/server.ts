import { loadEnv } from './config/env.ts';
import { createStore } from './store/index.ts';
import { createAiService } from './ai/gemini.ts';
import { createApp } from './app.ts';
import { log } from './utils/logger.ts';

async function main() {
  const env = loadEnv();
  const store = await createStore(env); // throws if Mongo unreachable and DEMO_MODE is not true
  const ai = createAiService(env);
  if (!ai.available) log.warn('GEMINI_API_KEY/GEMINI_MODEL not set: using deterministic fallback replies (reported as ai.source="fallback").');
  if (!env.COUNSELLOR_ACCESS_CODE) log.warn('COUNSELLOR_ACCESS_CODE is empty: dashboard endpoints are OPEN. Development only.');
  const app = createApp({ env, store, ai });
  const srv = app.listen(env.PORT, () => log.info('DYNA MIND API listening', { port: env.PORT, store: store.mode }));
  const stop = () => srv.close(() => void store.close().then(() => process.exit(0)));
  process.on('SIGINT', stop); process.on('SIGTERM', stop);
}
main().catch((e) => { log.error('Startup failed', { reason: e instanceof Error ? e.message.replace(/mongodb(\+srv)?:\/\/\S+/gi, '[uri]') : 'unknown' }); process.exit(1); });
