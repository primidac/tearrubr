import { db } from '$lib/server/db';
import { products, batches } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import { EXPLORER_BASE_URL, CONTRACT_ADDRESS } from '$lib/server/blockchain';

export async function load() {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    const allBatches = await db.select().from(batches).orderBy(desc(batches.createdAt));
    return {
        products: allProducts,
        batches: allBatches,
        contractAddress: CONTRACT_ADDRESS,
        explorerBaseUrl: EXPLORER_BASE_URL
    };
}
