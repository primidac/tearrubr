<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import Logo from '$lib/components/Logo.svelte';
	import {
		QrCode,
		Download,
		Printer,
		Check,
		Copy,
		Sparkles,
		ShieldCheck,
		ShieldAlert,
		Lock,
		ExternalLink,
		Settings2,
		Palette,
		RefreshCw
	} from '@lucide/svelte';

	interface ProductRecord {
		id: string;
		name: string;
		manufacturer: string;
		batchNumber?: string | null;
		serialIndex?: number | null;
		blockchainTxHash?: string | null;
	}

	interface BatchRecord {
		id: string;
		batchNumber: string;
		productName: string;
		manufacturer: string;
		quantity: number;
		merkleRoot: string;
	}

	let {
		products = [],
		batches = [],
		initialProductId = null
	}: {
		products: ProductRecord[];
		batches: BatchRecord[];
		initialProductId?: string | null;
	} = $props();

	// Creation mode: 'existing' product or 'custom'
	let mode = $state<'existing' | 'custom'>('existing');

	// Selected existing product ID
	let selectedProductId = $state<string>('');

	$effect(() => {
		if (initialProductId) {
			selectedProductId = initialProductId;
		} else if (!selectedProductId && products.length > 0) {
			selectedProductId = products[0].id;
		}
	});

	// Custom fields
	let customName = $state('Precision Ceramic Bearing 608-RS');
	let customManufacturer = $state('TearRubr Industrial Labs');
	let customBatch = $state('LOT-2026-IND-09');
	let customSerial = $state('01');
	let customCustomId = $state('tr-sec-' + Math.random().toString(36).substring(2, 9));

	// Label customization settings
	let theme = $state<'dark' | 'print' | 'minimal'>('dark');
	let showWarning = $state(true);
	let showChainBadge = $state(true);
	let showBatchLot = $state(true);
	let qrErrorCorrection = $state<'M' | 'H'>('H'); // H = High (30% physical tear tolerance)

	// QR Render States
	let qrDataUrl = $state<string>('');
	let qrSvgString = $state<string>('');
	let isGenerating = $state(false);
	let copiedLink = $state(false);

	// Computed active product details
	let activeRecord = $derived.by(() => {
		if (mode === 'existing') {
			const found = products.find((p) => p.id === selectedProductId);
			if (found) {
				return {
					id: found.id,
					name: found.name,
					manufacturer: found.manufacturer,
					batchNumber: found.batchNumber || null,
					serialIndex: found.serialIndex || null,
					txHash: found.blockchainTxHash || null
				};
			}
		}
		return {
			id: customCustomId,
			name: customName,
			manufacturer: customManufacturer,
			batchNumber: customBatch,
			serialIndex: customSerial,
			txHash: null
		};
	});

	// Verification Target URL
	let targetUrl = $derived.by(() => {
		const base = typeof window !== 'undefined' ? window.location.origin : 'https://tearrubr.com';
		return `${base}/verify/${activeRecord.id}`;
	});

	// Regenerate QR whenever targetUrl or theme or errorCorrection changes
	$effect(() => {
		generateQr(targetUrl, theme, qrErrorCorrection);
	});

	async function generateQr(text: string, currentTheme: string, ecLevel: 'M' | 'H') {
		if (!text) return;
		isGenerating = true;

		try {
			const darkColor = currentTheme === 'dark' ? '#00f2fe' : '#0a0a14';
			const lightColor = currentTheme === 'dark' ? '#00000000' : '#ffffff';

			// High resolution PNG for packaging designers (1024px)
			qrDataUrl = await QRCode.toDataURL(text, {
				width: 1024,
				margin: 1,
				errorCorrectionLevel: ecLevel,
				color: {
					dark: darkColor,
					light: lightColor
				}
			});

			// Crisp SVG string for vector exports
			qrSvgString = await QRCode.toString(text, {
				type: 'svg',
				margin: 1,
				errorCorrectionLevel: ecLevel,
				color: {
					dark: darkColor,
					light: lightColor
				}
			});
		} catch (err) {
			console.error('QR generation error:', err);
		} finally {
			isGenerating = false;
		}
	}

	function downloadPng() {
		if (!qrDataUrl) return;
		const a = document.createElement('a');
		a.href = qrDataUrl;
		a.download = `tearrubr-seal-${activeRecord.id.slice(0, 8)}.png`;
		a.click();
	}

	function downloadSvg() {
		if (!qrSvgString) return;
		const blob = new Blob([qrSvgString], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `tearrubr-seal-${activeRecord.id.slice(0, 8)}.svg`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function copyTargetLink() {
		navigator.clipboard.writeText(targetUrl);
		copiedLink = true;
		setTimeout(() => (copiedLink = false), 2500);
	}

	function printSticker() {
		window.print();
	}
</script>

<div class="space-y-6">
	<!-- Studio Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-2xl">
		<div class="space-y-1">
			<div class="flex items-center gap-2">
				<span class="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
					<QrCode size={18} />
				</span>
				<h2 class="text-lg font-bold text-white font-display">Physical QR Seal Studio</h2>
			</div>
			<p class="text-xs text-[#8e8ea0] max-w-xl">
				Generate high-density, damage-tolerant QR stickers for physical packaging seams. Level H error correction ensures verification decodability even after partial tear.
			</p>
		</div>

		<!-- Action Pills -->
		<div class="flex items-center gap-2 self-start sm:self-center shrink-0">
			<button
				onclick={copyTargetLink}
				class="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-xs font-display text-white transition-colors flex items-center gap-1.5"
			>
				{#if copiedLink}
					<Check size={13} class="text-emerald-400" />
					<span class="text-emerald-400">Copied</span>
				{:else}
					<Copy size={13} />
					<span>Copy Link</span>
				{/if}
			</button>

			<button
				onclick={printSticker}
				class="px-3.5 py-1.5 rounded-lg bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all shadow flex items-center gap-1.5"
			>
				<Printer size={13} />
				<span>Print Label</span>
			</button>
		</div>
	</div>

	<!-- Studio Layout: 2 Columns (Controls on Left, Live Packaging Sticker on Right) -->
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
		
		<!-- ========================================================================= -->
		<!-- LEFT COLUMN: GENERATOR SETTINGS & DATA SELECTION (7 COLS) -->
		<!-- ========================================================================= -->
		<div class="lg:col-span-7 space-y-5">
			
			<!-- Card 1: Record Source Selector -->
			<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-4">
				<div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
					<div class="text-xs font-bold text-white font-display flex items-center gap-2">
						<Settings2 size={14} class="text-indigo-400" />
						<span>1. Select Product</span>
					</div>

					<!-- Mode Toggle Tabs -->
					<div class="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-display">
						<button
							onclick={() => (mode = 'existing')}
							class="px-2.5 py-1 rounded-md transition-colors {mode === 'existing' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
						>
							Products ({products.length})
						</button>
						<button
							onclick={() => (mode = 'custom')}
							class="px-2.5 py-1 rounded-md transition-colors {mode === 'custom' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
						>
							Custom Label
						</button>
					</div>
				</div>

				{#if mode === 'existing'}
					{#if products.length === 0}
						<div class="p-6 text-center text-xs text-[#8e8ea0] bg-white/[0.02] rounded-xl border border-white/[0.04]">
							No products registered in database yet. Switch to "Custom Label" or mint a new product.
						</div>
					{:else}
						<div class="space-y-2">
							<label for="product-select" class="block text-[11px] font-mono-tight text-[#8e8ea0] uppercase tracking-wider">
								Choose Registered Product
							</label>
							<select
								id="product-select"
								bind:value={selectedProductId}
								class="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-accent transition-colors font-display cursor-pointer"
							>
								{#each products as prod}
									<option value={prod.id} class="bg-[#0c0c16] text-white">
										{prod.name} ({prod.manufacturer}) {prod.batchNumber ? `· LOT: ${prod.batchNumber}` : ''}
									</option>
								{/each}
							</select>

							<div class="pt-2 flex items-center justify-between text-[11px] font-mono-tight text-[#7a7a8e]">
								<span>On-Chain ID: <strong class="text-white">{activeRecord.id.slice(0, 16)}…</strong></span>
								<a href="/verify/{activeRecord.id}" target="_blank" class="text-accent hover:underline flex items-center gap-1">
									<span>Open Ledger Proof</span>
									<ExternalLink size={10} />
								</a>
							</div>
						</div>
					{/if}
				{:else}
					<!-- Custom Form Inputs -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
						<div class="space-y-1">
							<label for="custom-name" class="text-[11px] font-mono-tight text-[#8e8ea0]">Product Name</label>
							<input
								id="custom-name"
								type="text"
								bind:value={customName}
								class="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent"
							/>
						</div>

						<div class="space-y-1">
							<label for="custom-mfg" class="text-[11px] font-mono-tight text-[#8e8ea0]">Manufacturer / Issuer</label>
							<input
								id="custom-mfg"
								type="text"
								bind:value={customManufacturer}
								class="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent"
							/>
						</div>

						<div class="space-y-1">
							<label for="custom-lot" class="text-[11px] font-mono-tight text-[#8e8ea0]">Batch / LOT Number</label>
							<input
								id="custom-lot"
								type="text"
								bind:value={customBatch}
								class="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent font-mono-tight"
							/>
						</div>

						<div class="space-y-1">
							<label for="custom-serial" class="text-[11px] font-mono-tight text-[#8e8ea0]">Serial / Index</label>
							<input
								id="custom-serial"
								type="text"
								bind:value={customSerial}
								class="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-accent font-mono-tight"
							/>
						</div>
					</div>
				{/if}
			</div>

			<!-- Card 2: Packaging Label Style Customizer -->
			<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg space-y-4">
				<div class="flex items-center justify-between border-b border-white/[0.06] pb-3">
					<div class="text-xs font-bold text-white font-display flex items-center gap-2">
						<Palette size={14} class="text-cyan-400" />
						<span>2. Seal Label Style & Options</span>
					</div>
				</div>

				<!-- Preset Themes -->
				<div class="space-y-2">
					<span class="block text-[11px] font-mono-tight text-[#8e8ea0]">Label Preset</span>
					<div class="grid grid-cols-3 gap-2.5 text-xs font-display">
						<button
							onclick={() => (theme = 'dark')}
							class="p-3 rounded-xl border text-left transition-all {theme === 'dark' ? 'bg-indigo-500/15 border-indigo-500/40 text-white font-bold' : 'bg-white/[0.02] border-white/[0.06] text-[#8e8ea0] hover:text-white'}"
						>
							<div class="text-xs">Security Dark</div>
							<div class="text-[10px] text-[#7a7a8e] font-normal mt-0.5">Cyan Hologram</div>
						</button>

						<button
							onclick={() => (theme = 'print')}
							class="p-3 rounded-xl border text-left transition-all {theme === 'print' ? 'bg-white text-[#08080e] border-white font-bold shadow-md' : 'bg-white/[0.02] border-white/[0.06] text-[#8e8ea0] hover:text-white'}"
						>
							<div class="text-xs">Thermal Print</div>
							<div class="text-[10px] {theme === 'print' ? 'text-black/60' : 'text-[#7a7a8e]'} font-normal mt-0.5">High-Contrast B&W</div>
						</button>

						<button
							onclick={() => (theme = 'minimal')}
							class="p-3 rounded-xl border text-left transition-all {theme === 'minimal' ? 'bg-cyan-500/15 border-cyan-500/40 text-white font-bold' : 'bg-white/[0.02] border-white/[0.06] text-[#8e8ea0] hover:text-white'}"
						>
							<div class="text-xs">QR Raw Only</div>
							<div class="text-[10px] text-[#7a7a8e] font-normal mt-0.5">No Badge Borders</div>
						</button>
					</div>
				</div>

				<!-- Toggles -->
				<div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-display border-t border-white/[0.04]">
					<label class="flex items-center gap-2 cursor-pointer text-[#8e8ea0] hover:text-white">
						<input type="checkbox" bind:checked={showWarning} class="rounded border-white/20 bg-white/5 text-accent focus:ring-0" />
						<span>Show Tamper Tear Warning</span>
					</label>

					<label class="flex items-center gap-2 cursor-pointer text-[#8e8ea0] hover:text-white">
						<input type="checkbox" bind:checked={showChainBadge} class="rounded border-white/20 bg-white/5 text-accent focus:ring-0" />
						<span>Include On-Chain Verification Seal</span>
					</label>

					<label class="flex items-center gap-2 cursor-pointer text-[#8e8ea0] hover:text-white">
						<input type="checkbox" bind:checked={showBatchLot} class="rounded border-white/20 bg-white/5 text-accent focus:ring-0" />
						<span>Print LOT / Batch Number</span>
					</label>

					<div class="flex items-center justify-between text-[11px] font-mono-tight text-[#8e8ea0]">
						<span>Damage Tolerance:</span>
						<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
							Level H (30% Tear)
						</span>
					</div>
				</div>
			</div>

			<!-- Card 3: Download & Packaging Export Buttons -->
			<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-between gap-3">
				<div>
					<div class="text-xs font-bold text-white font-display">Export Print Assets</div>
					<div class="text-[11px] text-[#8e8ea0]">300 DPI vector and raster formats for industrial printing</div>
				</div>

				<div class="flex items-center gap-2">
					<button
						onclick={downloadPng}
						class="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-display text-white transition-colors flex items-center gap-1.5"
					>
						<Download size={13} />
						<span>Download PNG</span>
					</button>

					<button
						onclick={downloadSvg}
						class="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-display text-white transition-colors flex items-center gap-1.5"
					>
						<Download size={13} />
						<span>Download SVG</span>
					</button>
				</div>
			</div>

		</div>

		<!-- ========================================================================= -->
		<!-- RIGHT COLUMN: LIVE PHYSICAL PACKAGING STICKER PREVIEW (5 COLS) -->
		<!-- ========================================================================= -->
		<div class="lg:col-span-5 sticky top-24 space-y-4">
			
			<div class="flex items-center justify-between px-2">
				<span class="text-xs font-mono-tight uppercase tracking-wider text-[#7a7a8e] font-semibold">
					Physical Seal Sticker Mockup
				</span>
				<span class="text-[11px] font-mono-tight text-emerald-400">
					Live Preview · Ready to Affix
				</span>
			</div>

			<!-- PHYSICAL STICKER WRAPPER -->
			<div
				class="p-6 rounded-3xl transition-all duration-300 relative overflow-hidden shadow-2xl {theme === 'print' ? 'bg-white text-black border-4 border-black' : 'bg-[#0a0a14] text-white border border-white/[0.12]'} print:m-0 print:p-4 print:border-black"
			>
				<!-- Top Tamper Perforation Line (Simulates actual peel strip) -->
				<div class="border-b-2 border-dashed {theme === 'print' ? 'border-black/40' : 'border-white/20'} pb-3 mb-4 flex items-center justify-between text-[10px] font-mono-tight uppercase">
					<div class="flex items-center gap-1.5 font-bold">
						<Logo size={18} />
						<span>TearRubr Authenticity Seal</span>
					</div>
					{#if showChainBadge}
						<span class="px-1.5 py-0.5 rounded {theme === 'print' ? 'bg-black text-white' : 'bg-emerald-500/20 text-emerald-400'} text-[9px] font-bold">
							VERIFIED ON-CHAIN
						</span>
					{/if}
				</div>

				<!-- Middle: Product Details & QR Code -->
				<div class="space-y-4">
					<!-- Product Header Info -->
					<div class="space-y-0.5">
						<div class="text-base font-extrabold font-display leading-tight {theme === 'print' ? 'text-black' : 'text-white'}">
							{activeRecord.name}
						</div>
						<div class="text-xs {theme === 'print' ? 'text-black/70' : 'text-[#8e8ea0]'} font-display">
							{activeRecord.manufacturer}
						</div>
					</div>

					<!-- QR Code Canvas Display -->
					<div class="flex items-center justify-center p-4 rounded-2xl {theme === 'print' ? 'bg-white border-2 border-black' : 'bg-black/60 border border-white/[0.08] shadow-inner'}">
						{#if isGenerating}
							<div class="w-48 h-48 flex items-center justify-center text-xs text-[#8e8ea0]">
								<RefreshCw size={24} class="animate-spin text-accent" />
							</div>
						{:else if qrDataUrl}
							<img
								src={qrDataUrl}
								alt="TearRubr Product Cryptographic QR Verification Code"
								class="w-48 h-48 rounded-xl object-contain"
							/>
						{/if}
					</div>

					<!-- Batch & LOT Info -->
					{#if showBatchLot}
						<div class="p-2.5 rounded-xl {theme === 'print' ? 'bg-black/5 border border-black/20' : 'bg-white/[0.03] border border-white/[0.06]'} font-mono-tight text-[10px] space-y-1">
							<div class="flex items-center justify-between">
								<span class="{theme === 'print' ? 'text-black/70' : 'text-[#7a7a8e]'}">BATCH LOT:</span>
								<span class="font-bold">{activeRecord.batchNumber || 'SINGLE_UNIT'}</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="{theme === 'print' ? 'text-black/70' : 'text-[#7a7a8e]'}">SEAL ID:</span>
								<span class="font-bold">{activeRecord.id.slice(0, 16)}…</span>
							</div>
						</div>
					{/if}

					<!-- Tamper-Evident Warning Strip -->
					{#if showWarning}
						<div class="p-2.5 rounded-xl {theme === 'print' ? 'bg-black text-white' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'} flex items-center justify-center gap-1.5 font-mono-tight text-[9px] uppercase tracking-wider font-bold">
							<ShieldAlert size={12} class="shrink-0" />
							<span>DO NOT ACCEPT IF SEAL IS TORN OR BROKEN</span>
						</div>
					{/if}

					<!-- Scan Prompt -->
					<div class="text-center text-[10px] font-mono-tight {theme === 'print' ? 'text-black/60' : 'text-[#7a7a8e]'}">
						Scan with any smartphone camera to verify authenticity
					</div>
				</div>

				<!-- Bottom Tear Tab Notch Simulation -->
				<div class="mt-4 pt-2 border-t-2 border-dashed {theme === 'print' ? 'border-black/40 text-black/50' : 'border-white/20 text-white/30'} flex items-center justify-between text-[9px] font-mono-tight">
					<span>◀ PULL TAB TO BREAK CRYPTOGRAPHIC SEAL ▶</span>
					<span class="flex items-center gap-1">
						<Lock size={10} class="shrink-0" />
						<span>256-BIT</span>
					</span>
				</div>
			</div>

		</div>

	</div>
</div>
