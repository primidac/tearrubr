import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();

const PRIVY_APP_ID = process.env.PUBLIC_PRIVY_APP_ID || 'cmtxc3lqn00sm0cl5g1au6b1o';

// POST /api/blockchain/privy - Handles Privy Email OTP & Passwordless Authentication
export async function POST({ request }) {
	try {
		const data = await request.json();
		const { action, email, code } = data;

		if (action === 'send-code') {
			if (!email || !email.includes('@')) {
				return json({ success: false, error: 'Valid email address is required' }, { status: 400 });
			}

			// Call Privy's official passwordless API
			const res = await fetch('https://auth.privy.io/api/v1/passwordless/init', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'privy-app-id': PRIVY_APP_ID
				},
				body: JSON.stringify({ email: email.trim().toLowerCase() })
			});

			const result = await res.json();
			if (!res.ok) {
				return json(
					{ success: false, error: result.error || 'Failed to send verification code from Privy' },
					{ status: res.status }
				);
			}

			return json({ success: true, message: 'Verification code sent to your email by Privy' });
		}

		if (action === 'verify-code') {
			if (!email || !code) {
				return json({ success: false, error: 'Email and 6-digit code are required' }, { status: 400 });
			}

			// Call Privy's official passwordless authenticate API
			const res = await fetch('https://auth.privy.io/api/v1/passwordless/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'privy-app-id': PRIVY_APP_ID
				},
				body: JSON.stringify({
					email: email.trim().toLowerCase(),
					code: code.trim()
				})
			});

			const result = await res.json();
			if (!res.ok) {
				return json(
					{ success: false, error: result.error || 'Invalid or expired verification code' },
					{ status: res.status }
				);
			}

			// Extract wallet address if user has an embedded or linked wallet
			const user = result.user || {};
			let walletAddress = null;

			// Check linked accounts for an Ethereum wallet
			if (Array.isArray(user.linked_accounts)) {
				const walletAccount = user.linked_accounts.find(
					(acc: any) => acc.type === 'wallet' && acc.chain_type === 'ethereum'
				);
				if (walletAccount) {
					walletAddress = walletAccount.address;
				}
			}

			return json({
				success: true,
				user: {
					id: user.id,
					email: email.trim().toLowerCase(),
					walletAddress,
					token: result.token
				}
			});
		}

		return json({ success: false, error: 'Invalid action' }, { status: 400 });
	} catch (error: any) {
		console.error('[Privy API Error]:', error);
		return json({ success: false, error: error.message || 'Privy service error' }, { status: 500 });
	}
}
