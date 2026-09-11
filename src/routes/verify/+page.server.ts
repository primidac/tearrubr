import { db } from '$lib/server/db';
import { products, batches } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import { CONTRACT_ADDRESS, EXPLORER_BASE_URL } from '$lib/server/blockchain';

export async function load({ url }) {
    try {
        const allProducts = await db
            .select()
            .from(products)
            .orderBy(desc(products.createdAt));

        const allBatches = await db
            .select()
            .from(batches)
            .orderBy(desc(batches.createdAt));

        return {
            products: allProducts,
            batches: allBatches,
            contractAddress: CONTRACT_ADDRESS,
            explorerBaseUrl: EXPLORER_BASE_URL,
            network: 'Ethereum Sepolia',
            initialQuery: url.searchParams.get('q') || ''
        };
    } catch (error) {
        console.error('Error fetching public ledger products:', error);
        return {
            products: [],
            batches: [],
            contractAddress: CONTRACT_ADDRESS,
            explorerBaseUrl: EXPLORER_BASE_URL,
            network: 'Ethereum Sepolia',
            initialQuery: ''
        };
    }
}
