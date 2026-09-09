import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    if (!data.manufacturer || !data.name) {
      return json({ error: 'Manufacturer and name are required' }, { status: 400 });
    }

    const id = uuidv4();
    const now = new Date();

    await db.insert(products).values({
      id,
      manufacturer: data.manufacturer,
      name: data.name,
      description: data.description || null,
      blockchainTxHash: data.blockchainTxHash || null,
      createdAt: now,
      updatedAt: now
    });

    return json({ success: true, id }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return json({ products: allProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
