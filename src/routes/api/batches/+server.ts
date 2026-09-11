import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { batches, products } from '$lib/server/schema';
import { v4 as uuidv4 } from 'uuid';
import { desc, eq } from 'drizzle-orm';
import { isBlockchainConfigured, registerProductOnChain } from '$lib/server/blockchain';
import { generateBatchItems, generateManifestCsv } from '$lib/server/batch';

export async function POST({ request, url }) {
  try {
    const data = await request.json();

    const manufacturer = data.manufacturer?.trim();
    const productName = data.productName?.trim() || data.name?.trim();
    const batchNumber = data.batchNumber?.trim();
    const quantity = parseInt(data.quantity, 10);
    const description = data.description?.trim() || null;

    if (!manufacturer || !productName || !batchNumber || isNaN(quantity) || quantity < 1) {
      return json(
        { error: 'Manufacturer, product name, batch number, and a positive quantity are required.' },
        { status: 400 }
      );
    }

    if (quantity > 1000) {
      return json(
        { error: 'Maximum batch size for demonstration is 1,000 units per transaction.' },
        { status: 400 }
      );
    }

    // Check if batch number already exists for this manufacturer
    const existing = await db
      .select()
      .from(batches)
      .where(eq(batches.batchNumber, batchNumber))
      .get();

    if (existing) {
      return json(
        { error: `Batch number "${batchNumber}" has already been registered.` },
        { status: 409 }
      );
    }

    const batchId = uuidv4();
    const now = new Date();

    // 1. Generate cryptographic serials and Merkle Root
    const { items, merkleRoot } = generateBatchItems({
      productName,
      batchNumber,
      quantity,
      manufacturer
    });

    // 2. Commit the Batch & Merkle Root to the Ethereum Sepolia smart contract in ONE transaction
    let blockchainTxHash: string | null = null;
    if (isBlockchainConfigured()) {
      try {
        console.log(`[Batch API] Broadcasting batch registration on-chain for ${batchNumber} (${quantity} units)...`);
        const onChain = await registerProductOnChain(batchId, manufacturer);
        blockchainTxHash = onChain.txHash;
      } catch (chainErr: any) {
        console.error('Batch blockchain registration failed:', chainErr);
        return json(
          { error: `Blockchain registration failed: ${chainErr?.message || 'Transaction reverted'}` },
          { status: 502 }
        );
      }
    }

    // 3. Persist Batch Record in SQLite
    await db.insert(batches).values({
      id: batchId,
      batchNumber,
      manufacturer,
      productName,
      description,
      quantity,
      merkleRoot,
      blockchainTxHash,
      createdAt: now
    });

    // 4. Bulk Insert all serialized product units
    const productRows = items.map(item => ({
      id: item.id,
      manufacturer,
      name: productName,
      description: description ? `${description} (Serial: ${item.serialNumber})` : `Batch ${batchNumber} - Unit #${item.serialIndex} of ${quantity}`,
      blockchainTxHash,
      batchId,
      batchNumber,
      serialIndex: item.serialIndex,
      batchQuantity: quantity,
      sealStatus: 'sealed',
      createdAt: now,
      updatedAt: now
    }));

    // Insert in chunks of 50 to accommodate SQLite parameter limits safely
    const chunkSize = 50;
    for (let i = 0; i < productRows.length; i += chunkSize) {
      const chunk = productRows.slice(i, i + chunkSize);
      await db.insert(products).values(chunk);
    }

    // 5. Generate factory CSV manifest
    const csvManifest = generateManifestCsv({
      productName,
      manufacturer,
      batchNumber,
      items,
      origin: url.origin
    });

    return json(
      {
        success: true,
        batchId,
        batchNumber,
        manufacturer,
        productName,
        quantity,
        merkleRoot,
        blockchainTxHash,
        itemsCount: items.length,
        firstFewItems: items.slice(0, 5),
        csvManifest
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating batch:', error);
    return json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allBatches = await db.select().from(batches).orderBy(desc(batches.createdAt));
    return json({ batches: allBatches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
