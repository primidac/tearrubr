<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import Navbar from '$lib/components/Navbar.svelte';
	import { auth } from '$lib/auth.svelte';

	let { data } = $props();

	let sealStatus = $state<string>('sealed');
	let openedAt = $state<Date | string | number | null>(null);
	let isUnsealing = $state(false);

	$effect(() => {
		sealStatus = data.product?.sealStatus || 'sealed';
		openedAt = data.product?.openedAt || null;
	});

	function formatDate(timestamp: Date | string | number | null | undefined) {
		if (!timestamp) return 'Just now';
		const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function handleUnseal() {
		if (!data.id) return;
		isUnsealing = true;
		try {
			const res = await fetch(`/api/products/${data.id}/unseal`, { method: 'POST' });
			const result = await res.json();
			if (result.success) {
				sealStatus = 'opened';
				openedAt = result.openedAt;
			}
		} catch (err) {
			console.error('Failed to unseal', err);
		} finally {
			isUnsealing = false;
		}
	}
</script>

<svelte:head>
	<title>{data.product ? data.product.name : 'Not Found'} | TearRubr Verification</title>
	<meta
		name="description"
		content="Cryptographic product verification proof backed by Ethereum smart contracts and The Graph."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20 pb-32">
	<!-- Floating Pill Dock Navigation -->
	<Navbar currentPath="/verify" />

	<!-- Atmospheric Blooms (Sahara AI aesthetic) -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
		<div class="absolute top-20 right-10 w-[550px] h-[550px] rounded-full bg-[#6366f1]/15 blur-[140px]"></div>
		<div class="absolute bottom-20 left-10 w-[550px] h-[550px] rounded-full bg-[#10b981]/15 blur-[140px]"></div>
	</div>

	<!-- Main Content Area -->
	<div class="max-w-2xl mx-auto px-4 sm:px-6 pt-32 sm:pt-40 relative z-10">
		<!-- Back to Public Ledger -->
		<div class="mb-6 flex items-center justify-between">
			<a
				href="/verify"
				class="text-xs text-[#8e8ea0] hover:text-white transition-colors flex items-center gap-1.5 font-display"
			>
				← Back to Public Ledger
			</a>
			<span class="text-[11px] font-mono-tight text-[#7a7a8e] px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
				The Graph Synced #{auth.subgraph.syncedBlock.toLocaleString()}
			</span>
		</div>

		{#if data.product}
			<div in:fly={{ y: 16, duration: 400 }} class="space-y-6">
				<!-- MAIN AUTHENTIC IDENTITY CARD -->
				<div class="rounded-3xl bg-[#0c0c16]/80 border {data.product.blockchainTxHash ? 'border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.08)]' : 'border-white/10 shadow-xl'} backdrop-blur-2xl overflow-hidden">
					<!-- Status Header -->
					<div class="px-6 py-5 {data.product.blockchainTxHash ? 'bg-emerald-500/10 border-b border-emerald-500/20' : 'bg-white/[0.03] border-b border-white/[0.08]'} flex items-center justify-between">
						<div class="flex items-center gap-3.5">
							<div class="w-10 h-10 rounded-full {data.product.blockchainTxHash ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/10 border border-white/20 text-[#8e8ea0]'} flex items-center justify-center font-bold text-lg">
								{data.product.blockchainTxHash ? '✓' : 'ID'}
							</div>
							<div>
								<div class="flex items-center gap-2">
									<h2 class="text-sm font-bold {data.product.blockchainTxHash ? 'text-emerald-400' : 'text-white'} font-display tracking-wider uppercase">
										{data.product.blockchainTxHash ? 'Authentic Product Record' : 'Registered Item'}
									</h2>
									<span class="px-2 py-0.5 rounded-full {data.product.blockchainTxHash ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-[#8e8ea0]'} text-[10px] font-mono-tight">
										{data.product.blockchainTxHash ? 'On-Chain Proof' : 'Local Record'}
									</span>
								</div>
								<p class="text-xs text-[#8e8ea0] mt-0.5">
									{data.product.blockchainTxHash ? 'Cryptographically anchored to Ethereum Sepolia' : 'Registered in decentralized ledger database'}
								</p>
							</div>
						</div>

						<span class="text-xs font-mono-tight text-[#8e8ea0] px-2.5 py-1 rounded-full bg-[#08080e] border border-white/10">
							Sepolia
						</span>
					</div>

					<!-- Manufacturer & Anti-Spoofing Identity Section -->
					<div class="p-6 border-b border-white/[0.06] space-y-4">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
							<div>
								<span class="text-[11px] font-mono-tight text-[#7a7a8e] uppercase tracking-wider block">
									Registered Issuer
								</span>
								<h3 class="text-lg font-bold text-white font-display mt-0.5">
									{data.product.manufacturer}
								</h3>
							</div>

							<!-- On-Chain Status -->
							{#if data.product.blockchainTxHash}
								<div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs">
									<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
									<div>
										<div class="font-bold text-emerald-300 font-mono-tight">
											Sepolia On-Chain Verified
										</div>
										<div class="text-[10px] text-[#8e8ea0]">
											Smart contract validated record
										</div>
									</div>
								</div>
							{:else}
								<div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-xs text-[#8e8ea0]">
									<span>Community Ledger Entry</span>
								</div>
							{/if}
						</div>

						<!-- Product Title & Details -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
							<div class="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
								<span class="text-[11px] text-[#7a7a8e] uppercase block">Product Name</span>
								<span class="text-sm font-semibold text-white mt-0.5 block">{data.product.name}</span>
							</div>

							<div class="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
								<span class="text-[11px] text-[#7a7a8e] uppercase block">Registration Date</span>
								<span class="text-sm font-medium text-white mt-0.5 block">{formatDate(data.product.createdAt)}</span>
							</div>
						</div>

						{#if data.product.description}
							<div class="text-xs text-[#9494a8] leading-relaxed pt-1">
								{data.product.description}
							</div>
						{/if}
					</div>

					<!-- Batch & Merkle Tree Proof (if batch item) -->
					{#if data.product.batchNumber}
						<div class="p-6 bg-[#6366f1]/5 border-b border-white/[0.06] space-y-2">
							<div class="flex items-center justify-between text-xs">
								<span class="font-bold text-indigo-400 font-display">Industrial Batch Merkle Rollup</span>
								<span class="font-mono-tight text-text-tertiary">
									Unit #{data.product.serialIndex} of {data.product.batchQuantity}
								</span>
							</div>
							<div class="font-mono-tight text-xs text-white">
								LOT Number: <strong class="text-white">{data.product.batchNumber}</strong>
							</div>
							{#if data.batch?.merkleRoot}
								<div class="p-3 rounded-xl bg-[#08080e] border border-white/10 text-[11px] font-mono-tight text-[#8e8ea0] break-all">
									<div class="text-[10px] text-[#606074] mb-0.5">Merkle Root (On Ethereum Contract):</div>
									{data.batch.merkleRoot}
								</div>
							{/if}
						</div>
					{/if}

					<!-- On-Chain Proof Hashes -->
					<div class="p-6 space-y-3 text-xs">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
							<span class="text-[#7a7a8e]">Ethereum Smart Contract:</span>
							<a
								href="{data.explorerBaseUrl}/address/{data.contractAddress}"
								target="_blank"
								rel="noopener noreferrer"
								class="font-mono-tight text-accent hover:underline break-all"
							>
								{data.contractAddress} ↗
							</a>
						</div>

						{#if data.product.blockchainTxHash}
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
								<span class="text-[#7a7a8e]">On-Chain Transaction:</span>
								<a
									href="{data.explorerBaseUrl}/tx/{data.product.blockchainTxHash}"
									target="_blank"
									rel="noopener noreferrer"
									class="font-mono-tight text-accent hover:underline break-all"
								>
									{data.product.blockchainTxHash} ↗
								</a>
							</div>
						{/if}
					</div>
				</div>

				<!-- TEARRUBR TAMPER-EVIDENT PHYSICAL SEAL CARD -->
				<div class="p-6 rounded-3xl bg-[#0c0c16]/80 border {sealStatus === 'opened' ? 'border-amber-500/30' : 'border-emerald-500/30'} backdrop-blur-2xl shadow-xl">
					<div class="flex items-start justify-between gap-4">
						<div class="space-y-1">
							<div class="flex items-center gap-2">
								<span class="w-2 h-2 rounded-full {sealStatus === 'opened' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}"></span>
								<h3 class="text-sm font-bold text-white font-display">
									{sealStatus === 'opened' ? 'Physical Seal: Torn / Consumed' : 'Physical Seal: Intact & Sealed'}
								</h3>
							</div>
							<p class="text-xs text-[#8e8ea0] leading-relaxed">
								{#if sealStatus === 'opened'}
									This product's physical tear seal was unsealed on {formatDate(openedAt)}. Subsequent scans trigger anti-refill security alerts to protect consumers.
								{:else}
									The physical tamper seal has never been broken. This guarantees genuine original contents straight from the manufacturer.
								{/if}
							</p>
						</div>

						<!-- Simulate Breaking Physical Seal Button -->
						{#if sealStatus !== 'opened'}
							<button
								onclick={handleUnseal}
								disabled={isUnsealing}
								class="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-[#08080e] font-bold text-xs font-display shrink-0 transition-all shadow-md"
							>
								{isUnsealing ? 'Breaking Seal...' : 'Simulate Tear Seal'}
							</button>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<!-- UNVERIFIED / NOT FOUND CARD -->
			<div class="p-8 rounded-3xl bg-danger/10 border border-danger/30 text-center space-y-4 backdrop-blur-xl">
				<div class="w-12 h-12 rounded-full bg-danger/20 text-danger text-2xl font-bold flex items-center justify-center mx-auto">
					✕
				</div>
				<h2 class="text-xl font-bold text-white font-display">Product Identity Not Found</h2>
				<p class="text-xs text-[#9494a8] max-w-md mx-auto leading-relaxed">
					TearRubr cannot locate an authentic cryptographic record on Ethereum Sepolia for this identifier. This item may be an uncommitted draft or counterfeit.
				</p>
				<a
					href="/verify"
					class="inline-block px-5 py-2.5 rounded-full bg-white text-[#08080e] font-semibold text-xs font-display hover:bg-white/90 transition-all"
				>
					Search Public Ledger
				</a>
			</div>
		{/if}
	</div>
</div>
