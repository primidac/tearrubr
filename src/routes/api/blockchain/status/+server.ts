import { json } from '@sveltejs/kit';
import { getLiveBlockchainStatus } from '$lib/server/blockchain';

export async function GET() {
	try {
		const status = await getLiveBlockchainStatus();
		return json({ success: true, ...status });
	} catch (error: any) {
		return json({ success: false, message: error.message }, { status: 500 });
	}
}
