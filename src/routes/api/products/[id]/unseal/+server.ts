import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ params }) {
  try {
    const { id } = params;
    if (!id) {
      return json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await db.select().from(products).where(eq(products.id, id)).get();
    if (!product) {
      return json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.sealStatus === 'opened') {
      return json({
        success: true,
        alreadyOpened: true,
        sealStatus: 'opened',
        openedAt: product.openedAt
      });
    }

    const now = new Date();
    await db
      .update(products)
      .set({
        sealStatus: 'opened',
        openedAt: now,
        updatedAt: now
      })
      .where(eq(products.id, id));

    return json({
      success: true,
      alreadyOpened: false,
      sealStatus: 'opened',
      openedAt: now
    });
  } catch (error: any) {
    console.error('Error unsealing product:', error);
    return json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
