import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import { EXPLORER_BASE_URL } from '$lib/server/blockchain';

export async function load() {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return {
        products: allProducts,
        explorerBaseUrl: EXPLORER_BASE_URL
    };
}
