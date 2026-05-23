import { NextRequest, NextResponse } from 'next/server';
import { getDb, dbGet, dbRun, saveDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  const row = dbGet(db, "SELECT value FROM site_data WHERE key = 'main'");
  if (!row) {
    // return defaults
    return NextResponse.json(null);
  }
  return NextResponse.json(JSON.parse(row.value as string));
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const db = await getDb();
  const exists = dbGet(db, "SELECT key FROM site_data WHERE key = 'main'");
  if (exists) {
    dbRun(db, "UPDATE site_data SET value = ?, updated_at = strftime('%s','now') WHERE key = 'main'", [JSON.stringify(data)]);
  } else {
    dbRun(db, "INSERT INTO site_data (key, value) VALUES ('main', ?)", [JSON.stringify(data)]);
  }
  saveDb(db);
  return NextResponse.json({ ok: true });
}
