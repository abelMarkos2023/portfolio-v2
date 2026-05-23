import { NextRequest, NextResponse } from 'next/server';
import { getDb, dbGet, dbRun, saveDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import bcrypt from 'bcryptjs';
export async function POST(req: NextRequest) {
  const username = await requireAuth().catch(() => null);
  if (!username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  const db = await getDb();
  const user = dbGet(db, 'SELECT * FROM users WHERE username = ?', [username]);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const valid = await bcrypt.compare(currentPassword, user.password_hash as string);
  if (!valid) return NextResponse.json({ error: 'Wrong current password' }, { status: 401 });
  const hash = await bcrypt.hash(newPassword, 10);
  dbRun(db, 'UPDATE users SET password_hash = ? WHERE username = ?', [hash, username]);
  saveDb(db);
  return NextResponse.json({ ok: true });
}
