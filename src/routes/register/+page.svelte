<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import { auth } from '$lib/auth.svelte';
	import {
		Boxes,
		ShieldCheck,
		Check,
		ExternalLink,
		Download,
		ArrowRight,
		Package
	} from '@lucide/svelte';

	let activeTab = $state<'batch' | 'single'>('batch');

	// Single item state
	let manufacturer = $state('');
	let name = $state('');
	let description = $state('');

	// Batch state
	let batchManufacturer = $state('');
	let batchProductName = $state('');
	let batchNumber = $state('');
	let batchDescription = $state('');
	let batchQuantity = $state(20);

	// Update default manufacturer when auth session changes
	$effect(() => {
		if (auth.session.isConnected) {
			const identifier = auth.session.ensName || auth.session.walletAddress || '';
			if (!batchManufacturer) batchManufacturer = identifier;
			if (!manufacturer) manufacturer = identifier;
		}
	});

	let isSubmitting = $state(false);
	let error = $state<string | null>(null);

	// Batch submission result
	let batchResult = $state<{
		success: boolean;
		batchId: string;
		batchNumber: string;
		productName: string;
		manufacturer: string;
		quantity: number;
		merkleRoot: string;
		blockchainTxHash: string;
		csvManifest: string;
		downloadUrl: string;
	} | null>(null);

	// Real on-chain manufacturer authority check
	let currentBrandCheck = $derived(
		auth.checkBrandAuthority(activeTab === 'batch' ? batchManufacturer : manufacturer)
	);

	function truncate(str: string | null | undefined, lead = 8, trail = 6) {
		if (!str) return '';
		return str.length > lead + trail ? `${str.slice(0, lead)}…${str.slice(-trail)}` : str;
	}

	async function handleBatchSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;
		batchResult = null;

		try {
			const res = await fetch('/api/batches', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					batchNumber: batchNumber.trim(),
					productName: batchProductName.trim(),
					manufacturer: batchManufacturer.trim(),
					description: batchDescription.trim(),
					quantity: Number(batchQuantity)
				})
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to commit batch');

			batchResult = data;
		} catch (err: any) {
			error = err.message || 'Failed to submit batch to Sepolia';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleSingleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			const res = await fetch('/api/products', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					manufacturer: manufacturer.trim(),
					name: name.trim(),
					description: description.trim()
				})
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || 'Failed to register product');

			goto(`/verify/${data.product.id}`);
		} catch (err: any) {
			error = err.message || 'Failed to register product';
		} finally {
			isSubmitting = false;
		}
	}

	function downloadManifest() {
		if (!batchResult?.csvManifest) return;
		const blob = new Blob([batchResult.csvManifest], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `tearrubr-batch-${batchResult.batchNumber}-manifest.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Manufacturer Portal | TearRubr</title>
	<meta
		name="description"
		content="Register single products or high-volume industrial batches on Ethereum Sepolia with cryptographic Merkle proof rollups."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20 pb-24 sm:pb-32">
	<!-- Floating Pill Dock Navigation -->
	<Navbar currentPath="/register" />

	<!-- Atmospheric Blooms -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
		<div class="absolute top-10 right-10 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-[#6366f1]/12 blur-[120px] sm:blur-[140px]"></div>
		<div class="absolute bottom-20 left-10 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-[#10b981]/12 blur-[120px] sm:blur-[140px]"></div>
	</div>

	<!-- Main Container -->
	<main class="max-w-4xl mx-auto px-3.5 sm:px-6 pt-24 sm:pt-36 relative z-10">
		<!-- Header -->
		<div class="text-center mb-8 sm:mb-10">
			<span class="text-xs font-mono-tight text-accent font-semibold tracking-wider uppercase">
				Manufacturer Portal · Sepolia
			</span>
			<h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display mt-2">
				Register on the Public Ledger
			</h1>
			<p class="text-xs sm:text-sm text-[#9494a8] mt-2 max-w-lg mx-auto leading-relaxed">
				Issue tamper-evident cryptographic identities for single items or industrial batches of up to 10,000 units in a single transaction.
			</p>
		</div>

		<!-- Identity & Anti-Spoofing Banner -->
		<div class="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
			<div class="flex items-center gap-3 min-w-0">
				<div class="w-9 h-9 rounded-xl {currentBrandCheck.isAuthorized ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/10 text-[#8e8ea0] border border-white/10'} flex items-center justify-center font-bold text-sm shrink-0">
					{#if currentBrandCheck.isAuthorized}
						<ShieldCheck size={18} />
					{:else}
						<Package size={18} />
					{/if}
				</div>
				<div class="min-w-0">
					<div class="flex items-center gap-2 flex-wrap">
						<span class="text-xs font-bold text-white font-mono-tight truncate">
							{truncate(auth.session.ensName || auth.session.walletAddress || 'Wallet Disconnected', 10, 6)}
						</span>
						<span class="px-2 py-0.5 rounded-full {currentBrandCheck.isAuthorized ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-[#8e8ea0]'} text-[10px] font-mono-tight whitespace-nowrap shrink-0">
							{currentBrandCheck.badge}
						</span>
					</div>
					<div class="text-[11px] text-[#7a7a8e] mt-0.5 truncate">
						{currentBrandCheck.message}
					</div>
				</div>
			</div>

			<button
				onclick={() => auth.openModal()}
				class="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white transition-colors font-display self-start sm:self-auto shrink-0 whitespace-nowrap"
			>
				{auth.session.isConnected ? 'Manage Wallet ↗' : 'Connect Wallet'}
			</button>
		</div>

		<!-- Tab Switcher (Mobile Optimized Grid) -->
		<div class="flex justify-center mb-6 sm:mb-8 w-full">
			<div class="p-1 rounded-2xl sm:rounded-full bg-[#0c0c16] border border-white/[0.08] grid grid-cols-2 sm:flex items-center gap-1 text-xs w-full max-w-md sm:w-auto">
				<button
					onclick={() => {
						activeTab = 'batch';
						error = null;
					}}
					class="px-3 sm:px-5 py-2 rounded-xl sm:rounded-full font-medium transition-all font-display text-center whitespace-nowrap {activeTab === 'batch' ? 'bg-white text-[#08080e] shadow-md font-bold' : 'text-[#8e8ea0] hover:text-white'}"
				>
					<span class="hidden sm:inline">Industrial Batch Rollup (Recommended)</span>
					<span class="sm:hidden">Batch Rollup</span>
				</button>
				<button
					onclick={() => {
						activeTab = 'single';
						error = null;
					}}
					class="px-3 sm:px-5 py-2 rounded-xl sm:rounded-full font-medium transition-all font-display text-center whitespace-nowrap {activeTab === 'single' ? 'bg-white text-[#08080e] shadow-md font-bold' : 'text-[#8e8ea0] hover:text-white'}"
				>
					<span class="hidden sm:inline">Single Item Registration</span>
					<span class="sm:hidden">Single Item</span>
				</button>
			</div>
		</div>

		<!-- Form Card -->
		<div class="rounded-3xl bg-[#0c0c16]/80 border border-white/[0.08] p-4 sm:p-8 backdrop-blur-2xl shadow-2xl">
			{#if error}
				<div class="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/30 text-red-200 text-xs">
					{error}
				</div>
			{/if}

			{#if activeTab === 'batch'}
				<!-- Batch Rollup Form -->
				<form onsubmit={handleBatchSubmit} class="space-y-5 sm:space-y-6">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
						<div>
							<label for="batch-mfg" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
								Brand / Manufacturer Identity
							</label>
							<input
								id="batch-mfg"
								type="text"
								bind:value={batchManufacturer}
								required
								class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
								placeholder="e.g. Apex Dynamics Ltd"
							/>
						</div>

						<div>
							<label for="batch-lot" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
								LOT / Batch Identification Number
							</label>
							<input
								id="batch-lot"
								type="text"
								bind:value={batchNumber}
								required
								class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all font-mono-tight"
								placeholder="e.g. LOT-2026-IND-09"
							/>
						</div>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
						<div>
							<label for="batch-product-name" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
								Product Common Model Name
							</label>
							<input
								id="batch-product-name"
								type="text"
								bind:value={batchProductName}
								required
								class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
								placeholder="e.g. Precision Ball Bearing 608-RS"
							/>
						</div>

						<div>
							<label for="batch-qty" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
								Rollup Quantity (Units to Mint in Tree)
							</label>
							<input
								id="batch-qty"
								type="number"
								min="1"
								max="10000"
								bind:value={batchQuantity}
								required
								class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all font-mono-tight"
								placeholder="20"
							/>
							<div class="text-[11px] text-[#7a7a8e] mt-1">
								Each unit receives a unique on-chain cryptographic leaf index
							</div>
						</div>
					</div>

					<div>
						<label for="batch-desc" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
							Specification & Provenance Description
						</label>
						<textarea
							id="batch-desc"
							bind:value={batchDescription}
							rows="3"
							class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
							placeholder="Material grade, manufacturing facility ID, packaging date..."
						></textarea>
					</div>

					<!-- Merkle Tree Architecture Note -->
					<div class="p-3.5 sm:p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
						<div class="font-bold flex items-center gap-1.5 font-display">
							<Boxes size={14} class="shrink-0" />
							<span>Zero-Bloat Merkle Rollup Technology</span>
						</div>
						<p class="text-[11px] text-[#a0a0c0] leading-relaxed">
							All {batchQuantity} individual product hashes are aggregated into a single 32-byte cryptographic root committed to Ethereum Sepolia. Gas fees are paid once regardless of quantity.
						</p>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full py-3 sm:py-3.5 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs sm:text-sm font-display transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 whitespace-nowrap"
					>
						{isSubmitting ? 'Computing Merkle Tree & Broadcasting...' : 'Commit Batch to Ethereum Sepolia (1 Tx)'}
					</button>
				</form>
			{:else}
				<!-- Single Item Form -->
				<form onsubmit={handleSingleSubmit} class="space-y-5 sm:space-y-6">
					<div>
						<label for="single-mfg" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
							Manufacturer / Brand Name
						</label>
						<input
							id="single-mfg"
							type="text"
							bind:value={manufacturer}
							required
							class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
							placeholder="e.g. Apex Precision"
						/>
					</div>

					<div>
						<label for="single-name" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
							Product Name
						</label>
						<input
							id="single-name"
							type="text"
							bind:value={name}
							required
							class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
							placeholder="e.g. Titanium Watch Edition"
						/>
					</div>

					<div>
						<label for="single-desc" class="block text-xs font-medium text-[#c0c0d4] mb-1.5 font-display">
							Product Description
						</label>
						<textarea
							id="single-desc"
							bind:value={description}
							rows="3"
							class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-[#08080e] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-accent transition-all"
							placeholder="Serial details, materials, origin..."
						></textarea>
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						class="w-full py-3 sm:py-3.5 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs sm:text-sm font-display transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 whitespace-nowrap"
					>
						{isSubmitting ? 'Signing Transaction on Ethereum...' : 'Register Single Product on Sepolia'}
					</button>
				</form>
			{/if}
		</div>

		<!-- Batch Registration Success Card -->
		{#if batchResult}
			<div class="mt-8 p-4 sm:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-2xl space-y-4" transition:fade>
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
						<Check size={18} />
					</div>
					<div>
						<h3 class="text-base font-bold text-white font-display">
							Batch Successfully Committed to Ethereum Sepolia!
						</h3>
						<p class="text-xs text-[#8e8ea0]">
							{batchResult.quantity} individual units rolled up under LOT {batchResult.batchNumber}
						</p>
					</div>
				</div>

				<div class="p-3.5 sm:p-4 rounded-2xl bg-[#08080e] border border-white/10 space-y-2 text-xs font-mono-tight">
					<div>
						<span class="text-[#7a7a8e] block sm:inline">Transaction Hash:</span>
						<a
							href="https://sepolia.etherscan.io/tx/{batchResult.blockchainTxHash}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-accent hover:underline sm:ml-2 break-all inline-flex items-center gap-1"
						>
							<span>{batchResult.blockchainTxHash}</span>
							<ExternalLink size={11} class="shrink-0" />
						</a>
					</div>
					<div>
						<span class="text-[#7a7a8e] block sm:inline">Merkle Root:</span>
						<span class="text-white sm:ml-2 break-all">{batchResult.merkleRoot}</span>
					</div>
				</div>

				<!-- Download Factory Print Manifest Button -->
				<div class="flex flex-col sm:flex-row gap-3 pt-2">
					<button
						onclick={downloadManifest}
						class="px-5 py-2.5 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#08080e] font-bold text-xs font-display transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
					>
						<Download size={14} class="shrink-0" />
						<span>Download Factory Print Manifest (CSV)</span>
					</button>
					<a
						href="/verify"
						class="px-5 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs font-display transition-all flex items-center justify-center gap-1 whitespace-nowrap"
					>
						<span>View on Public Ledger</span>
						<ArrowRight size={13} class="shrink-0" />
					</a>
				</div>
			</div>
		{/if}
	</main>
</div>
