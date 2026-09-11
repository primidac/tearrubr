import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { products, batches } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
	try {
		let body: { id?: string } = {};
		try {
			body = await request.json();
		} catch {
			return json({ success: false, status: 'invalid_request', message: 'Invalid JSON body' }, { status: 400 });
		}

		const rawId = body.id?.trim();
		if (!rawId) {
			return json({ success: false, status: 'missing_id', message: 'Unique Product Security ID is required' }, { status: 400 });
		}

		// Exact ID lookup
		const product = await db.select().from(products).where(eq(products.id, rawId)).get();

		if (!product) {
			return json({
				success: false,
				status: 'not_found',
				queryId: rawId,
				message: 'No product matches this security ID in the blockchain registry.'
			}, { status: 404 });
		}

		// Fetch batch details if applicable
		let batch = null;
		if (product.batchId) {
			batch = await db.select().from(batches).where(eq(batches.id, product.batchId)).get();
		}

		// Case A: Product was ALREADY opened/verified previously
		if (product.sealStatus === 'opened') {
			return json({
				success: true,
				status: 'previously_opened',
				queryId: rawId,
				openedAt: product.openedAt,
				product: {
					...product,
					batchDetails: batch
				}
			});
		}

		// Case B: First Time Verification! Mark as unsealed/broken TODAY
		const now = new Date();
		await db
			.update(products)
			.set({
				sealStatus: 'opened',
				openedAt: now,
				updatedAt: now
			})
			.where(eq(products.id, product.id));

		const updatedProduct = {
			...product,
			sealStatus: 'opened',
			openedAt: now,
			updatedAt: now,
			batchDetails: batch
		};

		return json({
			success: true,
			status: 'first_time_verified',
			queryId: rawId,
			openedAt: now,
			product: updatedProduct
		});
	} catch (error: any) {
		console.error('Error in /api/products/verify:', error);
		return json({
			success: false,
			status: 'server_error',
			message: error?.message || 'Internal server error'
		}, { status: 500 });
	}
}
