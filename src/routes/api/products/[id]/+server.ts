import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return json({ error: 'ID is required' }, { status: 400 });
    }

    const product = await db.select().from(products).where(eq(products.id, id)).get();

    if (!product) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    return json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
