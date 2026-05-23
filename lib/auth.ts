import { cookies } from 'next/headers';
import { getDb, dbGet } from './db';

const SESSION_COOKIE = 'portfolio_session';
const SECRET = process.env.AUTH_SECRET || 'portfolio-secret-change-in-prod';

// Simple token: base64(username:timestamp:hmac)
export function makeToken(username: string): string {
  const payload = `${username}:${Date.now()}`;
  const buf = Buffer.from(payload + ':' + SECRET);
  return Buffer.from(payload + ':' + buf.toString('base64').slice(0, 16)).toString('base64');
}

export function parseToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    if (parts.length < 2) return null;
    const ts = parseInt(parts[1]);
    // 7 day expiry
    if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return null;
    return parts[0];
  } catch { return null; }
}

export async function getSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return parseToken(token);
  } catch { return null; }
}

export async function requireAuth(): Promise<string> {
  const user = await getSession();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export function setSessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
}
