import { NextRequest, NextResponse } from 'next/server';
import { getDb, dbAll, dbRun, saveDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const db = await getDb();
    const rows = dbAll(db, 'SELECT * FROM projects ORDER BY sort_order ASC, id DESC');
    return NextResponse.json(rows.map(r => ({ 
      ...r, 
      tech: (r.tech as string)?.split(',').filter(Boolean) || [],
      featured: Boolean(r.featured)
    })));
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const project = await req.json();
    const db = await getDb();
    
    const techString = Array.isArray(project.tech) ? project.tech.join(',') : (project.tech || '');
    
    dbRun(db, 'INSERT INTO projects (title, description, tech, live_url, github_url, image, featured, sort_order) VALUES (?,?,?,?,?,?,?,?)',
      [
        project.title, 
        project.description || '', 
        techString, 
        project.live_url || '', 
        project.github_url || '', 
        project.image || '💻', 
        project.featured ? 1 : 0, 
        project.sort_order || 0
      ]);
    saveDb(db);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const project = await req.json();
    const db = await getDb();
    
    const techString = Array.isArray(project.tech) ? project.tech.join(',') : (project.tech || '');
    
    dbRun(db, 'UPDATE projects SET title=?, description=?, tech=?, live_url=?, github_url=?, image=?, featured=?, sort_order=? WHERE id=?',
      [
        project.title, 
        project.description || '', 
        techString, 
        project.live_url || '', 
        project.github_url || '', 
        project.image || '💻', 
        project.featured ? 1 : 0, 
        project.sort_order || 0,
        project.id
      ]);
    saveDb(db);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const { id } = await req.json();
    const db = await getDb();
    dbRun(db, 'DELETE FROM projects WHERE id = ?', [id]);
    saveDb(db);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
