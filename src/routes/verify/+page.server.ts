import { db } from '$lib/server/db';
import { products, batches } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import { CONTRACT_ADDRESS, EXPLORER_BASE_URL } from '$lib/server/blockchain';
import { isSubgraphConfigured, getSubgraphProducts, getSubgraphMeta } from '$lib/server/graph';

export async function load({ url }) {
	try {
		const [allProducts, allBatches, graphProducts, graphMeta] = await Promise.all([
			db.select().from(products).orderBy(desc(products.createdAt)),
			db.select().from(batches).orderBy(desc(batches.createdAt)),
			getSubgraphProducts(100, 0).catch(() => []),
			getSubgraphMeta().catch(() => null)
		]);

		// If The Graph has indexed items, sync the on-chain status
		const isGraphActive = isSubgraphConfigured() && (graphMeta !== null || graphProducts.length > 0);

		// Enrich db products with The Graph data if available
		const enrichedProducts = allProducts.map((p) => {
			const graphMatch = graphProducts.find((gp) => gp.productId === p.id);
			if (graphMatch) {
				return {
					...p,
					blockchainTxHash: graphMatch.transactionHash || p.blockchainTxHash,
					blockNumber: Number(graphMatch.blockNumber) || 0,
					isAuthentic: graphMatch.isAuthentic,
					indexedByGraph: true
				};
			}
			return {
				...p,
				blockNumber: 0,
				indexedByGraph: false
			};
		});

		return {
			products: enrichedProducts,
			batches: allBatches,
			contractAddress: CONTRACT_ADDRESS,
			explorerBaseUrl: EXPLORER_BASE_URL,
			network: 'Ethereum Sepolia',
			initialQuery: url.searchParams.get('q') || '',
			isTheGraphActive: isGraphActive,
			graphMeta
		};
	} catch (error) {
		console.error('Error fetching public ledger products:', error);
		return {
			products: [],
			batches: [],
			contractAddress: CONTRACT_ADDRESS,
			explorerBaseUrl: EXPLORER_BASE_URL,
			network: 'Ethereum Sepolia',
			initialQuery: '',
			isTheGraphActive: false,
			graphMeta: null
		};
	}
}
