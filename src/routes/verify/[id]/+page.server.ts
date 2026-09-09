import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const { id } = params;
    
    if (!id) {
        throw error(400, 'Product ID is required');
    }

    const product = await db.select().from(products).where(eq(products.id, id)).get();

    return {
        product: product || null,
        id
    };
}
