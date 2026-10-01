import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodError } from 'zod';
import { timingSafeEqual } from 'node:crypto';
import { AppError, unauthorized } from '../utils/errors.ts';
import { verifyToken } from '../utils/session.ts';
import { log } from '../utils/logger.ts';
import type { Env } from '../config/env.ts';

declare module 'express-serve-static-core' { interface Request { userId?: string; role?: 'user' | 'counsellor' } }

export const validate = <T extends z.ZodTypeAny>(schema: T, where: 'body' | 'params' | 'query' = 'body'): RequestHandler =>
  (req, _res, next) => {
    const r = schema.safeParse(req[where]);
    if (!r.success) return next(new AppError(400, 'VALIDATION_ERROR', r.error.issues.map((i) => `${i.path.join('.') || where}: ${i.message}`).join('; ')));
    (req as any)[where === 'body' ? 'body' : `validated_${where}`] = r.data;
    next();
  };

export const asyncH = (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler => (req, res, next) => { fn(req, res).catch(next); };

export const userAuth = (env: Env): RequestHandler => (req, _res, next) => {
  const h = req.header('authorization') ?? '';
  const uid = h.startsWith('Bearer ') ? verifyToken(h.slice(7), env.SESSION_SECRET) : null;
  if (!uid) return next(unauthorized('Invalid or missing session token'));
  req.userId = uid; req.role = 'user'; next();
};

const eq = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export const counsellorAuth = (env: Env): RequestHandler => (req, _res, next) => {
  if (!env.COUNSELLOR_ACCESS_CODE) { req.role = 'counsellor'; return next(); } // dev only; warned at startup
  const code = req.header('x-access-code') ?? '';
  if (!eq(code, env.COUNSELLOR_ACCESS_CODE)) return next(unauthorized('Invalid access code'));
  req.role = 'counsellor'; next();
};

/** A user may read their own data; a counsellor (valid access code) may read any case. */
export const selfOrCounsellor = (env: Env): RequestHandler => (req, _res, next) => {
  const code = req.header('x-access-code');
  if (env.COUNSELLOR_ACCESS_CODE && code && eq(code, env.COUNSELLOR_ACCESS_CODE)) { req.role = 'counsellor'; return next(); }
  userAuth(env)(req, _res, (err) => {
    if (err) return next(err);
    if (req.userId !== req.params.userId) return next(new AppError(403, 'FORBIDDEN', 'Not allowed to access this user.'));
    next();
  });
};

export const notFoundHandler: RequestHandler = (_req, _res, next) => next(new AppError(404, 'NOT_FOUND', 'Route not found'));

/** Central handler: never leaks stack traces, keys or DB details. */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) return void res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
  if (err instanceof ZodError) return void res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid request' } });
  if ((err as any)?.type === 'entity.too.large') return void res.status(413).json({ success: false, error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body too large' } });
  if ((err as any)?.type === 'entity.parse.failed') return void res.status(400).json({ success: false, error: { code: 'BAD_JSON', message: 'Malformed JSON' } });
  log.error('Unhandled error', { path: req.path, name: (err as Error)?.name });
  res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } });
}
