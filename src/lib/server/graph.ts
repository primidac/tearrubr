import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export interface GraphProduct {
	id: string;
	productId: string;
	manufacturer: string;
	isAuthentic: boolean;
	blockNumber: string;
	blockTimestamp: string;
	transactionHash: string;
}

export interface GraphMeta {
	blockNumber: number;
	blockTimestamp: number;
	deployment: string;
	isSynced: boolean;
}

export function getSubgraphUrl(): string {
	return (
		env.SUBGRAPH_URL ||
		publicEnv.PUBLIC_SUBGRAPH_URL ||
		process.env.SUBGRAPH_URL ||
		process.env.PUBLIC_SUBGRAPH_URL ||
		''
	).trim();
}

export function isSubgraphConfigured(): boolean {
	const url = getSubgraphUrl();
	return url.length > 0 && url.startsWith('http');
}

export async function fetchSubgraph<T = any>(query: string, variables: Record<string, any> = {}): Promise<T | null> {
	const url = getSubgraphUrl();
	if (!url) return null;

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 6000);

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ query, variables }),
			signal: controller.signal
		});

		clearTimeout(timeout);

		if (!response.ok) {
			console.warn(`[TheGraph] HTTP ${response.status} from ${url}`);
			return null;
		}

		const data = await response.json();
		if (data.errors && data.errors.length > 0) {
			console.warn('[TheGraph] GraphQL errors:', data.errors);
			return null;
		}

		return data.data as T;
	} catch (error: any) {
		clearTimeout(timeout);
		if (error.name !== 'AbortError') {
			console.warn('[TheGraph] Fetch error:', error.message);
		}
		return null;
	}
}

export async function getSubgraphProducts(first = 50, skip = 0): Promise<GraphProduct[]> {
	if (!isSubgraphConfigured()) return [];

	const query = `
		query GetProducts($first: Int!, $skip: Int!) {
			products(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
				id
				productId
				manufacturer
				isAuthentic
				blockNumber
				blockTimestamp
				transactionHash
			}
		}
	`;

	const result = await fetchSubgraph<{ products: GraphProduct[] }>(query, { first, skip });
	return result?.products || [];
}

export async function getSubgraphProductById(productId: string): Promise<GraphProduct | null> {
	if (!isSubgraphConfigured()) return null;

	const query = `
		query GetProduct($id: ID!) {
			product(id: $id) {
				id
				productId
				manufacturer
				isAuthentic
				blockNumber
				blockTimestamp
				transactionHash
			}
		}
	`;

	const result = await fetchSubgraph<{ product: GraphProduct | null }>(query, { id: productId });
	return result?.product || null;
}

export async function getSubgraphMeta(): Promise<GraphMeta | null> {
	if (!isSubgraphConfigured()) return null;

	const query = `
		query GetMeta {
			_meta {
				block {
					number
					timestamp
				}
				deployment
				hasIndexingErrors
			}
		}
	`;

	const result = await fetchSubgraph<{
		_meta: {
			block: { number: number; timestamp: number };
			deployment: string;
			hasIndexingErrors: boolean;
		};
	}>(query);

	if (!result?._meta) return null;

	return {
		blockNumber: result._meta.block?.number || 0,
		blockTimestamp: result._meta.block?.timestamp || 0,
		deployment: result._meta.deployment || '',
		isSynced: !result._meta.hasIndexingErrors
	};
}
