import { NextRequest, NextResponse } from 'next/server';
import { getDb, dbGet, dbRun, saveDb } from '@/lib/db';
import { makeToken, setSessionCookie } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const db = await getDb();
  let user = dbGet(db, 'SELECT * FROM users WHERE username = ?', [username]);
  if (!user && username === 'admin') {
    const hash = await bcrypt.hash(password, 10);
    dbRun(db, 'INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
    saveDb(db);
    user = dbGet(db, 'SELECT * FROM users WHERE username = ?', [username]);
  }
  if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  const token = makeToken(username);
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', setSessionCookie(token));
  return res;
}
