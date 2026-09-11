import { json } from '@sveltejs/kit';
import { isSubgraphConfigured, getSubgraphMeta, getSubgraphProducts, getSubgraphUrl } from '$lib/server/graph';

export async function GET({ url }) {
	const isConfigured = isSubgraphConfigured();
	if (!isConfigured) {
		return json({
			isConfigured: false,
			message: 'Subgraph URL is not yet configured in environment variables',
			products: [],
			meta: null
		});
	}

	const first = Math.min(Number(url.searchParams.get('first')) || 25, 100);
	const skip = Math.max(Number(url.searchParams.get('skip')) || 0, 0);

	try {
		const [products, meta] = await Promise.all([
			getSubgraphProducts(first, skip),
			getSubgraphMeta()
		]);

		return json({
			isConfigured: true,
			url: getSubgraphUrl().replace(/\/[a-zA-Z0-9_-]+$/, '/***'), // masked endpoint
			meta,
			products,
			count: products.length
		});
	} catch (error: any) {
		return json({
			isConfigured: true,
			error: error.message,
			products: [],
			meta: null
		}, { status: 500 });
	}
}
