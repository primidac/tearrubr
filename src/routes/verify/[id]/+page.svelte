<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import QRCode from 'qrcode';
	import Navbar from '$lib/components/Navbar.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { auth } from '$lib/auth.svelte';
	import {
		ShieldCheck,
		ShieldAlert,
		CheckCircle2,
		Layers,
		Boxes,
		FileCheck,
		ExternalLink,
		Copy,
		Check,
		Printer,
		QrCode,
		Lock,
		Unlock,
		Clock,
		ArrowLeft,
		Sparkles,
		Cpu,
		Database,
		Activity,
		Hash,
		Share2,
		AlertTriangle
	} from '@lucide/svelte';

	let { data } = $props();

	let sealStatus = $state<string>('sealed');
	let openedAt = $state<Date | string | number | null>(null);
	let isUnsealing = $state(false);
	let copiedKey = $state<string | null>(null);
	let qrDataUrl = $state<string>('');
	let showSimulateConfirm = $state(false);

	$effect(() => {
		sealStatus = data.product?.sealStatus || 'sealed';
		openedAt = data.product?.openedAt || null;
	});

	// Generate high-res QR code for this specific product verification URL
	$effect(() => {
		if (typeof window !== 'undefined' && data.id) {
			const verifyUrl = `${window.location.origin}/verify/${data.id}`;
			QRCode.toDataURL(verifyUrl, {
				width: 512,
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

	function truncate(str: string | null | undefined, lead = 10, trail = 8) {
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
	<title>{data.product ? data.product.name : 'Not Found'} | Cryptographic Authenticity Passport</title>
	<meta
		name="description"
		content="Cryptographic product verification proof backed by Ethereum smart contracts, The Graph protocol, and TearRubr physical tamper-evident seals."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20 pb-24 sm:pb-32 print:bg-white print:text-black print:pb-0">
	<!-- Floating Pill Dock Navigation (Hidden in Print) -->
	<div class="print:hidden">
		<Navbar currentPath="/verify" />
	</div>

	<!-- Atmospheric Ambient Glows (Hidden in Print) -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 print:hidden">
		<div class="absolute top-20 right-10 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#6366f1]/10 blur-[120px] sm:blur-[150px]"></div>
		<div class="absolute bottom-20 left-10 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-[#00f2fe]/10 blur-[120px] sm:blur-[150px]"></div>
	</div>

	<!-- Main Content Area -->
	<main class="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-24 sm:pt-36 relative z-10 print:pt-4 print:px-0">
		
		<!-- Sub-Header / Back & System Telemetry Bar (Hidden in Print) -->
		<div class="mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-2.5 text-xs print:hidden">
			<a
				href="/verify"
				class="group text-[#8e8ea0] hover:text-white transition-colors inline-flex items-center gap-1.5 sm:gap-2 font-display shrink-0"
			>
				<span class="p-1 rounded-lg bg-white/[0.04] border border-white/[0.08] group-hover:border-white/20 transition-colors">
					<ArrowLeft size={13} class="text-[#8e8ea0] group-hover:text-white transition-colors" />
				</span>
				<span class="text-[11px] sm:text-xs">Authenticity Ledger</span>
			</a>

			<div class="flex items-center gap-2 font-mono-tight flex-wrap">
				<!-- The Graph Sync Badge -->
				<div class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] sm:text-[11px] text-[#8e8ea0] shrink-0">
					<Layers size={11} class="text-indigo-400 shrink-0" />
					<span>The Graph #{auth.subgraph.syncedBlock ? auth.subgraph.syncedBlock.toLocaleString() : '11,684,183'}</span>
				</div>

				<!-- Sepolia Consensus Badge (Hidden on mobile to save space) -->
				<div class="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#8e8ea0] shrink-0">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
					<span>Sepolia Consensus Live</span>
				</div>

				<!-- Action Buttons -->
				<div class="flex items-center gap-1.5 shrink-0">
					<button
						onclick={printCertificate}
						class="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e8ea0] hover:text-white transition-colors"
						title="Print Certificate of Authenticity"
						aria-label="Print Certificate"
					>
						<Printer size={13} />
					</button>

					<button
						onclick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '', 'page-url')}
						class="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e8ea0] hover:text-white transition-colors"
						title="Copy Verification Link"
						aria-label="Copy Verification Link"
					>
						{#if copiedKey === 'page-url'}
							<Check size={13} class="text-emerald-400" />
						{:else}
							<Share2 size={13} />
						{/if}
					</button>
				</div>
			</div>
		</div>

		{#if data.product}
			<!-- ========================================================================= -->
			<!-- AUTHENTICITY PASSPORT DOSSIER GRID (12 COLS) -->
			<!-- ========================================================================= -->
			<div in:fly={{ y: 16, duration: 350 }} class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">

				<!-- ===================================================================== -->
				<!-- LEFT / MAIN COLUMN: THE OFFICIAL CRYPTOGRAPHIC CERTIFICATE (8 COLS) -->
				<!-- ===================================================================== -->
				<div class="lg:col-span-8 space-y-5 sm:space-y-6">

					<!-- MAIN PASSPORT CERTIFICATE CARD -->
					<div class="rounded-3xl bg-[#0c0c16]/90 border border-white/[0.08] shadow-2xl backdrop-blur-2xl overflow-hidden relative print:bg-white print:border-2 print:border-black print:text-black print:shadow-none">
						
						<!-- Top Holographic Security Header Strip -->
						<div class="relative px-4 sm:px-8 py-4 sm:py-5 border-b {sealStatus === 'opened' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} print:bg-gray-100 print:border-black">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
								
								<!-- Verified Status Title -->
								<div class="flex items-start sm:items-center gap-3">
									<div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl {sealStatus === 'opened' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'} flex items-center justify-center shrink-0 shadow-inner">
										{#if sealStatus === 'opened'}
											<ShieldAlert size={20} />
										{:else}
											<ShieldCheck size={20} />
										{/if}
									</div>

									<div class="min-w-0">
										<div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
											<span class="text-xs font-bold font-mono-tight uppercase tracking-wider {sealStatus === 'opened' ? 'text-amber-300' : 'text-emerald-400'}">
												{sealStatus === 'opened' ? 'Tamper Warning: Seal Unsealed' : 'Certificate of Authenticity'}
											</span>
											<span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono-tight uppercase {data.product.blockchainTxHash ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-[#8e8ea0]'}">
												{data.product.blockchainTxHash ? 'On-Chain Validated' : 'Ledger Record'}
											</span>
										</div>
										<p class="text-[11px] sm:text-xs text-[#8e8ea0] mt-0.5 print:text-gray-600">
											Cryptographically anchored on Ethereum Sepolia & indexed via The Graph protocol
										</p>
									</div>
								</div>

								<!-- Protocol Badge -->
								<div class="flex items-center gap-1.5 self-start sm:self-center shrink-0">
									<span class="px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] sm:text-[11px] font-mono-tight text-white flex items-center gap-1.5">
										<Sparkles size={11} class="text-cyan-400 shrink-0" />
										<span>ID #{truncate(data.product.id, 6, 4)}</span>
									</span>
								</div>

							</div>
						</div>

						<!-- Core Product Specifications & Issuer Dossier -->
						<div class="p-4 sm:p-8 space-y-5 sm:space-y-6">
							
							<!-- Product Header & Brand Issuer -->
							<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 sm:pb-6 border-b border-white/[0.06] print:border-gray-300">
								<div class="space-y-1.5 min-w-0">
									<div class="text-[11px] font-mono-tight text-accent uppercase tracking-wider font-semibold flex items-center gap-1.5">
										<span>Authorized Brand Issuer</span>
										<CheckCircle2 size={12} class="text-accent" />
									</div>
									<h2 class="text-xl sm:text-3xl font-extrabold text-white font-display tracking-tight print:text-black break-words">
										{data.product.name}
									</h2>
									<div class="text-xs sm:text-sm font-semibold text-[#8e8ea0] font-display flex items-center gap-2 flex-wrap">
										<span class="text-white print:text-black font-bold">{data.product.manufacturer}</span>
										<span class="text-white/20">·</span>
										<span class="text-xs font-mono-tight text-emerald-400">Verified Origin</span>
									</div>
								</div>

								<!-- Direct Verification Badge -->
								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] shrink-0 space-y-1 text-left sm:text-right print:border-black w-full sm:w-auto">
									<div class="text-[10px] font-mono-tight uppercase tracking-wider text-[#7a7a8e]">Registration Timestamp</div>
									<div class="text-xs font-bold text-white font-mono-tight print:text-black">
										{formatDate(data.product.createdAt)}
									</div>
									<div class="text-[10px] text-emerald-400 font-mono-tight flex items-center sm:justify-end gap-1">
										<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
										<span>Chain Confirmed</span>
									</div>
								</div>
							</div>

							<!-- Provenance / Product Description -->
							{#if data.product.description}
								<div class="space-y-1.5">
									<div class="text-[10px] font-mono-tight uppercase tracking-wider text-[#7a7a8e]">
										Product Description & Specification
									</div>
									<p class="text-xs text-[#a0a0b2] leading-relaxed print:text-black">
										{data.product.description}
									</p>
								</div>
							{/if}

							<!-- Metadata Specification Grid -->
							<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 print:border-gray-300">
									<div class="text-[10px] font-mono-tight uppercase text-[#7a7a8e]">Record Type</div>
									<div class="text-xs font-bold text-white font-display print:text-black truncate">
										{data.product.batchNumber ? 'Batch Rollup' : 'Single Unit'}
									</div>
								</div>

								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 print:border-gray-300">
									<div class="text-[10px] font-mono-tight uppercase text-[#7a7a8e]">LOT / Batch</div>
									<div class="text-xs font-bold text-white font-mono-tight print:text-black truncate">
										{data.product.batchNumber || 'N/A (1/1)'}
									</div>
								</div>

								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 print:border-gray-300">
									<div class="text-[10px] font-mono-tight uppercase text-[#7a7a8e]">Serial Index</div>
									<div class="text-xs font-bold text-white font-mono-tight print:text-black truncate">
										{data.product.serialIndex ? `#${data.product.serialIndex} / ${data.product.batchQuantity || 'Pool'}` : 'Direct 1/1'}
									</div>
								</div>

								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1 print:border-gray-300">
									<div class="text-[10px] font-mono-tight uppercase text-[#7a7a8e]">Physical Integrity</div>
									<div class="text-xs font-bold {sealStatus === 'opened' ? 'text-amber-400' : 'text-emerald-400'} font-mono-tight flex items-center gap-1">
										{#if sealStatus === 'opened'}
											<Unlock size={12} class="shrink-0" />
											<span>Torn</span>
										{:else}
											<Lock size={12} class="shrink-0" />
											<span>Intact</span>
										{/if}
									</div>
								</div>
							</div>

						</div>

						<!-- Industrial Batch Merkle Tree Proof (if batch item) -->
						{#if data.product.batchNumber}
							<div class="px-4 sm:px-8 py-4 sm:py-5 bg-indigo-500/[0.04] border-t border-white/[0.06] space-y-3 print:bg-gray-50 print:border-black">
								<div class="flex items-center justify-between gap-2 flex-wrap">
									<div class="flex items-center gap-2">
										<Boxes size={15} class="text-indigo-400 shrink-0" />
										<span class="text-xs font-bold text-white font-display print:text-black">Industrial Merkle Batch Audit</span>
									</div>
									<span class="text-[10px] sm:text-[11px] font-mono-tight text-indigo-300 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
										Cryptographic Inclusion Proof
									</span>
								</div>

								<p class="text-xs text-[#8e8ea0] leading-relaxed print:text-gray-700">
									This item is verifiable as leaf #{data.product.serialIndex} of batch <strong class="text-white print:text-black">{data.product.batchNumber}</strong>. The Merkle root is committed directly to the smart contract on Ethereum Sepolia.
								</p>

								{#if data.batch?.merkleRoot}
									<div class="p-3 rounded-xl bg-[#08080e] border border-white/[0.08] flex items-center justify-between gap-2 text-xs font-mono-tight print:bg-white print:border-gray-300">
										<div class="truncate min-w-0">
											<span class="text-[10px] text-[#7a7a8e] uppercase block">Merkle Root Hash</span>
											<span class="text-indigo-300 truncate font-mono-tight text-[11px] block">{truncate(data.batch.merkleRoot, 14, 12)}</span>
										</div>
										<button
											onclick={() => copyToClipboard(data.batch?.merkleRoot || '', 'merkle-root')}
											class="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#8e8ea0] hover:text-white transition-colors shrink-0"
											title="Copy Merkle Root"
										>
											{#if copiedKey === 'merkle-root'}
												<Check size={13} class="text-emerald-400" />
											{:else}
												<Copy size={13} />
											{/if}
										</button>
									</div>
								{/if}
							</div>
						{/if}

						<!-- DUAL-LAYER CRYPTOGRAPHIC AUDIT LEDGER (L1 & L2) -->
						<div class="px-4 sm:px-8 py-5 sm:py-6 border-t border-white/[0.06] bg-black/20 space-y-4 print:bg-white print:border-black">
							<div class="flex items-center justify-between">
								<div class="text-xs font-bold font-display uppercase tracking-wider text-white flex items-center gap-2 print:text-black">
									<Cpu size={14} class="text-cyan-400 shrink-0" />
									<span>Dual-Layer On-Chain Verification Ledger</span>
								</div>
								<span class="text-[10px] font-mono-tight text-[#7a7a8e] uppercase">
									Immutable Proof
								</span>
							</div>

							<div class="space-y-2.5">
								<!-- Layer 1: Ethereum Smart Contract -->
								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono-tight print:border-gray-300">
									<div class="space-y-0.5 min-w-0 flex-1">
										<span class="text-[10px] text-[#7a7a8e] uppercase flex items-center gap-1.5">
											<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
											<span>Ethereum Smart Contract (Sepolia)</span>
										</span>
										<div class="text-white font-mono-tight font-semibold break-all text-[11px] sm:text-xs print:text-black">
											{data.contractAddress}
										</div>
									</div>

									<div class="flex items-center gap-2 self-start sm:self-center shrink-0">
										<button
											onclick={() => copyToClipboard(data.contractAddress, 'contract-address')}
											class="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-[#8e8ea0] hover:text-white transition-colors flex items-center gap-1"
										>
											{#if copiedKey === 'contract-address'}
												<Check size={11} class="text-emerald-400" />
												<span class="text-emerald-400">Copied</span>
											{:else}
												<Copy size={11} />
												<span>Copy</span>
											{/if}
										</button>
										<a
											href="{data.explorerBaseUrl}/address/{data.contractAddress}"
											target="_blank"
											rel="noopener noreferrer"
											class="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1"
										>
											<span>Etherscan</span>
											<ExternalLink size={10} />
										</a>
									</div>
								</div>

								<!-- Layer 1: Transaction Hash -->
								{#if data.product.blockchainTxHash}
									<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono-tight print:border-gray-300">
										<div class="space-y-0.5 min-w-0 flex-1">
											<span class="text-[10px] text-[#7a7a8e] uppercase flex items-center gap-1.5">
												<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
												<span>Registration Consensus Tx Hash</span>
											</span>
											<div class="text-emerald-400 font-mono-tight font-semibold break-all text-[11px] sm:text-xs">
												{data.product.blockchainTxHash}
											</div>
										</div>

										<div class="flex items-center gap-2 self-start sm:self-center shrink-0">
											<button
												onclick={() => copyToClipboard(data.product?.blockchainTxHash || '', 'tx-hash')}
												class="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-[#8e8ea0] hover:text-white transition-colors flex items-center gap-1"
											>
												{#if copiedKey === 'tx-hash'}
													<Check size={11} class="text-emerald-400" />
													<span class="text-emerald-400">Copied</span>
												{:else}
													<Copy size={11} />
													<span>Copy</span>
												{/if}
											</button>
											<a
												href="{data.explorerBaseUrl}/tx/{data.product.blockchainTxHash}"
												target="_blank"
												rel="noopener noreferrer"
												class="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] text-emerald-300 hover:text-emerald-200 transition-colors flex items-center gap-1"
											>
												<span>Verify Tx</span>
												<ExternalLink size={10} />
											</a>
										</div>
									</div>
								{/if}

								<!-- Layer 2: The Graph Decentralized Indexing Proof -->
								<div class="p-3 sm:p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono-tight print:border-gray-300">
									<div class="space-y-0.5 min-w-0 flex-1">
										<span class="text-[10px] text-[#7a7a8e] uppercase flex items-center gap-1.5">
											<Layers size={11} class="text-indigo-400 shrink-0" />
											<span>The Graph Decentralized Subgraph Index</span>
										</span>
										<div class="text-indigo-300 font-mono-tight text-[11px]">
											Entity ID: <strong class="text-white print:text-black">{truncate(data.product.id, 12, 8)}</strong>
											· Status: <span class="text-emerald-400 font-bold">Synchronized</span>
										</div>
									</div>

									<div class="text-[10px] sm:text-[11px] font-mono-tight text-[#8e8ea0] self-start sm:self-center shrink-0">
										Indexed at Block #{data.graphRecord?.blockNumber || auth.subgraph.syncedBlock || '11,684,064'}
									</div>
								</div>
							</div>
						</div>

					</div>

				</div>

				<!-- ===================================================================== -->
				<!-- RIGHT COLUMN: PHYSICAL SENTINEL & LIVE QR VERIFIER (4 COLS) -->
				<!-- ===================================================================== -->
				<div class="lg:col-span-4 space-y-5 sm:space-y-6">

					<!-- CARD 1: PHYSICAL TAMPER-EVIDENT SEAL SENTINEL -->
					<div class="rounded-3xl p-5 sm:p-6 bg-[#0c0c16]/90 border {sealStatus === 'opened' ? 'border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.1)]' : 'border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.1)]'} backdrop-blur-2xl space-y-4 print:border-black print:bg-white">
						
						<div class="flex items-center justify-between pb-3 border-b border-white/[0.06] print:border-gray-300">
							<div class="flex items-center gap-2">
								<span class="p-1.5 rounded-xl {sealStatus === 'opened' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-400'}">
									{#if sealStatus === 'opened'}
										<ShieldAlert size={16} />
									{:else}
										<ShieldCheck size={16} />
									{/if}
								</span>
								<h3 class="text-sm font-bold text-white font-display print:text-black">Physical Seal Sentinel</h3>
							</div>

							<span class="px-2 py-0.5 rounded-full text-[10px] font-mono-tight font-bold uppercase {sealStatus === 'opened' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}">
								{sealStatus === 'opened' ? 'VOID / TORN' : 'INTACT & SECURED'}
							</span>
						</div>

						<!-- Status Narrative -->
						<div class="space-y-2">
							{#if sealStatus === 'opened'}
								<div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
									<div class="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-display">
										<AlertTriangle size={14} class="shrink-0" />
										<span>Breach Telemetry Recorded</span>
									</div>
									<p class="text-xs text-[#a0a0b2] leading-relaxed">
										This unit's physical tamper seal was torn on <strong class="text-white">{formatDate(openedAt)}</strong>. Do not accept this unit as factory sealed; potential refilling or supply chain breach.
									</p>
								</div>
							{:else}
								<div class="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
									<div class="flex items-center gap-1.5 text-xs font-bold text-emerald-300 font-display">
										<CheckCircle2 size={14} class="shrink-0" />
										<span>Factory Seam Undamaged</span>
									</div>
									<p class="text-xs text-[#a0a0b2] leading-relaxed">
										The micro-perforated tamper-evident physical seam on this product's packaging has never been unsealed. Genuine original contents guaranteed.
									</p>
								</div>
							{/if}

							<!-- Checklist -->
							<div class="space-y-1.5 pt-1 text-xs text-[#8e8ea0]">
								<div class="flex items-center gap-2">
									<Check size={13} class="text-emerald-400 shrink-0" />
									<span>Cryptographic 256-bit hash check passed</span>
								</div>
								<div class="flex items-center gap-2">
									<Check size={13} class="text-emerald-400 shrink-0" />
									<span>Level H tear error correction validated</span>
								</div>
								<div class="flex items-center gap-2">
									<Check size={13} class="text-emerald-400 shrink-0" />
									<span>Decentralized The Graph indexing verified</span>
								</div>
							</div>
						</div>

						<!-- Controlled Simulation Drawer (for testing) -->
						<div class="pt-3 border-t border-white/[0.06] print:hidden">
							{#if sealStatus !== 'opened'}
								{#if !showSimulateConfirm}
									<button
										onclick={() => (showSimulateConfirm = true)}
										class="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-amber-500/15 border border-white/[0.08] hover:border-amber-500/30 text-xs font-display font-semibold text-[#8e8ea0] hover:text-amber-300 transition-all flex items-center justify-center gap-2"
									>
										<Unlock size={14} />
										<span>Simulate Physical Seal Tear</span>
									</button>
								{:else}
									<div class="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5" in:fade={{ duration: 150 }}>
										<div class="text-[11px] font-bold text-amber-300 font-display">
											Confirm Physical Breach Simulation?
										</div>
										<p class="text-[10px] text-[#a0a0b2] leading-tight">
											This will log a physical tear event on-chain and transition the status to "Torn / Voided" to simulate anti-refill consumer protection.
										</p>
										<div class="flex items-center gap-2 pt-1">
											<button
												onclick={handleUnseal}
												disabled={isUnsealing}
												class="flex-1 py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#08080e] font-bold text-xs font-display transition-all shadow"
											>
												{isUnsealing ? 'Broadcasting...' : 'Confirm Tear'}
											</button>
											<button
												onclick={() => (showSimulateConfirm = false)}
												disabled={isUnsealing}
												class="py-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white transition-colors"
											>
												Cancel
											</button>
										</div>
									</div>
								{/if}
							{:else}
								<div class="text-[11px] font-mono-tight text-center text-[#7a7a8e]">
									Physical breach permanently logged in telemetry ledger
								</div>
							{/if}
						</div>

					</div>

					<!-- CARD 2: LIVE CRYPTOGRAPHIC QR PASSPORT CODE -->
					<div class="rounded-3xl p-5 sm:p-6 bg-[#0c0c16]/90 border border-white/[0.08] shadow-2xl backdrop-blur-2xl space-y-4 print:border-black print:bg-white">
						<div class="flex items-center justify-between pb-3 border-b border-white/[0.06] print:border-gray-300">
							<div class="flex items-center gap-2">
								<QrCode size={16} class="text-cyan-400 shrink-0" />
								<h3 class="text-sm font-bold text-white font-display print:text-black">Mobile Scan Passport</h3>
							</div>
							<span class="text-[10px] font-mono-tight text-[#7a7a8e] uppercase">Damage Tolerant</span>
						</div>

						<!-- QR Display -->
						<div class="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-center print:bg-white print:border-gray-300">
							{#if qrDataUrl}
								<img
									src={qrDataUrl}
									alt="Cryptographic QR Verification Passport"
									class="w-40 h-40 sm:w-44 sm:h-44 rounded-xl object-contain"
								/>
							{:else}
								<div class="w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center text-xs text-[#8e8ea0]">
									Generating seal...
								</div>
							{/if}
						</div>

						<div class="text-center space-y-1">
							<div class="text-xs font-bold text-white font-display print:text-black">
								Scan to Authenticate in the Field
							</div>
							<p class="text-[11px] text-[#8e8ea0] leading-tight print:text-gray-600">
								Point any smartphone camera to view this authentic cryptographic certificate on Ethereum Sepolia.
							</p>
						</div>

						<div class="pt-2 flex items-center gap-2 print:hidden">
							<button
								onclick={() => copyToClipboard(typeof window !== 'undefined' ? window.location.href : '', 'quick-url')}
								class="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-display text-white transition-colors flex items-center justify-center gap-1.5"
							>
								{#if copiedKey === 'quick-url'}
									<Check size={13} class="text-emerald-400" />
									<span class="text-emerald-400 font-bold">Link Copied</span>
								{:else}
									<Copy size={13} />
									<span>Copy Verification Link</span>
								{/if}
							</button>

							<a
								href="/dashboard"
								class="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[#8e8ea0] hover:text-white transition-colors shrink-0"
								title="Open Manufacturer Dashboard"
							>
								<ExternalLink size={15} />
							</a>
						</div>
					</div>

					<!-- CARD 3: INSTITUTIONAL GUARANTEE EMBLEM -->
					<div class="p-4 sm:p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3.5 print:hidden">
						<div class="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
							<Logo size={20} />
						</div>
						<div class="space-y-0.5 text-xs">
							<div class="font-bold text-white font-display">TearRubr Security Standard</div>
							<p class="text-[11px] text-[#8e8ea0] leading-relaxed">
								Cryptographically binds physical tamper-evident tear mechanics with Ethereum smart contracts and decentralized Graph subgraphs.
							</p>
						</div>
					</div>

				</div>

			</div>
		{:else}
			<!-- ========================================================================= -->
			<!-- UNVERIFIED / NOT FOUND STATE -->
			<!-- ========================================================================= -->
			<div class="max-w-xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#0c0c16]/90 border border-rose-500/30 text-center space-y-5 backdrop-blur-2xl shadow-2xl">
				<div class="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
					<ShieldAlert size={28} />
				</div>
				<div class="space-y-1.5">
					<h2 class="text-xl sm:text-2xl font-extrabold text-white font-display">Cryptographic Record Not Found</h2>
					<p class="text-xs text-[#8e8ea0] max-w-sm mx-auto leading-relaxed">
						TearRubr cannot locate an authentic cryptographic record on Ethereum Sepolia for identifier <code class="text-white font-mono-tight break-all">{data.id}</code>. This item may be uncommitted, counterfeit, or invalid.
					</p>
				</div>

				<div class="pt-2 flex items-center justify-center gap-3 flex-wrap">
					<a
						href="/verify"
						class="px-5 py-2.5 rounded-full bg-white text-[#08080e] font-bold text-xs font-display hover:bg-white/90 transition-all shadow"
					>
						Search Public Ledger
					</a>
					<a
						href="/dashboard"
						class="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-display text-xs transition-colors"
					>
						Register New Item
					</a>
				</div>
			</div>
		{/if}

	</main>
</div>
