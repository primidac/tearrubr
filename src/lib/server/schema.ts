import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const batches = sqliteTable('batches', {
  id: text('id').primaryKey(),
  batchNumber: text('batch_number').notNull(),
  manufacturer: text('manufacturer').notNull(),
  productName: text('product_name').notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull(),
  merkleRoot: text('merkle_root').notNull(),
  blockchainTxHash: text('blockchain_tx_hash'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  manufacturer: text('manufacturer').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  blockchainTxHash: text('blockchain_tx_hash'),
  batchId: text('batch_id'),
  batchNumber: text('batch_number'),
  serialIndex: integer('serial_index'),
  batchQuantity: integer('batch_quantity'),
  sealStatus: text('seal_status').default('sealed'), // 'sealed' | 'opened'
  openedAt: integer('opened_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
