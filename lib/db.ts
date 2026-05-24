import fs from 'fs';
import path from 'path';
import initSqlJs from 'sql.js';
import type { Database, SqlJsStatic } from 'sql.js';

const DB_PATH = path.join(process.cwd(), 'data', 'portfolio.db');

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

async function getSQL() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

export async function getDb(): Promise<Database> {
  if (db) return db;
  const SqlJs = await getSQL();
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SqlJs.Database(fileBuffer);
    // Ensure all tables exist (important for migrations)
    initSchema(db);
  } else {
    db = new SqlJs.Database();
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database) {
  database.run(`CREATE TABLE IF NOT EXISTS site_data (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at INTEGER DEFAULT (strftime('%s','now')))`);
  database.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at INTEGER DEFAULT (strftime('%s','now')))`);
  database.run(`CREATE TABLE IF NOT EXISTS certificates (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, issuer TEXT NOT NULL, date TEXT NOT NULL, credential_url TEXT, image_url TEXT, skills TEXT, sort_order INTEGER DEFAULT 0)`);
  database.run(`CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, tech TEXT, live_url TEXT, github_url TEXT, image TEXT, featured INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0)`);
}

export function saveDb(database: Database) {
  const data = database.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function dbGet(database: Database, sql: string, params: any[] = []) {
  const stmt = database.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

export function dbAll(database: Database, sql: string, params: any[] = []) {
  const results: any[] = [];
  const stmt = database.prepare(sql);
  stmt.bind(params);
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

export function dbRun(database: Database, sql: string, params: any[] = []) {
  database.run(sql, params);
}
