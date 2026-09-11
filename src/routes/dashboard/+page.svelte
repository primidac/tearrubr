<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { auth } from '$lib/auth.svelte';

	let { data } = $props();

	function formatDate(timestamp: Date | number) {
		const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp) * 1000);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function truncateId(id: string, lead = 8, trail = 6) {
		if (!id) return '';
		return id.length > lead + trail ? `${id.slice(0, lead)}…${id.slice(-trail)}` : id;
	}

	let totalUnits = $derived(data.products.length);
	let batchRuns = $derived(data.batches?.length || 0);
	let intactSeals = $derived(
		data.products.filter((p) => p.sealStatus !== 'opened').length
	);
	let intactRate = $derived(
		totalUnits > 0 ? Math.round((intactSeals / totalUnits) * 100) : 100
	);
</script>

<svelte:head>
	<title>Dashboard | TearRubr</title>
	<meta
		name="description"
		content="Manage on-chain product batches, monitor physical seal states, and audit supply chain integrity."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20 pb-32">
	<!-- Floating Pill Dock Navigation -->
	<Navbar currentPath="/dashboard" />

	<!-- Atmospheric Blooms (Sahara AI aesthetic) -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
		<div class="absolute top-10 right-10 w-[550px] h-[550px] rounded-full bg-[#6366f1]/15 blur-[140px]"></div>
		<div class="absolute bottom-20 left-10 w-[550px] h-[550px] rounded-full bg-[#10b981]/15 blur-[140px]"></div>
	</div>

	<!-- Main Dashboard Container -->
	<main class="max-w-6xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 relative z-10">
		<!-- Header & Quick Action Buttons -->
		<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
			<div>
				<div class="flex items-center gap-2 mb-1.5">
					<span class="text-xs font-mono-tight uppercase tracking-wider text-accent font-semibold">
						Manufacturer Workspace
					</span>
					<span class="text-white/20">/</span>
					<span class="text-xs font-mono-tight text-emerald-400">Sepolia Active</span>
				</div>
				<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
					Dashboard
				</h1>
			</div>

			<div class="flex flex-wrap items-center gap-2.5">
				<a
					href="/register"
					class="px-5 py-2.5 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
				>
					+ New Batch Rollup
				</a>
				<a
					href="/verify"
					class="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-medium text-xs font-display transition-all"
				>
					Public Ledger
				</a>
			</div>
		</div>

		<!-- Connected Manufacturer Profile Card (Real Web3 & Sepolia On-Chain Identity) -->
		<div class="mt-8 p-5 sm:p-6 rounded-3xl bg-[#0c0c16]/80 border border-white/[0.08] backdrop-blur-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
			{#if auth.session.isConnected}
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-2xl {auth.session.isOwner || auth.session.isVerifiedManufacturer ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'} border flex items-center justify-center font-bold text-base font-display shrink-0">
						{auth.session.isOwner || auth.session.isVerifiedManufacturer ? '✓' : 'ID'}
					</div>
					<div>
						<div class="flex flex-wrap items-center gap-2.5">
							<h2 class="text-base font-bold text-white font-display">
								{auth.session.ensName || truncateId(auth.session.walletAddress || '', 8, 6)}
							</h2>
							{#if auth.session.isOwner}
								<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono-tight border border-emerald-500/30">
									✓ Contract Owner (Sepolia)
								</span>
							{:else if auth.session.isVerifiedManufacturer}
								<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono-tight border border-emerald-500/30">
									✓ Whitelisted Manufacturer
								</span>
							{:else}
								<span class="px-2 py-0.5 rounded-full bg-white/10 text-[#8e8ea0] text-[11px] font-mono-tight">
									Community Wallet
								</span>
							{/if}
						</div>
						<div class="flex flex-wrap items-center gap-3 text-xs text-[#8e8ea0] mt-1 font-mono-tight">
							<span>ENS: <strong class="text-white">{auth.session.ensName || 'No reverse ENS'}</strong></span>
							<span class="text-white/20">·</span>
							<span>Address: {truncateId(auth.session.walletAddress || '', 10, 8)}</span>
							<span class="text-white/20">·</span>
							<span class="text-emerald-400">Sepolia Active</span>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-3 self-start md:self-auto">
					<button
						onclick={() => auth.openModal()}
						class="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-display text-white transition-all"
					>
						Switch Wallet ↗
					</button>
				</div>
			{:else}
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-base font-display text-[#8e8ea0] shrink-0">
						⚿
					</div>
					<div>
						<h2 class="text-base font-bold text-white font-display">
							Wallet Disconnected
						</h2>
						<p class="text-xs text-[#8e8ea0] mt-0.5">
							Connect your Web3 wallet (MetaMask, Rabby, Rainbow) to verify on-chain manufacturer credentials and mint batches.
						</p>
					</div>
				</div>

				<div class="flex items-center gap-3 self-start md:self-auto">
					<button
						onclick={() => auth.openModal()}
						class="px-5 py-2 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all shadow-md"
					>
						Connect Wallet
					</button>
				</div>
			{/if}
		</div>

		<!-- 3 Clean Metric Cards (Neat, uncluttered) -->
		<div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
			<!-- Total Units -->
			<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
				<div class="text-xs font-mono-tight uppercase tracking-wider text-[#8e8ea0] font-semibold mb-2">
					Units Minted On-Chain
				</div>
				<div class="text-3xl sm:text-4xl font-extrabold text-white font-display">
					{totalUnits}
				</div>
				<div class="text-[11px] text-emerald-400 mt-2 flex items-center gap-1.5">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
					Active on Ethereum Sepolia
				</div>
			</div>

			<!-- Batch Merkle Runs -->
			<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
				<div class="text-xs font-mono-tight uppercase tracking-wider text-[#8e8ea0] font-semibold mb-2">
					Batch Merkle Runs
				</div>
				<div class="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-display">
					{batchRuns}
				</div>
				<div class="text-[11px] text-[#8e8ea0] mt-2">
					1 On-Chain Tx per Batch Rollup
				</div>
			</div>

			<!-- Seal Integrity -->
			<div class="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
				<div class="text-xs font-mono-tight uppercase tracking-wider text-[#8e8ea0] font-semibold mb-2">
					Seal Integrity Rate
				</div>
				<div class="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-display">
					{intactRate}%
				</div>
				<div class="text-[11px] text-[#8e8ea0] mt-2">
					{intactSeals} of {totalUnits} Seals Intact
				</div>
			</div>
		</div>

		<!-- Recent Issued Items Table -->
		<div class="mt-8 rounded-3xl bg-[#0c0c16]/80 border border-white/[0.08] backdrop-blur-2xl shadow-xl overflow-hidden">
			<div class="p-6 border-b border-white/[0.06] flex items-center justify-between">
				<div>
					<h3 class="text-base font-bold text-white font-display">Recent Authenticity Records</h3>
					<p class="text-xs text-[#8e8ea0] mt-0.5">Live records synchronized with Sepolia smart contract</p>
				</div>
				<a href="/verify" class="text-xs text-accent hover:underline font-display">
					View All in Public Ledger →
				</a>
			</div>

			{#if data.products.length === 0}
				<div class="p-12 text-center text-xs text-[#8e8ea0]">
					No products registered yet. Click <a href="/register" class="text-accent underline font-semibold">New Batch Rollup</a> to begin.
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-xs text-left">
						<thead class="border-b border-white/[0.06] text-[#7a7a8e] uppercase font-mono-tight text-[10px]">
							<tr>
								<th class="px-6 py-3.5">Product & Manufacturer</th>
								<th class="px-6 py-3.5">Batch / Type</th>
								<th class="px-6 py-3.5">Unique ID</th>
								<th class="px-6 py-3.5">Tamper Seal</th>
								<th class="px-6 py-3.5">Sepolia Tx</th>
								<th class="px-6 py-3.5 text-right">Action</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/[0.04]">
							{#each data.products.slice(0, 10) as product}
								<tr class="hover:bg-white/[0.02] transition-colors">
									<td class="px-6 py-4 font-medium text-white">
										<div class="font-bold text-sm text-white font-display">{product.name}</div>
										<div class="text-[11px] text-[#8e8ea0]">{product.manufacturer}</div>
									</td>
									<td class="px-6 py-4 font-mono-tight">
										{#if product.batchNumber}
											<span class="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-[11px]">
												LOT: {product.batchNumber} (#{product.serialIndex})
											</span>
										{:else}
											<span class="text-[#7a7a8e]">Single Item</span>
										{/if}
									</td>
									<td class="px-6 py-4 font-mono-tight text-[#8e8ea0]">
										{truncateId(product.id, 8, 6)}
									</td>
									<td class="px-6 py-4">
										<span class="px-2 py-0.5 rounded-full text-[10px] font-mono-tight {product.sealStatus === 'opened' ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}">
											{product.sealStatus === 'opened' ? 'Broken' : 'Intact'}
										</span>
									</td>
									<td class="px-6 py-4 font-mono-tight">
										{#if product.blockchainTxHash}
											<a
												href="{data.explorerBaseUrl}/tx/{product.blockchainTxHash}"
												target="_blank"
												rel="noopener noreferrer"
												class="text-accent hover:underline flex items-center gap-1"
											>
												<span>{truncateId(product.blockchainTxHash, 6, 4)}</span>
												<span>↗</span>
											</a>
										{:else}
											<span class="text-[#606074]">—</span>
										{/if}
									</td>
									<td class="px-6 py-4 text-right">
										<a
											href="/verify/{product.id}"
											class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-display text-xs transition-all"
										>
											Verify →
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</main>
</div>
