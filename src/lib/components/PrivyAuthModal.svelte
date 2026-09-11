<script lang="ts">
	import { auth } from '$lib/auth.svelte';
	import { fade, scale } from 'svelte/transition';

	let manualAddress = $state('');

	function handleConnect() {
		auth.connectWallet();
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
						<h3 class="text-base font-bold text-white font-display">Connect Web3 Wallet</h3>
						<span class="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
							Sepolia
						</span>
					</div>
					<p class="text-xs text-[#8e8ea0] mt-0.5">Direct connection via Ethereum provider</p>
				</div>

				<button
					onclick={() => auth.closeModal()}
					class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8e8ea0] hover:text-white transition-colors"
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
						<span class="text-[#7a7a8e]">Connected Wallet:</span>
						<span class="font-mono-tight font-bold text-white">
							{auth.session.ensName || auth.session.walletAddress}
						</span>
					</div>

					<div class="flex items-center justify-between">
						<span class="text-[#7a7a8e]">Contract Status:</span>
						{#if auth.session.isVerifiedManufacturer}
							<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-tight text-[11px]">
								✓ {auth.session.isOwner ? 'Contract Owner / Deployer' : 'Authorized Manufacturer'}
							</span>
						{:else}
							<span class="px-2 py-0.5 rounded-full bg-white/10 text-[#8e8ea0] font-mono-tight text-[11px]">
								Standard Wallet
							</span>
						{/if}
					</div>

					<button
						onclick={() => auth.disconnect()}
						class="w-full mt-3 py-2 rounded-xl bg-danger/10 hover:bg-danger/20 text-red-300 font-semibold text-xs transition-colors"
					>
						Disconnect Wallet
					</button>
				</div>
			{:else}
				<!-- Connect Real Browser Wallet Button -->
				<div class="mt-6 space-y-4">
					<button
						onclick={handleConnect}
						disabled={auth.isConnecting}
						class="w-full py-3.5 rounded-2xl bg-white text-[#08080e] hover:bg-white/90 font-bold text-sm font-display transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-50"
					>
						<svg class="w-5 h-5" viewBox="0 0 318.6 318.6" xmlns="http://www.w3.org/2000/svg">
							<polygon points="274.1 35.5 174.6 109.4 193 65.8 274.1 35.5" fill="#e2761b" stroke="#e2761b" stroke-linecap="round" stroke-linejoin="round" />
							<polygon points="44.4 35.5 125.6 65.8 143.9 109.4 44.4 35.5" fill="#e4761b" stroke="#e4761b" stroke-linecap="round" stroke-linejoin="round" />
							<polygon points="238.3 206.8 211.8 247.4 268.5 263 284.8 207.7 238.3 206.8" fill="#e4761b" stroke="#e4761b" stroke-linecap="round" stroke-linejoin="round" />
							<polygon points="33.9 207.7 50.1 263 106.8 247.4 80.3 206.8 33.9 207.7" fill="#e4761b" stroke="#e4761b" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<span>{auth.isConnecting ? 'Waiting for approval...' : 'Connect Injected Wallet (MetaMask / Web3)'}</span>
					</button>

					<div class="relative py-2">
						<div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/[0.08]"></div></div>
						<div class="relative flex justify-center text-[11px]"><span class="bg-[#0d0d16] px-2 text-[#7a7a8e]">or enter address</span></div>
					</div>

					<!-- Manual Address Lookup Form -->
					<form onsubmit={handleManualLookup} class="space-y-2">
						<div class="flex gap-2">
							<input
								type="text"
								bind:value={manualAddress}
								placeholder="0x... Ethereum Address"
								class="flex-1 px-3.5 py-2.5 rounded-xl bg-[#08080e] border border-white/10 text-xs font-mono-tight text-white placeholder-[#606074] focus:outline-none focus:border-accent"
							/>
							<button
								type="submit"
								disabled={auth.isConnecting}
								class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
							>
								Lookup
							</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Real On-Chain Network Info Footer -->
			<div class="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#7a7a8e] font-mono-tight">
				<span class="flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					Sepolia (Chain 11155111)
				</span>
				<span>
					Block: #{auth.chainStatus.blockNumber > 0 ? auth.chainStatus.blockNumber.toLocaleString() : '11,683,583'}
				</span>
			</div>
		</div>
	</div>
{/if}
