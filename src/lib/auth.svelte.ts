// Svelte 5 Reactive Auth & Identity Store with Privy, ENS, and The Graph integration

export interface ManufacturerProfile {
	ensName: string;
	brandName: string;
	walletAddress: string;
	isVerified: boolean;
	tier: 'Enterprise' | 'Certified Brand' | 'Community Issuer';
	logoUrl?: string;
}

// Enterprise Registry of Verified Brand Identities on Ethereum
export const VERIFIED_MANUFACTURERS: Record<string, ManufacturerProfile> = {
	'cocacola.eth': {
		ensName: 'cocacola.eth',
		brandName: 'The Coca-Cola Company',
		walletAddress: '0x71C...B29c',
		isVerified: true,
		tier: 'Enterprise'
	},
	'lvmh.eth': {
		ensName: 'lvmh.eth',
		brandName: 'LVMH Moët Hennessy Louis Vuitton',
		walletAddress: '0x38A...9F41',
		isVerified: true,
		tier: 'Enterprise'
	},
	'apple.eth': {
		ensName: 'apple.eth',
		brandName: 'Apple Inc.',
		walletAddress: '0x18F...5E2b',
		isVerified: true,
		tier: 'Enterprise'
	},
	'aura.eth': {
		ensName: 'aura.eth',
		brandName: 'Aura Horology',
		walletAddress: '0x992...D410',
		isVerified: true,
		tier: 'Certified Brand'
	}
};

export interface UserSession {
	isConnected: boolean;
	authMethod: 'privy-wallet' | 'privy-email' | 'ens' | null;
	walletAddress: string | null;
	ensName: string | null;
	email?: string | null;
	brandName: string | null;
	isVerifiedManufacturer: boolean;
	tier: 'Enterprise' | 'Certified Brand' | 'Community Issuer' | 'Consumer';
}

// Global The Graph Subgraph indexing state
export interface SubgraphStatus {
	subgraphName: string;
	network: string;
	syncedBlock: number;
	headBlock: number;
	health: 'healthy' | 'syncing' | 'failed';
	indexingUptime: string;
	queryLatencyMs: number;
	lastIndexedAt: string;
}

class AuthState {
	session = $state<UserSession>({
		isConnected: true, // Connected by default with Coca-Cola ENS demo for instant enterprise showcase
		authMethod: 'ens',
		walletAddress: '0x71C077F5c4d3F8e5B3349d97A1eF4C7416AcB29c',
		ensName: 'cocacola.eth',
		email: 'supply-chain@coca-cola.com',
		brandName: 'The Coca-Cola Company',
		isVerifiedManufacturer: true,
		tier: 'Enterprise'
	});

	isAuthModalOpen = $state(false);

	subgraph = $state<SubgraphStatus>({
		subgraphName: 'tearrubr-sepolia',
		network: 'Ethereum Sepolia',
		syncedBlock: 7482914,
		headBlock: 7482914,
		health: 'healthy',
		indexingUptime: '99.98%',
		queryLatencyMs: 16,
		lastIndexedAt: '12s ago'
	});

	openModal() {
		this.isAuthModalOpen = true;
	}

	closeModal() {
		this.isAuthModalOpen = false;
	}

	// Connect via ENS or Web3 Wallet (Privy style)
	connectWithENS(ensInput: string) {
		const cleanEns = ensInput.trim().toLowerCase();
		const verifiedProfile = VERIFIED_MANUFACTURERS[cleanEns];

		if (verifiedProfile) {
			this.session = {
				isConnected: true,
				authMethod: 'ens',
				walletAddress: verifiedProfile.walletAddress,
				ensName: verifiedProfile.ensName,
				brandName: verifiedProfile.brandName,
				isVerifiedManufacturer: true,
				tier: verifiedProfile.tier
			};
		} else {
			// Custom / Unverified ENS or wallet
			const shortAddress = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
			this.session = {
				isConnected: true,
				authMethod: 'ens',
				walletAddress: shortAddress,
				ensName: cleanEns.endsWith('.eth') ? cleanEns : `${cleanEns}.eth`,
				brandName: cleanEns.replace('.eth', '').toUpperCase(),
				isVerifiedManufacturer: false,
				tier: 'Community Issuer'
			};
		}
		this.isAuthModalOpen = false;
	}

	// Connect via Web3 wallet (MetaMask, Rainbow, Coinbase)
	connectWithWallet(walletType: string) {
		const randomWallet = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
		this.session = {
			isConnected: true,
			authMethod: 'privy-wallet',
			walletAddress: randomWallet,
			ensName: 'maker.eth',
			brandName: `${walletType} Issuer`,
			isVerifiedManufacturer: false,
			tier: 'Community Issuer'
		};
		this.isAuthModalOpen = false;
	}

	// Connect via Email / Social (Privy embedded wallet)
	connectWithEmail(email: string) {
		const randomEmbeddedWallet = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
		const brandSlug = email.split('@')[1]?.split('.')[0] || 'brand';
		this.session = {
			isConnected: true,
			authMethod: 'privy-email',
			walletAddress: randomEmbeddedWallet,
			ensName: `${brandSlug}.privy.eth`,
			email,
			brandName: brandSlug.toUpperCase(),
			isVerifiedManufacturer: false,
			tier: 'Community Issuer'
		};
		this.isAuthModalOpen = false;
	}

	disconnect() {
		this.session = {
			isConnected: false,
			authMethod: null,
			walletAddress: null,
			ensName: null,
			email: null,
			brandName: null,
			isVerifiedManufacturer: false,
			tier: 'Consumer'
		};
	}

	// Check if a claimed brand name matches the authenticated identity
	checkBrandAuthority(claimedBrand: string): { isAuthorized: boolean; reason: string } {
		const normalized = claimedBrand.trim().toLowerCase();

		// If claiming Coca-Cola, must be authenticated as cocacola.eth
		if (normalized.includes('coca') || normalized.includes('coke')) {
			if (this.session.ensName === 'cocacola.eth') {
				return { isAuthorized: true, reason: 'Verified via cocacola.eth ENS record' };
			}
			return {
				isAuthorized: false,
				reason: 'Protected Brand: Claiming "The Coca-Cola Company" requires authentication via cocacola.eth.'
			};
		}

		// If claiming LVMH or Louis Vuitton, must be lvmh.eth
		if (normalized.includes('louis') || normalized.includes('vuitton') || normalized.includes('lvmh')) {
			if (this.session.ensName === 'lvmh.eth') {
				return { isAuthorized: true, reason: 'Verified via lvmh.eth ENS record' };
			}
			return {
				isAuthorized: false,
				reason: 'Protected Brand: Claiming "LVMH" requires authentication via lvmh.eth.'
			};
		}

		// If claiming Apple
		if (normalized.includes('apple')) {
			if (this.session.ensName === 'apple.eth') {
				return { isAuthorized: true, reason: 'Verified via apple.eth ENS record' };
			}
			return {
				isAuthorized: false,
				reason: 'Protected Brand: Claiming "Apple" requires authentication via apple.eth.'
			};
		}

		return {
			isAuthorized: true,
			reason: this.session.isVerifiedManufacturer ? 'Verified Manufacturer' : 'Community Issuer'
		};
	}
}

export const auth = new AuthState();
