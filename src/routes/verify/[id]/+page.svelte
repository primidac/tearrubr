<script lang="ts">
	import { fade } from 'svelte/transition';
	import QRCode from 'qrcode';
	import Navbar from '$lib/components/Navbar.svelte';
	import {
		ShieldCheck,
		ShieldAlert,
		Check,
		Copy,
		Printer,
		Share2,
		ArrowLeft,
		ExternalLink,
		Lock,
		Unlock,
		ChevronDown,
		ChevronUp
	} from '@lucide/svelte';

	let { data } = $props();

	let sealStatus = $state<string>('sealed');
	let openedAt = $state<Date | string | number | null>(null);
	let isUnsealing = $state(false);
	let copiedKey = $state<string | null>(null);
	let qrDataUrl = $state<string>('');
	let showSimulateConfirm = $state(false);
	let showProofDetails = $state(false);

	$effect(() => {
		sealStatus = data.product?.sealStatus || 'sealed';
		openedAt = data.product?.openedAt || null;
	});

	// Generate QR code for this verification URL
	$effect(() => {
		if (typeof window !== 'undefined' && data.id) {
			const verifyUrl = `${window.location.origin}/verify/${data.id}`;
			QRCode.toDataURL(verifyUrl, {
				width: 320,
				margin: 1,
				errorCorrectionLevel: 'H',
				color: {
					dark: '#00f2fe',
					light: '#0a0a14'
				}
			}).then((url) => {
				qrDataUrl = url;
			}).catch((err) => {
				console.error('QR code generation failed:', err);
			});
		}
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

	function truncate(str: string | null | undefined, lead = 8, trail = 6) {
		if (!str) return '';
		return str.length > lead + trail ? `${str.slice(0, lead)}…${str.slice(-trail)}` : str;
	}

	function copyToClipboard(text: string, key: string) {
		navigator.clipboard.writeText(text);
		copiedKey = key;
		setTimeout(() => {
			if (copiedKey === key) copiedKey = null;
		}, 2000);
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
				showSimulateConfirm = false;
			}
		} catch (err) {
			console.error('Failed to unseal', err);
		} finally {
			isUnsealing = false;
		}
	}

	function printCertificate() {
		if (typeof window !== 'undefined') {
			window.print();
		}
	}
</script>

<svelte:head>
	<title>{data.product ? data.product.name : 'Not Found'} — Certificate of Authenticity | TearRubr</title>
	<meta
		name="description"
		content="Official product authenticity certificate and tamper-evident packaging verification."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20 pb-20 print:bg-white print:text-black print:pb-0 font-sans">
	<!-- Floating Navigation (Hidden in Print) -->
	<div class="print:hidden">
		<Navbar currentPath="/verify" />
	</div>

	<!-- Atmospheric Ambient Glows -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 print:hidden">
		<div class="absolute top-20 right-1/4 w-[400px] h-[400px] rounded-full bg-[#10b981]/10 blur-[140px]"></div>
		<div class="absolute bottom-20 left-1/4 w-[400px] h-[400px] rounded-full bg-[#6366f1]/10 blur-[140px]"></div>
	</div>

	<!-- Main Canvas -->
	<main class="max-w-2xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 relative z-10 print:pt-4 print:px-0">
		
		<!-- Sub-Header / Back & Action Buttons -->
		<div class="mb-4 flex items-center justify-between text-xs print:hidden">
			<a
				href="/verify"
				class="group text-[#8e8ea0] hover:text-white transition-colors inline-flex items-center gap-1.5 font-display"
			>
				<span class="p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-white/20 transition-colors">
					<ArrowLeft size={13} class="text-[#8e8ea0] group-hover:text-white transition-colors" />
				</span>
				<span>Directory</span>
			</a>

			<div class="flex items-center gap-2">
				<button
					onclick={printCertificate}
					class="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8e8ea0] hover:text-white transition-colors"
					title="Print Certificate"
					aria-label="Print Certificate"
				>
					<Printer size={14} />
				</button>

				<button
					onclick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '', 'page-url')}
					class="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8e8ea0] hover:text-white transition-colors flex items-center gap-1.5"
					title="Share Certificate"
					aria-label="Share Certificate"
				>
					{#if copiedKey === 'page-url'}
						<Check size={14} class="text-emerald-400" />
					{:else}
						<Share2 size={14} />
					{/if}
				</button>
			</div>
		</div>

		{#if data.product}
			<!-- ================================================================= -->
			<!-- SIMPLIFIED CERTIFICATE CARD -->
			<!-- ================================================================= -->
			<div class="rounded-3xl bg-[#0c0c16]/95 border border-white/[0.08] shadow-2xl backdrop-blur-2xl overflow-hidden print:bg-white print:border print:border-black print:shadow-none">
				
				<!-- Top Status Banner -->
				<div class="px-6 py-4 border-b {sealStatus === 'opened' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} flex items-center justify-between flex-wrap gap-2">
					<div class="flex items-center gap-2.5">
						<div class="w-8 h-8 rounded-xl {sealStatus === 'opened' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'} flex items-center justify-center shrink-0">
							{#if sealStatus === 'opened'}
								<ShieldAlert size={18} />
							{:else}
								<ShieldCheck size={18} />
							{/if}
						</div>
						<div>
							<div class="text-xs font-bold font-mono-tight uppercase tracking-wide {sealStatus === 'opened' ? 'text-amber-300' : 'text-emerald-400'}">
								{sealStatus === 'opened' ? 'Notice: Seal Opened' : 'Verified Authentic'}
							</div>
							<div class="text-[11px] text-[#8e8ea0]">
								Anchored on Ethereum Sepolia
							</div>
						</div>
					</div>

					<span class="px-2.5 py-1 rounded-full text-[11px] font-mono-tight font-bold uppercase {sealStatus === 'opened' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
						{sealStatus === 'opened' ? 'Seal Opened' : 'Factory Sealed'}
					</span>
				</div>

				<!-- Product Overview -->
				<div class="p-6 sm:p-8 space-y-6">
					
					<!-- Product Title & Brand -->
					<div>
						<h1 class="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight print:text-black">
							{data.product.name}
						</h1>
						<div class="text-xs sm:text-sm text-[#8e8ea0] mt-1 flex items-center gap-2 flex-wrap">
							<span class="text-white font-medium">{data.product.manufacturer}</span>
							<span class="text-white/20">·</span>
							<span>Registered {formatDate(data.product.createdAt)}</span>
						</div>
					</div>

					<!-- Direct Data Grid (4 Key Chips) -->
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
						<div class="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
							<div class="text-[10px] uppercase font-mono-tight text-[#7a7a8e]">Batch / LOT</div>
							<div class="text-xs font-bold text-white font-mono-tight truncate">
								{data.product.batchNumber || 'Single Unit'}
							</div>
						</div>

						<div class="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
							<div class="text-[10px] uppercase font-mono-tight text-[#7a7a8e]">Unit Number</div>
							<div class="text-xs font-bold text-white font-mono-tight truncate">
								{data.product.serialIndex ? `#${data.product.serialIndex} of ${data.product.batchQuantity || ''}` : '1 of 1'}
							</div>
						</div>

						<div class="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
							<div class="text-[10px] uppercase font-mono-tight text-[#7a7a8e]">Seal Status</div>
							<div class="text-xs font-bold font-mono-tight truncate {sealStatus === 'opened' ? 'text-amber-400' : 'text-emerald-400'}">
								{sealStatus === 'opened' ? 'Opened' : 'Intact'}
							</div>
						</div>

						<div class="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-0.5">
							<div class="text-[10px] uppercase font-mono-tight text-[#7a7a8e]">Product ID</div>
							<button
								onclick={() => copyToClipboard(data.product?.id || '', 'pid')}
								class="text-xs font-bold text-white font-mono-tight truncate hover:text-accent transition-colors flex items-center gap-1"
								title="Click to copy ID"
							>
								<span>{truncate(data.product.id, 6, 4)}</span>
								{#if copiedKey === 'pid'}
									<Check size={11} class="text-emerald-400 shrink-0" />
								{:else}
									<Copy size={11} class="text-[#606074] shrink-0" />
								{/if}
							</button>
						</div>
					</div>

					<!-- Physical Packaging Seal Status Card -->
					<div class="p-4 rounded-2xl border {sealStatus === 'opened' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} flex flex-col sm:flex-row sm:items-center justify-between gap-3">
						<div class="flex items-center gap-2.5">
							<span class="p-2 rounded-xl {sealStatus === 'opened' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'} shrink-0">
								{#if sealStatus === 'opened'}
									<Unlock size={16} />
								{:else}
									<Lock size={16} />
								{/if}
							</span>
							<div>
								<div class="text-xs font-bold text-white font-display">
									{sealStatus === 'opened' ? 'Packaging Seal Broken' : 'Factory Seal Intact'}
								</div>
								<div class="text-[11px] text-[#8e8ea0]">
									{sealStatus === 'opened'
										? `Opened on ${formatDate(openedAt)}`
										: 'Original physical seal has never been torn'}
								</div>
							</div>
						</div>

						<!-- Simulate Tear Action (Minimal & Unobtrusive) -->
						<div class="print:hidden">
							{#if sealStatus !== 'opened'}
								{#if !showSimulateConfirm}
									<button
										onclick={() => (showSimulateConfirm = true)}
										class="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-amber-500/20 text-xs font-display text-[#8e8ea0] hover:text-amber-300 transition-colors"
									>
										Simulate Seal Tear
									</button>
								{:else}
									<div class="flex items-center gap-2" in:fade={{ duration: 150 }}>
										<button
											onclick={handleUnseal}
											disabled={isUnsealing}
											class="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#08080e] font-bold text-xs transition-all shadow"
										>
											{isUnsealing ? 'Logging...' : 'Confirm Tear'}
										</button>
										<button
											onclick={() => (showSimulateConfirm = false)}
											disabled={isUnsealing}
											class="px-2.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-xs text-white transition-colors"
										>
											Cancel
										</button>
									</div>
								{/if}
							{/if}
						</div>
					</div>

					<!-- QR Code & Link Sharing (Compact, Integrated) -->
					<div class="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-center gap-4">
						{#if qrDataUrl}
							<div class="p-2 rounded-xl bg-black border border-white/[0.08] shrink-0">
								<img
									src={qrDataUrl}
									alt="Verification QR Code"
									class="w-24 h-24 rounded-lg object-contain"
								/>
							</div>
						{/if}

						<div class="flex-1 text-center sm:text-left space-y-2 w-full">
							<div>
								<div class="text-xs font-bold text-white font-display">Scan & Verify Code</div>
								<div class="text-[11px] text-[#8e8ea0]">Point any smartphone camera to inspect this certificate</div>
							</div>

							<div class="flex items-center gap-2 print:hidden">
								<button
									onclick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '', 'quick-url')}
									class="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-display text-white transition-colors inline-flex items-center gap-1.5"
								>
									{#if copiedKey === 'quick-url'}
										<Check size={12} class="text-emerald-400" />
										<span class="text-emerald-400 font-semibold">Copied</span>
									{:else}
										<Copy size={12} />
										<span>Copy Certificate Link</span>
									{/if}
								</button>
							</div>
						</div>
					</div>

					<!-- Collapsible Blockchain Proof Accordion (Optional Deep-Dive) -->
					<div class="border-t border-white/[0.06] pt-4 print:hidden">
						<button
							onclick={() => (showProofDetails = !showProofDetails)}
							class="w-full flex items-center justify-between text-xs font-mono-tight text-[#8e8ea0] hover:text-white transition-colors py-1"
						>
							<span>Blockchain & Cryptographic Details</span>
							{#if showProofDetails}
								<ChevronUp size={14} />
							{:else}
								<ChevronDown size={14} />
							{/if}
						</button>

						{#if showProofDetails}
							<div class="mt-3 space-y-2 text-xs font-mono-tight" in:fade={{ duration: 150 }}>
								<!-- Smart contract -->
								<div class="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-2">
									<div class="truncate min-w-0">
										<span class="text-[10px] text-[#7a7a8e] block">CONTRACT (SEPOLIA)</span>
										<span class="text-white truncate block">{truncate(data.contractAddress, 10, 8)}</span>
									</div>
									<a
										href="{data.explorerBaseUrl}/address/{data.contractAddress}"
										target="_blank"
										rel="noopener noreferrer"
										class="text-accent hover:underline text-[11px] flex items-center gap-1 shrink-0"
									>
										<span>Etherscan</span>
										<ExternalLink size={10} />
									</a>
								</div>

								<!-- Transaction Hash -->
								{#if data.product.blockchainTxHash}
									<div class="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-2">
										<div class="truncate min-w-0">
											<span class="text-[10px] text-[#7a7a8e] block">TRANSACTION</span>
											<span class="text-emerald-400 truncate block">{truncate(data.product.blockchainTxHash, 10, 8)}</span>
										</div>
										<a
											href="{data.explorerBaseUrl}/tx/{data.product.blockchainTxHash}"
											target="_blank"
											rel="noopener noreferrer"
											class="text-emerald-400 hover:underline text-[11px] flex items-center gap-1 shrink-0"
										>
											<span>View Tx</span>
											<ExternalLink size={10} />
										</a>
									</div>
								{/if}

								<!-- Merkle Root -->
								{#if data.batch?.merkleRoot}
									<div class="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-2">
										<div class="truncate min-w-0">
											<span class="text-[10px] text-[#7a7a8e] block">MERKLE BATCH ROOT</span>
											<span class="text-indigo-300 truncate block">{truncate(data.batch.merkleRoot, 10, 8)}</span>
										</div>
										<button
											onclick={() => copyToClipboard(data.batch?.merkleRoot || '', 'm-root')}
											class="text-[#8e8ea0] hover:text-white transition-colors text-[11px] shrink-0"
										>
											{#if copiedKey === 'm-root'}
												<span class="text-emerald-400">Copied</span>
											{:else}
												<span>Copy</span>
											{/if}
										</button>
									</div>
								{/if}
							</div>
						{/if}
					</div>

				</div>
			</div>
		{:else}
			<!-- Unverified / Not Found State -->
			<div class="p-8 rounded-3xl bg-[#0c0c16]/95 border border-rose-500/30 text-center space-y-4">
				<div class="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
					<ShieldAlert size={24} />
				</div>
				<div>
					<h2 class="text-lg font-bold text-white font-display">Record Not Found</h2>
					<p class="text-xs text-[#8e8ea0] mt-1">
						No authenticity record found for identifier <code class="text-white font-mono-tight">{truncate(data.id, 8, 6)}</code>.
					</p>
				</div>
				<a
					href="/verify"
					class="inline-block px-4 py-2 rounded-lg bg-white text-[#08080e] font-bold text-xs font-display hover:bg-white/90 transition-all"
				>
					Search Product Directory
				</a>
			</div>
		{/if}

	</main>
</div>
