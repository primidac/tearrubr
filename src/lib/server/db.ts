import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { seedBatches, seedProducts } from './seedData';
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

// 1. Ensure batches and products tables exist
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

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    manufacturer TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    blockchain_tx_hash TEXT,
    batch_id TEXT,
    batch_number TEXT,
    serial_index INTEGER,
    batch_quantity INTEGER,
    seal_status TEXT DEFAULT 'sealed',
    opened_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

// 2. Safe column migrations for existing databases
try {
	const productColumns = (sqlite.prepare(`PRAGMA table_info(products)`).all() as Array<{ name: string }>).map((c) => c.name);

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
} catch (migErr) {
	console.warn('[DB] Column check/migration warning:', migErr);
}

// 3. Auto-seed if database is freshly created in /tmp (e.g. Vercel serverless container)
try {
	const countRow = sqlite.prepare('SELECT count(*) as count FROM products').get() as { count: number };
	if (countRow.count === 0 && seedProducts.length > 0) {
		console.log('[DB] Seeding initial products and batches for serverless environment...');

		const insertBatch = sqlite.prepare(`
			INSERT OR IGNORE INTO batches (id, batch_number, manufacturer, product_name, description, quantity, merkle_root, blockchain_tx_hash, created_at)
			VALUES (@id, @batch_number, @manufacturer, @product_name, @description, @quantity, @merkle_root, @blockchain_tx_hash, @created_at)
		`);
		sqlite.transaction((rows: any[]) => {
			for (const r of rows) insertBatch.run(r);
		})(seedBatches);

		const insertProduct = sqlite.prepare(`
			INSERT OR IGNORE INTO products (id, manufacturer, name, description, blockchain_tx_hash, batch_id, batch_number, serial_index, batch_quantity, seal_status, opened_at, created_at, updated_at)
			VALUES (@id, @manufacturer, @name, @description, @blockchain_tx_hash, @batch_id, @batch_number, @serial_index, @batch_quantity, @seal_status, @opened_at, @created_at, @updated_at)
		`);
		sqlite.transaction((rows: any[]) => {
			for (const r of rows) insertProduct.run(r);
		})(seedProducts);

		console.log(`[DB] Seeding complete (${seedBatches.length} batches, ${seedProducts.length} products).`);
	}
} catch (seedErr) {
	console.warn('[DB] Seed error:', seedErr);
}

export const db = drizzle(sqlite, { schema });
