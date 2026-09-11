<script lang="ts">
	import { auth, VERIFIED_MANUFACTURERS } from '$lib/auth.svelte';
	import { fade, scale } from 'svelte/transition';

	let ensInput = $state('');
	let emailInput = $state('');
	let activeTab = $state<'ens' | 'wallets' | 'email'>('ens');

	function handleConnectENS(ens: string) {
		auth.connectWithENS(ens);
	}

	function handleCustomENS() {
		if (!ensInput.trim()) return;
		auth.connectWithENS(ensInput);
		ensInput = '';
	}

	function handleEmail() {
		if (!emailInput.trim()) return;
		auth.connectWithEmail(emailInput);
		emailInput = '';
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
		<!-- Modal Content -->
		<div
			class="w-full max-w-md bg-[#0d0d16] border border-white/10 rounded-2xl p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden"
			transition:scale={{ start: 0.95, duration: 180 }}
		>
			<!-- Ambient glow inside modal -->
			<div class="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#6366f1]/20 blur-[80px] pointer-events-none"></div>
			<div class="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#10b981]/15 blur-[80px] pointer-events-none"></div>

			<!-- Header -->
			<div class="flex items-center justify-between pb-4 border-b border-white/[0.08] relative z-10">
				<div class="flex items-center gap-2.5">
					<div class="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
						P
					</div>
					<div>
						<div class="flex items-center gap-1.5">
							<h3 class="text-sm font-bold text-white font-display">Connect Identity</h3>
							<span class="text-[10px] font-mono-tight px-1.5 py-0.2 rounded bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30">
								Privy + ENS
							</span>
						</div>
						<p class="text-[11px] text-[#8e8ea0]">Verify brand ownership on Ethereum</p>
					</div>
				</div>

				<button
					onclick={() => auth.closeModal()}
					class="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
					aria-label="Close"
				>
					✕
				</button>
			</div>

			<!-- Current Session Info (if connected) -->
			{#if auth.session.isConnected}
				<div class="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full {auth.session.isVerifiedManufacturer ? 'bg-emerald-400' : 'bg-indigo-400'}"></span>
						<span class="font-semibold text-white">{auth.session.ensName || auth.session.walletAddress}</span>
						{#if auth.session.isVerifiedManufacturer}
							<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-medium border border-emerald-500/30">
								✓ Verified Brand
							</span>
						{/if}
					</div>
					<button
						onclick={() => auth.disconnect()}
						class="text-[11px] text-danger hover:underline"
					>
						Disconnect
					</button>
				</div>
			{/if}

			<!-- Auth Method Switcher Tabs -->
			<div class="mt-4 grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#08080e] border border-white/[0.06] text-xs">
				<button
					onclick={() => (activeTab = 'ens')}
					class="py-1.5 rounded-lg font-medium transition-all {activeTab === 'ens' ? 'bg-white/10 text-white shadow-sm' : 'text-[#8e8ea0] hover:text-white'}"
				>
					ENS Brand
				</button>
				<button
					onclick={() => (activeTab = 'wallets')}
					class="py-1.5 rounded-lg font-medium transition-all {activeTab === 'wallets' ? 'bg-white/10 text-white shadow-sm' : 'text-[#8e8ea0] hover:text-white'}"
				>
					Web3 Wallet
				</button>
				<button
					onclick={() => (activeTab = 'email')}
					class="py-1.5 rounded-lg font-medium transition-all {activeTab === 'email' ? 'bg-white/10 text-white shadow-sm' : 'text-[#8e8ea0] hover:text-white'}"
				>
					Email / Social
				</button>
			</div>

			<!-- Tab: ENS Brand Authentication (Enterprise Anti-Spoofing Showcase) -->
			{#if activeTab === 'ens'}
				<div class="mt-4 space-y-3">
					<p class="text-xs text-[#8e8ea0]">
						Select a verified manufacturer identity to test authentic on-chain issuance:
					</p>

					<div class="space-y-2">
						{#each Object.entries(VERIFIED_MANUFACTURERS) as [ens, profile]}
							<button
								onclick={() => handleConnectENS(ens)}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-emerald-500/40 flex items-center justify-between text-left transition-all group"
							>
								<div>
									<div class="flex items-center gap-2">
										<span class="text-xs font-bold text-white font-mono-tight">{ens}</span>
										<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
											✓ {profile.tier}
										</span>
									</div>
									<div class="text-[11px] text-[#7a7a8e] mt-0.5">{profile.brandName}</div>
								</div>
								<span class="text-xs text-[#8e8ea0] group-hover:text-white transition-colors">Select →</span>
							</button>
						{/each}
					</div>

					<div class="pt-2">
						<label for="custom-ens" class="text-[11px] text-[#7a7a8e] block mb-1.5">Or enter custom ENS name:</label>
						<div class="flex gap-2">
							<input
								id="custom-ens"
								type="text"
								bind:value={ensInput}
								placeholder="e.g. nike.eth"
								class="flex-1 px-3 py-2 rounded-lg bg-[#08080e] border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
							/>
							<button
								onclick={handleCustomENS}
								class="px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-muted transition-colors"
							>
								Resolve
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Tab: Web3 Wallets -->
			{#if activeTab === 'wallets'}
				<div class="mt-4 space-y-2">
					<p class="text-xs text-[#8e8ea0] mb-3">
						Connect using an Ethereum wallet to sign batches and product registrations:
					</p>

					{#each ['MetaMask', 'Coinbase Wallet', 'Rainbow', 'WalletConnect'] as wallet}
						<button
							onclick={() => auth.connectWithWallet(wallet)}
							class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-accent/40 flex items-center justify-between text-left transition-all"
						>
							<span class="text-xs font-semibold text-white">{wallet}</span>
							<span class="text-xs text-text-tertiary">Connect →</span>
						</button>
					{/each}
				</div>
			{/if}

			<!-- Tab: Email / Passkey -->
			{#if activeTab === 'email'}
				<div class="mt-4 space-y-3">
					<p class="text-xs text-[#8e8ea0]">
						Privy creates an embedded cryptographic key linked to your enterprise email:
					</p>

					<div>
						<input
							type="email"
							bind:value={emailInput}
							placeholder="admin@yourcompany.com"
							class="w-full px-3.5 py-2.5 rounded-xl bg-[#08080e] border border-white/10 text-xs text-white focus:outline-none focus:border-accent"
						/>
					</div>

					<button
						onclick={handleEmail}
						class="w-full py-2.5 rounded-xl bg-white text-[#08080e] font-semibold text-xs hover:bg-white/90 transition-all shadow-md"
					>
						Continue with Privy
					</button>

					<div class="pt-2 text-center">
						<span class="text-[11px] text-text-tertiary">Protected by Privy MPC & Account Abstraction</span>
					</div>
				</div>
			{/if}

			<!-- Footer Security Note -->
			<div class="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#7a7a8e]">
				<span class="flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					Sepolia Network
				</span>
				<span>Indexed by The Graph</span>
			</div>
		</div>
	</div>
{/if}
