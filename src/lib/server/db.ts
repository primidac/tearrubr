import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

let dbPath = './dev.db';

// Vercel serverless environments have a read-only root; use /tmp for SQLite writes
if (process.env.VERCEL) {
  const tmpPath = '/tmp/dev.db';
  try {
    const seedPath = path.resolve('./dev.db');
    if (!fs.existsSync(tmpPath) && fs.existsSync(seedPath)) {
      fs.copyFileSync(seedPath, tmpPath);
    }
    dbPath = tmpPath;
  } catch (err) {
    console.warn('[DB] Fallback to /tmp/dev.db:', err);
    dbPath = tmpPath;
  }
}

const sqlite = new Database(dbPath);

// Ensure batches table exists
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY,
    batch_number TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    product_name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    merkle_root TEXT NOT NULL,
    blockchain_tx_hash TEXT,
    created_at INTEGER NOT NULL
  );
`);

// Safe column migrations for products table
const productColumns = (sqlite.prepare(`PRAGMA table_info(products)`).all() as Array<{ name: string }>).map(c => c.name);

if (!productColumns.includes('batch_id')) {
  sqlite.exec(`ALTER TABLE products ADD COLUMN batch_id TEXT;`);
}
if (!productColumns.includes('batch_number')) {
  sqlite.exec(`ALTER TABLE products ADD COLUMN batch_number TEXT;`);
}
if (!productColumns.includes('serial_index')) {
  sqlite.exec(`ALTER TABLE products ADD COLUMN serial_index INTEGER;`);
}
if (!productColumns.includes('batch_quantity')) {
  sqlite.exec(`ALTER TABLE products ADD COLUMN batch_quantity INTEGER;`);
}
if (!productColumns.includes('seal_status')) {
  sqlite.exec(`ALTER TABLE products ADD COLUMN seal_status TEXT DEFAULT 'sealed';`);
}
if (!productColumns.includes('opened_at')) {
  sqlite.exec(`ALTER TABLE products ADD COLUMN opened_at INTEGER;`);
}

export const db = drizzle(sqlite, { schema });
