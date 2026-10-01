import { createHmac, timingSafeEqual } from 'node:crypto';

/** Prototype session token: "<userId>.<hmac>". Proves the caller was issued this userId by us. */
export const signUser = (userId: string, secret: string) =>
  `${userId}.${createHmac('sha256', secret).update(userId).digest('base64url')}`;

export function verifyToken(token: string, secret: string): string | null {
  const i = token.lastIndexOf('.');
  if (i < 1) return null;
  const userId = token.slice(0, i);
  const expected = Buffer.from(signUser(userId, secret));
  const got = Buffer.from(token);
  return expected.length === got.length && timingSafeEqual(expected, got) ? userId : null;
}
