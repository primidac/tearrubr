import { db } from '$lib/server/db';
import { products } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import { CONTRACT_ADDRESS, EXPLORER_BASE_URL } from '$lib/server/blockchain';

export async function load({ url }) {
    try {
        const allProducts = await db
            .select()
            .from(products)
            .orderBy(desc(products.createdAt));

        return {
            products: allProducts,
            contractAddress: CONTRACT_ADDRESS,
            explorerBaseUrl: EXPLORER_BASE_URL,
            network: 'Ethereum Sepolia',
            initialQuery: url.searchParams.get('q') || ''
        };
    } catch (error) {
        console.error('Error fetching public ledger products:', error);
        return {
            products: [],
            contractAddress: CONTRACT_ADDRESS,
            explorerBaseUrl: EXPLORER_BASE_URL,
            network: 'Ethereum Sepolia',
            initialQuery: ''
        };
    }
}
