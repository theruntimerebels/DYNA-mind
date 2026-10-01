import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import type { Env } from './config/env.ts';
import type { Store } from './store/types.ts';
import type { AiService } from './ai/gemini.ts';
import { buildRouter } from './routes/index.ts';
import { errorHandler, notFoundHandler } from './middleware/index.ts';
import { log } from './utils/logger.ts';

export function createApp(deps: { env: Env; store: Store; ai: AiService }) {
  const { env } = deps;
  const app = express();
  const origins = env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: (o, cb) => cb(null, !o || origins.includes(o)), allowedHeaders: ['Content-Type', 'Authorization', 'x-access-code'], methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
  app.use(express.json({ limit: '32kb' }));
  app.use((req, res, next) => { const t = Date.now(); res.on('finish', () => log.info('req', { m: req.method, p: req.path, s: res.statusCode, ms: Date.now() - t })); next(); });
  app.use('/api', buildRouter(deps));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
