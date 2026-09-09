import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  manufacturer: text('manufacturer').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  blockchainTxHash: text('blockchain_tx_hash'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});
