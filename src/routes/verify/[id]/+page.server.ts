import { db } from '$lib/server/db';
import { products, batches } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { verifyProductOnChain, CONTRACT_ADDRESS, EXPLORER_BASE_URL } from '$lib/server/blockchain';

export async function load({ params }) {
    const { id } = params;
    
    if (!id) {
        throw error(400, 'Product ID is required');
    }

    const product = await db.select().from(products).where(eq(products.id, id)).get();

    // Query on-chain smart contract (either directly by product id or via its parent batchId)
    const onChainQueryId = product?.batchId || id;
    const onChainRecord = await verifyProductOnChain(onChainQueryId);

    // Fetch batch metadata if this product is part of a batch
    let batch = null;
    if (product?.batchId) {
        batch = await db.select().from(batches).where(eq(batches.id, product.batchId)).get();
    }

    return {
        product: product || null,
        batch: batch || null,
        id,
        onChain: {
            isRegistered: onChainRecord.isRegistered,
            isAuthentic: onChainRecord.isAuthentic,
            manufacturer: onChainRecord.manufacturer,
            queried: onChainRecord.onChain,
            contractAddress: CONTRACT_ADDRESS,
            explorerUrl: product?.blockchainTxHash ? `${EXPLORER_BASE_URL}/tx/${product.blockchainTxHash}` : null,
            contractExplorerUrl: `${EXPLORER_BASE_URL}/address/${CONTRACT_ADDRESS}`
        }
    };
}
