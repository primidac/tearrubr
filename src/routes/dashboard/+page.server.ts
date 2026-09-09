import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { desc } from 'drizzle-orm';

export async function load() {
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return {
        products: allProducts
    };
}
