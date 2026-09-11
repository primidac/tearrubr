<script lang="ts">
	import { fade } from 'svelte/transition';
	import Navbar from '$lib/components/Navbar.svelte';
	import {
		Search,
		Copy,
		Check,
		ArrowRight,
		ChevronLeft,
		ChevronRight,
		ShieldCheck,
		ShieldAlert,
		AlertTriangle,
		Lock
	} from '@lucide/svelte';

	let { data } = $props();

	// Local mutable list of products so client can reactively update when an item is unsealed
	let productsList = $state<typeof data.products>([]);
	$effect(() => {
		productsList = data.products || [];
	});
	let searchQuery = $state('');
	let isVerifying = $state(false);
	let hasAutoVerified = $state(false);
	let searchInputRef: HTMLInputElement | null = $state(null);

	interface VerificationResult {
		status: 'first_time_verified' | 'previously_opened' | 'not_found';
		openedAt: Date | string | number | null;
		product: any;
		queryId: string;
	}

	let verificationResult = $state<VerificationResult | null>(null);

	let filterType = $state<'all' | 'sealed' | 'opened' | 'batches'>('all');
	let copiedId = $state<string | null>(null);

	// Pagination state
	let currentPage = $state(1);
	let pageSize = $state(10);

	// Initial query check (e.g. from QR code scan landing on /verify?id=...)
	$effect(() => {
		if (data.initialQuery && !hasAutoVerified) {
			hasAutoVerified = true;
			searchQuery = data.initialQuery;
			handleVerify(data.initialQuery);
		}
	});

	async function handleVerify(idToVerify?: string) {
		const targetId = (idToVerify !== undefined ? idToVerify : searchQuery).trim();
		if (!targetId) return;

		isVerifying = true;
		verificationResult = null;

		try {
			const res = await fetch('/api/products/verify', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: targetId })
			});
			const result = await res.json();

			if (res.ok && result.success) {
				verificationResult = {
					status: result.status,
					openedAt: result.openedAt,
					product: result.product,
					queryId: targetId
				};

				// Update productsList in memory so UI immediately reflects unsealed status
				productsList = productsList.map((p) => {
					const matchesId = p.id === result.product.id;
					const matchesBatch =
						p.batchId &&
						result.product.batchId === p.batchId &&
						p.serialIndex === result.product.serialIndex;

					if (matchesId || matchesBatch) {
						return {
							...p,
							id: result.product.id,
							sealStatus: 'opened',
							openedAt: result.openedAt,
							isIdConcealed: false
						};
					}
					return p;
				});
			} else {
				verificationResult = {
					status: 'not_found',
					openedAt: null,
					product: null,
					queryId: targetId
				};
			}
		} catch (err) {
			console.error('Failed to verify ID:', err);
			verificationResult = {
				status: 'not_found',
				openedAt: null,
				product: null,
				queryId: targetId
			};
		} finally {
			isVerifying = false;
		}
	}

	function clearSearch() {
		searchQuery = '';
		verificationResult = null;
		if (searchInputRef) {
			searchInputRef.focus();
		}
	}

	function focusSearchInput() {
		if (searchInputRef) {
			searchInputRef.focus();
			searchInputRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}

	let batchCount = $derived(productsList.filter((p) => Boolean(p.batchNumber)).length);
	let sealedCount = $derived(productsList.filter((p) => p.sealStatus !== 'opened').length);
	let openedCount = $derived(productsList.filter((p) => p.sealStatus === 'opened').length);

	let filteredProducts = $derived(
		productsList.filter((p) => {
			if (filterType === 'sealed' && p.sealStatus === 'opened') return false;
			if (filterType === 'opened' && p.sealStatus !== 'opened') return false;
			if (filterType === 'batches' && !p.batchNumber) return false;
			return true;
		})
	);

	// Pagination derivations
	let totalPages = $derived(Math.max(1, Math.ceil(filteredProducts.length / pageSize)));

	$effect(() => {
		filterType;
		pageSize;
		currentPage = 1;
	});

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	let paginatedProducts = $derived(
		filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	let startIndex = $derived(filteredProducts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1);
	let endIndex = $derived(Math.min(currentPage * pageSize, filteredProducts.length));

	let visiblePages = $derived.by(() => {
		const pages: (number | string)[] = [];
		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 2) pages.push('...');
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) pages.push(i);
			if (currentPage < totalPages - 1) pages.push('...');
			pages.push(totalPages);
		}
		return pages;
	});

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages) {
			currentPage = p;
			const el = document.getElementById('ledger-feed');
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}

	function formatDate(timestamp: Date | number | string | null | undefined) {
		if (!timestamp) return 'Just now';
		const date = timestamp instanceof Date ? timestamp : new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function truncate(str: string | null | undefined, lead = 6, trail = 4) {
		if (!str) return '';
		if (str.length <= lead + trail) return str;
		return `${str.slice(0, lead)}…${str.slice(-trail)}`;
	}

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedId = id;
		setTimeout(() => {
			if (copiedId === id) copiedId = null;
		}, 2000);
	}
</script>

<svelte:head>
	<title>Product Directory & Verification — TearRubr</title>
	<meta
		name="description"
		content="Verify authentic products with unique security IDs and inspect tamper-evident physical packaging seals."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20 pb-24 sm:pb-28 font-sans">
	<!-- Floating Pill Dock Navigation -->
	<Navbar currentPath="/verify" />

	<!-- Main Container -->
	<main class="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 relative z-10 space-y-8">
		
		<!-- Page Header -->
		<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
			<div>
				<h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
					Product Directory
				</h1>
				<p class="text-xs sm:text-sm text-[#8e8ea0] mt-1 max-w-xl leading-relaxed">
					Verify product authenticity with your unique physical security ID. Unused product IDs remain concealed until unsealed.
				</p>
			</div>

			<!-- Subtle Live Status Badge -->
			<div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono-tight text-[#8e8ea0] shrink-0 self-start sm:self-auto">
				<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
				<span>Ethereum Sepolia · Live</span>
			</div>
		</div>

		<!-- ========================================================================= -->
		<!-- 1. DEDICATED ID-ONLY VERIFICATION TERMINAL -->
		<!-- ========================================================================= -->
		<div class="p-5 sm:p-7 rounded-3xl bg-white/[0.02] border border-white/[0.08] shadow-sm space-y-5">
			
			<div class="flex items-center justify-between gap-2">
				<div class="flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-white">
					<ShieldCheck size={18} class="text-emerald-400" />
					<span>Security ID Verification Terminal</span>
				</div>
				<span class="text-[11px] font-mono-tight text-[#7a7a8e]">One-Time Physical Proof</span>
			</div>

			<!-- Search Form: ID ONLY -->
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleVerify();
				}}
				class="flex flex-col sm:flex-row items-stretch gap-2.5"
			>
				<div class="relative flex-1">
					<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7a7a8e]">
						<Search size={16} />
					</div>
					<input
						bind:this={searchInputRef}
						type="text"
						bind:value={searchQuery}
						placeholder="Enter Unique Product Security ID (from physical seal or QR code)..."
						class="w-full pl-11 pr-20 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.1] hover:border-white/20 text-white placeholder-[#606074] text-xs sm:text-sm font-mono-tight focus:outline-none focus:border-white/40 transition-all shadow-sm"
					/>
					{#if searchQuery}
						<button
							type="button"
							onclick={clearSearch}
							class="absolute inset-y-0 right-3 flex items-center px-2 text-xs text-[#8e8ea0] hover:text-white transition-colors font-display"
						>
							Clear
						</button>
					{/if}
				</div>

				<button
					type="submit"
					disabled={isVerifying || !searchQuery.trim()}
					class="px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-xs sm:text-sm font-display hover:bg-white/90 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
				>
					{#if isVerifying}
						<span class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
						<span>Verifying...</span>
					{:else}
						<ShieldCheck size={16} />
						<span>Verify ID</span>
					{/if}
				</button>
			</form>

			<!-- VERIFICATION RESULTS -->
			{#if verificationResult}
				<div in:fade={{ duration: 150 }}>
					{#if verificationResult.status === 'first_time_verified'}
						<!-- Case A: First Time Verified (Seal officially broken TODAY) -->
						<div class="p-5 sm:p-6 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/30 text-emerald-400 space-y-4">
							<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div class="flex items-start gap-3.5">
									<div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
										<ShieldCheck size={22} />
									</div>
									<div class="space-y-1">
										<div class="flex items-center gap-2 flex-wrap">
											<h2 class="text-base sm:text-lg font-bold text-white font-display">
												✓ Authentic Product — First-Time Verification!
											</h2>
											<span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono-tight font-bold uppercase tracking-wider">
												Seal Broken Today
											</span>
										</div>
										<p class="text-xs sm:text-sm text-[#c0c0d0] leading-relaxed max-w-2xl">
											This product is officially certified on Ethereum Sepolia. <strong>This is the very first time this security ID has ever been checked.</strong> The physical seal has now been recorded as opened today ({formatDate(verificationResult.openedAt)}) to prevent future counterfeit refilling.
										</p>
									</div>
								</div>

								<a
									href="/verify/{verificationResult.product.id}"
									class="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs font-display hover:bg-emerald-400 transition-all shrink-0 flex items-center gap-1.5 self-start sm:self-center shadow-sm"
								>
									<span>View Full Certificate</span>
									<ArrowRight size={14} />
								</a>
							</div>

							<!-- Item Details Footer -->
							<div class="pt-3 border-t border-emerald-500/20 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8e8ea0]">
								<span>Product: <strong class="text-white font-display">{verificationResult.product.name}</strong></span>
								{#if verificationResult.product.batchNumber}
									<span>·</span>
									<span>LOT: <strong class="text-white font-mono-tight">{verificationResult.product.batchNumber} (#{verificationResult.product.serialIndex}/{verificationResult.product.batchQuantity})</strong></span>
								{/if}
								<span>·</span>
								<span>Issuer: <strong class="text-white font-mono-tight">{truncate(verificationResult.product.manufacturer, 6, 4)}</strong></span>
								<span>·</span>
								<span>ID: <code class="text-emerald-300 font-mono-tight">{truncate(verificationResult.product.id, 8, 6)}</code></span>
							</div>
						</div>

					{:else if verificationResult.status === 'previously_opened'}
						<!-- Case B: Previously Opened / Tamper Warning -->
						<div class="p-5 sm:p-6 rounded-2xl bg-amber-500/[0.08] border border-amber-500/30 text-amber-300 space-y-4">
							<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div class="flex items-start gap-3.5">
									<div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
										<AlertTriangle size={22} />
									</div>
									<div class="space-y-1">
										<div class="flex items-center gap-2 flex-wrap">
											<h2 class="text-base sm:text-lg font-bold text-amber-200 font-display">
												⚠️ Authentic Record — Previously Opened / Tampered
											</h2>
											<span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono-tight font-bold uppercase tracking-wider">
												Seal Already Broken
											</span>
										</div>
										<p class="text-xs sm:text-sm text-[#d8d8e8] leading-relaxed max-w-2xl">
											This product is registered in the blockchain ledger, but this unique security ID was <strong>already verified and unsealed previously on {formatDate(verificationResult.openedAt)}</strong>. If you just purchased or unsealed this item today, the packaging has probably been refilled, reused, or tampered with!
										</p>
									</div>
								</div>

								<a
									href="/verify/{verificationResult.product.id}"
									class="px-4 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs font-display hover:bg-amber-300 transition-all shrink-0 flex items-center gap-1.5 self-start sm:self-center shadow-sm"
								>
									<span>View Audit Certificate</span>
									<ArrowRight size={14} />
								</a>
							</div>

							<!-- Item Details Footer -->
							<div class="pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8e8ea0]">
								<span>Product: <strong class="text-white font-display">{verificationResult.product.name}</strong></span>
								{#if verificationResult.product.batchNumber}
									<span>·</span>
									<span>LOT: <strong class="text-white font-mono-tight">{verificationResult.product.batchNumber} (#{verificationResult.product.serialIndex}/{verificationResult.product.batchQuantity})</strong></span>
								{/if}
								<span>·</span>
								<span>First Unsealed: <strong class="text-amber-300 font-mono-tight">{formatDate(verificationResult.openedAt)}</strong></span>
							</div>
						</div>

					{:else}
						<!-- Case C: Not Found / Counterfeit -->
						<div class="p-5 sm:p-6 rounded-2xl bg-rose-500/[0.08] border border-rose-500/30 text-rose-300">
							<div class="flex items-start gap-3.5">
								<div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
									<ShieldAlert size={22} />
								</div>
								<div class="space-y-1">
									<h2 class="text-base sm:text-lg font-bold text-rose-200 font-display">
										❌ Unrecognized Security ID — Potential Counterfeit
									</h2>
									<p class="text-xs sm:text-sm text-[#d8d8e8] leading-relaxed max-w-2xl">
										No certified product record was found for security ID: <code class="px-1.5 py-0.5 rounded bg-black/40 text-white font-mono-tight">{verificationResult.queryId}</code>. This ID does not exist in the official TearRubr blockchain registry. Do NOT consume, buy, or accept this product.
									</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}

		</div>

		<!-- ========================================================================= -->
		<!-- 2. PUBLIC LEDGER FEED (CONCEALS UNUSED IDs) -->
		<!-- ========================================================================= -->
		<div class="space-y-4">
			
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<h2 class="text-base sm:text-lg font-bold text-white font-display">
						Public Ledger Records
					</h2>
					<p class="text-xs text-[#8e8ea0] mt-0.5">
						Official batch registry. Security IDs for sealed items are concealed under the physical seal.
					</p>
				</div>

				<!-- Filter Pills -->
				<div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-xs">
					<button
						onclick={() => (filterType = 'all')}
						class="px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 {filterType === 'all' ? 'bg-white text-black font-bold shadow-sm' : 'bg-white/[0.03] text-[#8e8ea0] hover:text-white border border-white/[0.06]'}"
					>
						All Products ({productsList.length})
					</button>
					<button
						onclick={() => (filterType = 'sealed')}
						class="px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 {filterType === 'sealed' ? 'bg-white text-black font-bold shadow-sm' : 'bg-white/[0.03] text-[#8e8ea0] hover:text-white border border-white/[0.06]'}"
					>
						Factory Sealed ({sealedCount})
					</button>
					<button
						onclick={() => (filterType = 'opened')}
						class="px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 {filterType === 'opened' ? 'bg-white text-black font-bold shadow-sm' : 'bg-white/[0.03] text-[#8e8ea0] hover:text-white border border-white/[0.06]'}"
					>
						Seal Opened ({openedCount})
					</button>
					<button
						onclick={() => (filterType = 'batches')}
						class="px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 {filterType === 'batches' ? 'bg-white text-black font-bold shadow-sm' : 'bg-white/[0.03] text-[#8e8ea0] hover:text-white border border-white/[0.06]'}"
					>
						Batch Runs ({batchCount})
					</button>
				</div>
			</div>

			<!-- Products Feed Anchor -->
			<div id="ledger-feed" class="scroll-mt-28">
				{#if filteredProducts.length === 0}
					<div class="p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] text-center">
						<div class="w-10 h-10 rounded-2xl bg-white/[0.04] text-[#8e8ea0] flex items-center justify-center mx-auto mb-3">
							<Search size={18} />
						</div>
						<h3 class="text-sm font-bold text-white font-display">No matching records</h3>
						<p class="text-xs text-[#8e8ea0] mt-1 max-w-sm mx-auto">
							No products found for the selected filter.
						</p>
					</div>
				{:else}
					<!-- Clean Product Cards -->
					<div class="grid grid-cols-1 gap-3">
						{#each paginatedProducts as product (product.displayKey || product.id)}
							<div
								class="p-4 sm:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all duration-150 shadow-sm"
								in:fade={{ duration: 100 }}
							>
								<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
									
									<!-- Left: Product Info -->
									<div class="space-y-1.5 min-w-0 flex-1">
										
										<div class="flex flex-wrap items-center gap-2">
											{#if product.sealStatus === 'opened' && product.id}
												<a
													href="/verify/{product.id}"
													class="text-base font-bold text-white hover:underline font-display transition-colors"
												>
													{product.name}
												</a>
											{:else}
												<span class="text-base font-bold text-white font-display">
													{product.name}
												</span>
											{/if}

											<!-- Status Badge -->
											{#if product.sealStatus !== 'opened'}
												<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono-tight font-semibold">
													<ShieldCheck size={13} class="shrink-0" />
													<span>Factory Sealed · Unused</span>
												</span>
											{:else}
												<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono-tight font-semibold">
													<AlertTriangle size={13} class="shrink-0" />
													<span>Seal Opened</span>
												</span>
											{/if}

											<!-- LOT chip -->
											{#if product.batchNumber}
												<span class="px-2 py-0.5 rounded bg-white/[0.05] text-white border border-white/10 text-[11px] font-mono-tight">
													LOT: {product.batchNumber} (#{product.serialIndex}/{product.batchQuantity})
												</span>
											{/if}
										</div>

										<!-- Metadata Line -->
										<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8e8ea0]">
											<span>Issuer: <strong class="text-white font-mono-tight">{truncate(product.manufacturer, 6, 4)}</strong></span>
											<span class="text-white/20 hidden sm:inline">·</span>
											{#if product.sealStatus === 'opened'}
												<span class="text-amber-400 font-medium">
													Seal broken {product.openedAt ? `on ${formatDate(product.openedAt)}` : 'previously'}
												</span>
											{:else}
												<span class="text-emerald-400 font-medium">
													Factory sealed · Physical seal intact
												</span>
											{/if}
											<span class="text-white/20 hidden sm:inline">·</span>
											<span class="whitespace-nowrap font-mono-tight text-[11px]">{formatDate(product.createdAt)}</span>
										</div>

									</div>

									<!-- Right: Security ID (Concealed if unused) & Action -->
									<div class="pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04] flex items-center justify-between sm:justify-end gap-3 shrink-0">
										
										<!-- ID Display: Only exposed if already opened! Concealed under seal if unused -->
										{#if product.sealStatus === 'opened' && product.id}
											{@const currentId = product.id}
											<button
												onclick={() => copyToClipboard(currentId, currentId)}
												class="text-xs font-mono-tight text-[#8e8ea0] hover:text-white transition-colors inline-flex items-center gap-1"
												title="Copy Product ID"
											>
												{#if copiedId === product.id}
													<Check size={12} class="text-emerald-400" />
													<span class="text-emerald-400">Copied</span>
												{:else}
													<Copy size={12} class="text-[#606074]" />
													<span>{truncate(product.id, 6, 4)}</span>
												{/if}
											</button>

											<a
												href="/verify/{product.id}"
												class="px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 text-xs font-display transition-all inline-flex items-center gap-1.5 shadow-sm"
											>
												<span>View Certificate</span>
												<ArrowRight size={12} class="shrink-0" />
											</a>
										{:else}
											<!-- Concealed for Unopened Products -->
											<span class="inline-flex items-center gap-1 text-xs text-[#8e8ea0]" title="Unique ID is concealed under physical packaging seal">
												<Lock size={12} class="text-emerald-400/70" />
												<span class="font-mono-tight text-white/40 text-[11px]">ID Concealed</span>
											</span>

											<button
												onclick={focusSearchInput}
												class="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs text-[#8e8ea0] hover:text-white transition-all inline-flex items-center gap-1.5 font-display"
											>
												<span>Verify with ID</span>
												<ArrowRight size={12} class="shrink-0" />
											</button>
										{/if}

									</div>

								</div>
							</div>
						{/each}
					</div>

					<!-- Pagination Bar -->
					<div class="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
						<div class="text-xs text-[#8e8ea0] font-mono-tight">
							Showing <strong class="text-white">{startIndex}</strong> – <strong class="text-white">{endIndex}</strong> of <strong class="text-white">{filteredProducts.length}</strong> records
						</div>

						<div class="flex items-center gap-1.5 text-xs font-display">
							<button
								onclick={() => goToPage(currentPage - 1)}
								disabled={currentPage === 1}
								class="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white disabled:opacity-30 transition-all inline-flex items-center gap-1"
								aria-label="Previous page"
							>
								<ChevronLeft size={14} />
								<span class="hidden sm:inline">Previous</span>
							</button>

							<div class="flex items-center gap-1">
								{#each visiblePages as p}
									{#if typeof p === 'number'}
										<button
											onclick={() => goToPage(p)}
											class="w-7 h-7 rounded-lg font-mono-tight text-xs transition-all {currentPage === p ? 'bg-white text-black font-bold shadow-sm' : 'text-[#8e8ea0] hover:text-white'}"
										>
											{p}
										</button>
									{:else}
										<span class="px-1 text-[#606074] font-mono-tight text-xs">…</span>
									{/if}
								{/each}
							</div>

							<button
								onclick={() => goToPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								class="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white disabled:opacity-30 transition-all inline-flex items-center gap-1"
								aria-label="Next page"
							>
								<span class="hidden sm:inline">Next</span>
								<ChevronRight size={14} />
							</button>
						</div>
					</div>
				{/if}
			</div>

		</div>

	</main>
</div>
