import { NextRequest, NextResponse } from 'next/server';
import { getDb, dbAll, dbRun, saveDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const db = await getDb();
  const rows = dbAll(db, 'SELECT * FROM certificates ORDER BY sort_order ASC');
  return NextResponse.json(rows.map(r => ({ ...r, skills: (r.skills as string)?.split(',').filter(Boolean) || [] })));
}

export async function POST(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const cert = await req.json();
  const db = await getDb();
  dbRun(db, 'INSERT INTO certificates (title,issuer,date,credential_url,image_url,skills,sort_order) VALUES (?,?,?,?,?,?,?)',
    [cert.title, cert.issuer, cert.date, cert.credential_url || '', cert.image_url || '', (cert.skills || []).join(','), cert.sort_order || 99]);
  saveDb(db);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const cert = await req.json();
  const db = await getDb();
  dbRun(db, 'UPDATE certificates SET title=?,issuer=?,date=?,credential_url=?,image_url=?,skills=?,sort_order=? WHERE id=?',
    [cert.title, cert.issuer, cert.date, cert.credential_url || '', cert.image_url || '', (cert.skills || []).join(','), cert.sort_order || 0, cert.id]);
  saveDb(db);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const db = await getDb();
  dbRun(db, 'DELETE FROM certificates WHERE id = ?', [id]);
  saveDb(db);
  return NextResponse.json({ ok: true });
}
