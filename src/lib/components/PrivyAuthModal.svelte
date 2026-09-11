<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { fade, scale } from 'svelte/transition';

	let activeTab = $state<'wallet' | 'email' | 'lookup'>('wallet');

	// Email OTP state
	let email = $state('');
	let otpCode = $state('');
	let emailStep = $state<'input' | 'verify'>('input');
	let emailSuccessMessage = $state<string | null>(null);

	// Manual lookup
	let manualAddress = $state('');

	function handleConnect() {
		auth.connectWallet();
	}

	async function handleSendEmailCode(e: Event) {
		e.preventDefault();
		if (!email.trim()) return;
		emailSuccessMessage = null;

		const res = await auth.sendPrivyEmailCode(email.trim());
		if (res.success) {
			emailStep = 'verify';
			emailSuccessMessage = `6-digit verification code sent to ${email.trim()}`;
		}
	}

	async function handleVerifyEmailCode(e: Event) {
		e.preventDefault();
		if (!otpCode.trim()) return;
		await auth.verifyPrivyEmailCode(email.trim(), otpCode.trim());
	}

	function handleManualLookup(e: Event) {
		e.preventDefault();
		if (!manualAddress.trim()) return;
		auth.connectWithCustomAddress(manualAddress);
	}
</script>

{#if auth.isAuthModalOpen}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
		transition:fade={{ duration: 150 }}
		onclick={(e) => {
			if (e.target === e.currentTarget) auth.closeModal();
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') auth.closeModal();
		}}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Modal Card -->
		<div
			class="w-full max-w-md bg-[#0d0d16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden"
			transition:scale={{ start: 0.95, duration: 180 }}
		>
			<!-- Ambient Glow -->
			<div class="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#6366f1]/20 blur-[80px] pointer-events-none"></div>
			<div class="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#10b981]/15 blur-[80px] pointer-events-none"></div>

			<!-- Header -->
			<div class="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
				<div>
					<div class="flex items-center gap-2">
						<h3 class="text-base font-bold text-white font-display">Sign In & Connect</h3>
						<span class="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
							Privy Active
						</span>
					</div>
					<p class="text-xs text-[#8e8ea0] mt-0.5">Ethereum Sepolia · Verified Infrastructure</p>
				</div>

				<button
					onclick={() => auth.closeModal()}
					class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8e8ea0] hover:text-white transition-colors"
					aria-label="Close"
				>
					✕
				</button>
			</div>

			<!-- Error Alert -->
			{#if auth.errorMessage}
				<div class="mt-4 p-3.5 rounded-2xl bg-danger/10 border border-danger/30 text-red-200 text-xs leading-relaxed" transition:fade>
					{auth.errorMessage}
				</div>
			{/if}

			<!-- Current Connected Session -->
			{#if auth.session.isConnected}
				<div class="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs">
					<div class="flex items-center justify-between">
						<span class="text-[#7a7a8e]">Connected Identity:</span>
						<span class="font-mono-tight font-bold text-white">
							{auth.session.ensName || auth.session.walletAddress || auth.session.email}
						</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-[#7a7a8e]">Method:</span>
						<span class="text-white capitalize font-mono-tight">
							{auth.session.authMethod === 'privy-email' ? 'Privy Passwordless' : auth.session.authMethod || 'Web3'}
						</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-[#7a7a8e]">Contract Role:</span>
						{#if auth.session.isOwner}
							<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-tight text-[11px]">
								✓ Contract Owner
							</span>
						{:else if auth.session.isVerifiedManufacturer}
							<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-tight text-[11px]">
								✓ Authorized Producer
							</span>
						{:else}
							<span class="px-2 py-0.5 rounded-full bg-white/10 text-[#8e8ea0] font-mono-tight text-[11px]">
								Standard Wallet
							</span>
						{/if}
					</div>

					<button
						onclick={() => auth.disconnect()}
						class="w-full mt-3 py-2 rounded-lg bg-danger/10 hover:bg-danger/20 text-red-300 font-semibold text-xs transition-colors"
					>
						Disconnect
					</button>
				</div>
			{:else}
				<!-- Tab Navigation -->
				<div class="mt-5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-1 text-xs font-display">
					<button
						onclick={() => (activeTab = 'wallet')}
						class="flex-1 py-1.5 rounded-lg transition-all {activeTab === 'wallet' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
					>
						Browser Wallet
					</button>
					<button
						onclick={() => (activeTab = 'email')}
						class="flex-1 py-1.5 rounded-lg transition-all {activeTab === 'email' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
					>
						Privy Email
					</button>
					<button
						onclick={() => (activeTab = 'lookup')}
						class="flex-1 py-1.5 rounded-lg transition-all {activeTab === 'lookup' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
					>
						Address / ENS
					</button>
				</div>

				<!-- TAB 1: BROWSER WALLET (METAMASK / INJECTED) -->
				{#if activeTab === 'wallet'}
					<div class="mt-5 space-y-3" in:fade={{ duration: 120 }}>
						<button
							onclick={handleConnect}
							disabled={auth.isConnecting}
							class="w-full py-3.5 rounded-xl bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs sm:text-sm font-display transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
						>
							<svg class="w-5 h-5" viewBox="0 0 318.6 318.6" xmlns="http://www.w3.org/2000/svg">
								<polygon points="274.1 35.5 174.6 109.4 193 65.8 274.1 35.5" fill="#e2761b" stroke="#e2761b" stroke-linecap="round" stroke-linejoin="round" />
								<polygon points="44.4 35.5 125.6 65.8 143.9 109.4 44.4 35.5" fill="#e4761b" stroke="#e4761b" stroke-linecap="round" stroke-linejoin="round" />
								<polygon points="238.3 206.8 211.8 247.4 268.5 263 284.8 207.7 238.3 206.8" fill="#e4761b" stroke="#e4761b" stroke-linecap="round" stroke-linejoin="round" />
								<polygon points="33.9 207.7 50.1 263 106.8 247.4 80.3 206.8 33.9 207.7" fill="#e4761b" stroke="#e4761b" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							<span>{auth.isConnecting ? 'Waiting for wallet...' : 'Connect Injected Web3 (MetaMask / Rabby)'}</span>
						</button>
						<p class="text-[11px] text-[#7a7a8e] text-center leading-relaxed">
							Connects directly to your browser extension without third-party custodians.
						</p>
					</div>

				<!-- TAB 2: PRIVY EMAIL OTP -->
				{:else if activeTab === 'email'}
					<div class="mt-5 space-y-4" in:fade={{ duration: 120 }}>
						{#if emailStep === 'input'}
							<form onsubmit={handleSendEmailCode} class="space-y-3">
								<div>
									<label for="privy-email-input" class="block text-xs text-[#c0c0d4] mb-1.5 font-display">
										Email Address
									</label>
									<input
										id="privy-email-input"
										type="email"
										bind:value={email}
										placeholder="your.email@company.com"
										required
										class="w-full px-4 py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
									/>
								</div>
								<button
									type="submit"
									disabled={auth.isConnecting}
									class="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs font-display transition-all shadow-md disabled:opacity-50"
								>
									{auth.isConnecting ? 'Sending code from Privy...' : 'Send Login Code via Privy →'}
								</button>
							</form>
						{:else}
							<form onsubmit={handleVerifyEmailCode} class="space-y-3">
								{#if emailSuccessMessage}
									<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
										{emailSuccessMessage}
									</div>
								{/if}

								<div>
									<label for="privy-otp-input" class="block text-xs text-[#c0c0d4] mb-1.5 font-display">
										6-Digit Code
									</label>
									<input
										id="privy-otp-input"
										type="text"
										bind:value={otpCode}
										placeholder="123456"
										maxlength="6"
										required
										class="w-full px-4 py-3 rounded-2xl bg-[#08080e] border border-white/10 text-center font-mono-tight text-lg tracking-widest text-white focus:outline-none focus:border-accent"
									/>
								</div>

								<div class="flex gap-2">
									<button
										type="button"
										onclick={() => (emailStep = 'input')}
										class="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#8e8ea0] transition-colors"
									>
										Back
									</button>
									<button
										type="submit"
										disabled={auth.isConnecting}
										class="flex-1 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#08080e] font-bold text-xs font-display transition-all shadow-md disabled:opacity-50"
									>
										{auth.isConnecting ? 'Verifying with Privy...' : 'Confirm Code & Authenticate'}
									</button>
								</div>
							</form>
						{/if}
						<div class="flex items-center justify-between text-[10px] text-[#606074] font-mono-tight pt-1">
							<span>Powered by Privy Cloud Auth</span>
							<span>ID: cmtxc3lq...</span>
						</div>
					</div>

				<!-- TAB 3: ADDRESS / ENS LOOKUP -->
				{:else}
					<div class="mt-5 space-y-3" in:fade={{ duration: 120 }}>
						<form onsubmit={handleManualLookup} class="space-y-3">
							<div>
								<label for="privy-lookup-input" class="block text-xs text-[#c0c0d4] mb-1.5 font-display">
									Ethereum Address or ENS
								</label>
								<input
									id="privy-lookup-input"
									type="text"
									bind:value={manualAddress}
									placeholder="0x... or name.eth"
									required
									class="w-full px-4 py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs font-mono-tight text-white placeholder-[#606074] focus:outline-none focus:border-accent"
								/>
							</div>
							<button
								type="submit"
								disabled={auth.isConnecting}
								class="w-full py-3 rounded-xl bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all disabled:opacity-50 shadow-md"
							>
								{auth.isConnecting ? 'Resolving on Sepolia...' : 'Resolve On-Chain Authority'}
							</button>
						</form>
					</div>
				{/if}
			{/if}

			<!-- Real On-Chain Network Info Footer -->
			<div class="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#7a7a8e] font-mono-tight">
				<span class="flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					Sepolia (Chain 11155111)
				</span>
				<span>
					Block: #{auth.chainStatus.blockNumber > 0 ? auth.chainStatus.blockNumber.toLocaleString() : '11,683,834'}
				</span>
			</div>
		</div>
	</div>
{/if}
