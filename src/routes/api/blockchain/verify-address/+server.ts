import { json } from '@sveltejs/kit';
import { checkAddressAuthorization } from '$lib/server/blockchain';

export async function GET({ url }) {
	const address = url.searchParams.get('address');
	if (!address) {
		return json({ success: false, message: 'Address parameter is required' }, { status: 400 });
	}

	try {
		const authStatus = await checkAddressAuthorization(address);
		return json({ success: true, ...authStatus });
	} catch (error: any) {
		return json({ success: false, message: error.message }, { status: 500 });
	}
}
