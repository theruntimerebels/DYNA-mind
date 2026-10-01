/** Minimal structured logger. Never pass message bodies, keys or URIs to it. */
const emit = (level: string, msg: string, meta?: Record<string, unknown>) =>
  console.log(JSON.stringify({ t: new Date().toISOString(), level, msg, ...meta }));
export const log = {
  info: (m: string, meta?: Record<string, unknown>) => emit('info', m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => emit('warn', m, meta),
  error: (m: string, meta?: Record<string, unknown>) => emit('error', m, meta),
};
