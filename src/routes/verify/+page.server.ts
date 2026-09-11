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
		// Conceal unique product ID for products that have NOT been opened yet
		const enrichedProducts = allProducts.map((p, index) => {
			const graphMatch = graphProducts.find((gp) => gp.productId === p.id);
			const isOpened = p.sealStatus === 'opened';
			const txHash = graphMatch?.transactionHash || p.blockchainTxHash;
			const blockNum = Number(graphMatch?.blockNumber) || 0;
			const isAuth = graphMatch ? graphMatch.isAuthentic : true;

			return {
				...p,
				// Unique ID is only exposed if seal has ALREADY been broken/verified
				id: isOpened ? p.id : null,
				// Safe public key for UI iteration without exposing unsealed secret ID
				displayKey: isOpened ? p.id : `sealed-${p.batchId || 'single'}-${p.serialIndex || index}-${p.createdAt instanceof Date ? p.createdAt.getTime() : p.createdAt}`,
				isIdConcealed: !isOpened,
				blockchainTxHash: txHash,
				blockNumber: blockNum,
				isAuthentic: isAuth,
				indexedByGraph: Boolean(graphMatch)
			};
		});

		const initialIdQuery = url.searchParams.get('id') || url.searchParams.get('q') || '';

		return {
			products: enrichedProducts,
			batches: allBatches,
			contractAddress: CONTRACT_ADDRESS,
			explorerBaseUrl: EXPLORER_BASE_URL,
			network: 'Ethereum Sepolia',
			initialQuery: initialIdQuery,
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
