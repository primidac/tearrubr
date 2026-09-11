import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { v4 as uuidv4 } from 'uuid';
import { isBlockchainConfigured, registerProductOnChain } from '$lib/server/blockchain';

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    if (!data.manufacturer || !data.name) {
      return json({ error: 'Manufacturer and name are required' }, { status: 400 });
    }

    const id = uuidv4();
    const now = new Date();
    let blockchainTxHash: string | null = null;

    if (isBlockchainConfigured()) {
      try {
        const onChain = await registerProductOnChain(id, data.manufacturer.trim());
        blockchainTxHash = onChain.txHash;
      } catch (chainErr: any) {
        console.error('Blockchain registration error:', chainErr);
        return json({ 
          error: `On-chain registration failed: ${chainErr?.message || 'Transaction reverted'}` 
        }, { status: 502 });
      }
    }

    await db.insert(products).values({
      id,
      manufacturer: data.manufacturer.trim(),
      name: data.name.trim(),
      description: data.description ? data.description.trim() : null,
      blockchainTxHash,
      createdAt: now,
      updatedAt: now
    });

    return json({ success: true, id, blockchainTxHash }, { status: 201 });
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
