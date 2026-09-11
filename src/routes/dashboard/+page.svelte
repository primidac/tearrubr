<script lang="ts">
	import { fade } from 'svelte/transition';
	import Logo from '$lib/components/Logo.svelte';
	import PrivyAuthModal from '$lib/components/PrivyAuthModal.svelte';
	import { auth } from '$lib/auth.svelte';
	import {
		ClipboardList,
		Boxes,
		ShieldAlert,
		ShieldCheck,
		Sparkles,
		Globe,
		ScrollText,
		Home,
		Menu,
		X,
		Plus,
		Search,
		Copy,
		Check,
		ExternalLink,
		ArrowRight,
		Activity,
		Layers,
		ChevronLeft,
		ChevronRight
	} from '@lucide/svelte';

	let { data } = $props();

	// Dashboard tab selection
	let activeView = $state<'products' | 'batches' | 'alerts'>('products');
	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'sealed' | 'opened'>('all');
	let isMobileSidebarOpen = $state(false);
	let copiedId = $state<string | null>(null);

	// Pagination state
	let currentPage = $state(1);
	let pageSize = $state(10);

	function formatDate(timestamp: Date | number) {
		const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp) * 1000);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function truncate(str: string, lead = 6, trail = 4) {
		if (!str) return '';
		return str.length > lead + trail ? `${str.slice(0, lead)}…${str.slice(-trail)}` : str;
	}

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedId = id;
		setTimeout(() => {
			if (copiedId === id) copiedId = null;
		}, 2000);
	}

	// Metrics
	let totalUnits = $derived(data.products.length);
	let batchRuns = $derived(data.batches?.length || 0);
	let intactSeals = $derived(data.products.filter((p) => p.sealStatus !== 'opened').length);
	let brokenSeals = $derived(data.products.filter((p) => p.sealStatus === 'opened').length);
	let intactRate = $derived(totalUnits > 0 ? Math.round((intactSeals / totalUnits) * 100) : 100);

	// Filtered Products
	let filteredProducts = $derived(
		data.products.filter((p) => {
			if (statusFilter === 'sealed' && p.sealStatus === 'opened') return false;
			if (statusFilter === 'opened' && p.sealStatus !== 'opened') return false;

			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase().trim();
			return (
				p.name.toLowerCase().includes(q) ||
				p.manufacturer.toLowerCase().includes(q) ||
				p.id.toLowerCase().includes(q) ||
				(p.batchNumber && p.batchNumber.toLowerCase().includes(q)) ||
				(p.blockchainTxHash && p.blockchainTxHash.toLowerCase().includes(q))
			);
		})
	);

	// Filtered Batches
	let filteredBatches = $derived(
		(data.batches || []).filter((b) => {
			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase().trim();
			return (
				b.batchNumber.toLowerCase().includes(q) ||
				b.productName.toLowerCase().includes(q) ||
				b.manufacturer.toLowerCase().includes(q) ||
				b.merkleRoot.toLowerCase().includes(q)
			);
		})
	);

	// Tamper Alerts
	let tamperedProducts = $derived(
		data.products.filter((p) => p.sealStatus === 'opened')
	);

	// Active list based on activeView
	let currentList = $derived(
		activeView === 'products'
			? filteredProducts
			: activeView === 'batches'
				? filteredBatches
				: tamperedProducts
	);

	// Auto-reset page when filters, query, tab, or page size change
	$effect(() => {
		searchQuery;
		statusFilter;
		activeView;
		pageSize;
		currentPage = 1;
	});

	let totalPages = $derived(Math.max(1, Math.ceil(currentList.length / pageSize)));

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
		}
	});

	let paginatedProducts = $derived(
		filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	let paginatedBatches = $derived(
		filteredBatches.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	let paginatedTampered = $derived(
		tamperedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	let startIndex = $derived(currentList.length === 0 ? 0 : (currentPage - 1) * pageSize + 1);
	let endIndex = $derived(Math.min(currentPage * pageSize, currentList.length));

	let visiblePages = $derived.by(() => {
		const pages: (number | string)[] = [];
		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);
			if (currentPage > 3) pages.push('...');
			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);
			for (let i = start; i <= end; i++) pages.push(i);
			if (currentPage < totalPages - 2) pages.push('...');
			pages.push(totalPages);
		}
		return pages;
	});

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages) {
			currentPage = p;
		}
	}
</script>

<svelte:head>
	<title>Manufacturer Workspace | TearRubr</title>
	<meta
		name="description"
		content="Enterprise manufacturer dashboard for Ethereum Sepolia batch minting, Merkle proof auditing, and physical seal telemetry."
	/>
</svelte:head>

<!-- Actual Dashboard Shell (No floating landing navbar) -->
<div class="min-h-screen bg-[#06060a] text-text-primary flex flex-col lg:flex-row selection:bg-indigo-500/20 antialiased font-sans">
	
	<!-- ========================================================================= -->
	<!-- 1. PERSISTENT SIDEBAR (DESKTOP & MOBILE DRAWER) -->
	<!-- ========================================================================= -->
	
	<!-- Mobile Drawer Backdrop -->
	{#if isMobileSidebarOpen}
		<button
			type="button"
			class="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden cursor-default w-full h-full border-none"
			onclick={() => (isMobileSidebarOpen = false)}
			aria-label="Close navigation sidebar"
			transition:fade={{ duration: 150 }}
		></button>
	{/if}

	<aside
		class="fixed lg:sticky top-0 left-0 bottom-0 z-50 w-72 bg-[#090912] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 {isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shrink-0 h-screen overflow-y-auto"
	>
		<!-- Sidebar Top: Brand & Workspace -->
		<div>
			<!-- Logo Header -->
			<div class="p-6 border-b border-white/[0.06] flex items-center justify-between">
				<a href="/" class="flex items-center gap-3 group">
					<Logo size={28} />
					<div>
						<div class="text-sm font-extrabold text-white font-display tracking-tight flex items-center gap-1.5">
							<span>TearRubr</span>
							<span class="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-mono-tight">PRO</span>
						</div>
						<div class="text-[10px] text-[#7a7a8e] font-mono-tight">Vault Console</div>
					</div>
				</a>

				<!-- Close on mobile -->
				<button
					onclick={() => (isMobileSidebarOpen = false)}
					class="lg:hidden text-[#8e8ea0] hover:text-white p-1 rounded-lg transition-colors"
					aria-label="Close menu"
				>
					<X size={18} />
				</button>
			</div>

			<!-- Workspace Selector Badge -->
			<div class="px-4 py-3 border-b border-white/[0.04]">
				<div class="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
					<div class="flex items-center gap-2 min-w-0">
						<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
						<span class="font-medium text-white truncate">Sepolia Network</span>
					</div>
					<span class="text-[10px] font-mono-tight text-[#8e8ea0]">11155111</span>
				</div>
			</div>

			<!-- Navigation Links -->
			<nav class="p-3 space-y-1 text-xs font-display">
				<div class="px-3 pt-3 pb-1 text-[10px] font-mono-tight uppercase tracking-wider text-[#606074] font-semibold">
					Workspace
				</div>

				<button
					onclick={() => {
						activeView = 'products';
						isMobileSidebarOpen = false;
					}}
					class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all {activeView === 'products' ? 'bg-white text-[#08080e] font-bold shadow-md' : 'text-[#8e8ea0] hover:text-white hover:bg-white/[0.04]'}"
				>
					<div class="flex items-center gap-2.5">
						<ClipboardList size={16} class={activeView === 'products' ? 'text-[#08080e]' : 'text-indigo-400'} />
						<span>All Authenticity Records</span>
					</div>
					<span class="text-[11px] font-mono-tight {activeView === 'products' ? 'text-[#08080e]' : 'text-[#606074]'}">
						{totalUnits}
					</span>
				</button>

				<button
					onclick={() => {
						activeView = 'batches';
						isMobileSidebarOpen = false;
					}}
					class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all {activeView === 'batches' ? 'bg-white text-[#08080e] font-bold shadow-md' : 'text-[#8e8ea0] hover:text-white hover:bg-white/[0.04]'}"
				>
					<div class="flex items-center gap-2.5">
						<Boxes size={16} class={activeView === 'batches' ? 'text-[#08080e]' : 'text-cyan-400'} />
						<span>Batch Merkle Runs</span>
					</div>
					<span class="text-[11px] font-mono-tight {activeView === 'batches' ? 'text-[#08080e]' : 'text-[#606074]'}">
						{batchRuns}
					</span>
				</button>

				<button
					onclick={() => {
						activeView = 'alerts';
						isMobileSidebarOpen = false;
					}}
					class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all {activeView === 'alerts' ? 'bg-amber-400 text-[#08080e] font-bold shadow-md' : 'text-[#8e8ea0] hover:text-white hover:bg-white/[0.04]'}"
				>
					<div class="flex items-center gap-2.5">
						<ShieldAlert size={16} class={activeView === 'alerts' ? 'text-[#08080e]' : 'text-amber-400'} />
						<span>Seal Breach Telemetry</span>
					</div>
					{#if brokenSeals > 0}
						<span class="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono-tight font-bold">
							{brokenSeals}
						</span>
					{:else}
						<span class="text-[10px] text-emerald-400 font-mono-tight">0</span>
					{/if}
				</button>

				<div class="px-3 pt-5 pb-1 text-[10px] font-mono-tight uppercase tracking-wider text-[#606074] font-semibold">
					Actions & Explorer
				</div>

				<a
					href="/register"
					class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-indigo-300 hover:text-white hover:bg-indigo-500/10 transition-colors"
				>
					<Sparkles size={16} class="text-indigo-400" />
					<span>+ New Batch Rollup</span>
				</a>

				<a
					href="/verify"
					class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#8e8ea0] hover:text-white hover:bg-white/[0.04] transition-colors"
				>
					<Globe size={16} class="text-cyan-400" />
					<span>Public Ledger</span>
				</a>

				<a
					href="https://sepolia.etherscan.io/address/{data.contractAddress}"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-between px-3 py-2.5 rounded-xl text-[#8e8ea0] hover:text-white hover:bg-white/[0.04] transition-colors"
				>
					<div class="flex items-center gap-2.5">
						<ScrollText size={16} class="text-emerald-400" />
						<span>Sepolia Contract</span>
					</div>
					<ExternalLink size={12} class="text-[#606074]" />
				</a>

				<a
					href="/"
					class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[#8e8ea0] hover:text-white hover:bg-white/[0.04] transition-colors"
				>
					<Home size={16} class="text-[#8e8ea0]" />
					<span>Back to Home</span>
				</a>
			</nav>
		</div>

		<!-- Sidebar Bottom: Wallet Identity Widget -->
		<div class="p-4 border-t border-white/[0.06] bg-[#07070d]">
			{#if auth.session.isConnected}
				<div class="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<span class="w-2 h-2 rounded-full {auth.session.isOwner || auth.session.isVerifiedManufacturer ? 'bg-emerald-400' : 'bg-indigo-400'}"></span>
							<span class="text-xs font-bold text-white font-mono-tight">
								{auth.session.ensName || truncate(auth.session.walletAddress || '', 6, 4)}
							</span>
						</div>
						<button
							onclick={() => auth.disconnect()}
							class="text-[10px] text-[#7a7a8e] hover:text-red-400 transition-colors font-display"
							title="Disconnect Wallet"
						>
							Disconnect
						</button>
					</div>

					<div class="text-[10px] font-mono-tight text-[#8e8ea0]">
						{#if auth.session.isOwner}
							<span class="text-emerald-400 font-semibold">✓ Contract Owner</span>
						{:else if auth.session.isVerifiedManufacturer}
							<span class="text-emerald-400 font-semibold">✓ Whitelisted Manufacturer</span>
						{:else}
							<span class="text-[#8e8ea0]">Community Wallet</span>
						{/if}
					</div>

					<button
						onclick={() => auth.openModal()}
						class="w-full py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-[11px] font-display transition-colors flex items-center justify-center gap-1.5"
					>
						<span>Switch Account</span>
						<ExternalLink size={12} />
					</button>
				</div>
			{:else}
				<div class="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-center space-y-2">
					<div class="text-xs font-semibold text-white font-display">Wallet Disconnected</div>
					<p class="text-[10px] text-[#7a7a8e] leading-relaxed">
						Connect Web3 wallet to verify your on-chain manufacturer credentials.
					</p>
					<button
						onclick={() => auth.openModal()}
						class="w-full py-2 rounded-xl bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all shadow-sm"
					>
						Connect Wallet
					</button>
				</div>
			{/if}
		</div>
	</aside>

	<!-- ========================================================================= -->
	<!-- 2. MAIN DASHBOARD CONTENT AREA & COMMAND HEADER -->
	<!-- ========================================================================= -->
	<div class="flex-1 flex flex-col min-w-0">
		
		<!-- Dashboard Topbar Header -->
		<header class="h-16 border-b border-white/[0.08] bg-[#090912]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
			<!-- Left: Mobile Toggle & Breadcrumbs -->
			<div class="flex items-center gap-3 sm:gap-4 min-w-0">
				<button
					onclick={() => (isMobileSidebarOpen = true)}
					class="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs hover:bg-white/10 transition-colors"
					aria-label="Open navigation drawer"
				>
					<Menu size={16} />
				</button>

				<div class="flex items-center gap-2 text-xs font-display">
					<span class="text-[#7a7a8e] hidden sm:inline">Manufacturer Workspace</span>
					<span class="text-white/20 hidden sm:inline">/</span>
					<span class="text-white font-bold truncate">
						{activeView === 'products' ? 'Authenticity Ledger' : activeView === 'batches' ? 'Batch Rollups' : 'Tamper Telemetry'}
					</span>
				</div>
			</div>

			<!-- Right: Live Node Status & Action Button -->
			<div class="flex items-center gap-3">
				<!-- Live Sepolia Block Status Badge -->
				<div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono-tight text-[#8e8ea0]">
					<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
					<span>Sepolia #{auth.chainStatus.blockNumber ? auth.chainStatus.blockNumber.toLocaleString() : '11,684,064'}</span>
				</div>

				<a
					href="/register"
					class="px-4 py-1.5 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all shadow-md flex items-center gap-1.5 shrink-0"
				>
					<Plus size={14} />
					<span>New Batch</span>
				</a>
			</div>
		</header>

		<!-- Main Dashboard Canvas -->
		<main class="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
			
			<!-- Atmospheric Glow Background Accents -->
			<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
				<div class="absolute top-20 right-20 w-[450px] h-[450px] rounded-full bg-[#6366f1]/10 blur-[140px]"></div>
				<div class="absolute bottom-20 left-40 w-[450px] h-[450px] rounded-full bg-[#10b981]/10 blur-[140px]"></div>
			</div>

			<!-- Metrics Row (4 Cards) -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
				<!-- Card 1: Total Units -->
				<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg relative overflow-hidden">
					<div class="flex items-center justify-between text-xs text-[#8e8ea0] mb-2 font-display">
						<div class="flex items-center gap-1.5">
							<Layers size={14} class="text-indigo-400" />
							<span>Units Minted</span>
						</div>
						<span class="text-emerald-400 font-mono-tight text-[10px]">On-Chain ✓</span>
					</div>
					<div class="text-3xl font-extrabold text-white font-display">
						{totalUnits}
					</div>
					<div class="text-[11px] text-[#7a7a8e] mt-1.5 font-mono-tight">
						Indexed on Ethereum Sepolia
					</div>
				</div>

				<!-- Card 2: Batch Runs -->
				<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg relative overflow-hidden">
					<div class="flex items-center justify-between text-xs text-[#8e8ea0] mb-2 font-display">
						<div class="flex items-center gap-1.5">
							<Boxes size={14} class="text-cyan-400" />
							<span>Merkle Batches</span>
						</div>
						<span class="text-indigo-400 font-mono-tight text-[10px]">1 Tx / Batch</span>
					</div>
					<div class="text-3xl font-extrabold text-indigo-400 font-display">
						{batchRuns}
					</div>
					<div class="text-[11px] text-[#7a7a8e] mt-1.5 font-mono-tight">
						Industrial batch rollups
					</div>
				</div>

				<!-- Card 3: Seal Integrity -->
				<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg relative overflow-hidden">
					<div class="flex items-center justify-between text-xs text-[#8e8ea0] mb-2 font-display">
						<div class="flex items-center gap-1.5">
							<ShieldCheck size={14} class={brokenSeals === 0 ? 'text-emerald-400' : 'text-amber-400'} />
							<span>Seal Integrity Rate</span>
						</div>
						<span class="font-mono-tight text-[10px] {brokenSeals === 0 ? 'text-emerald-400' : 'text-amber-400'}">
							{brokenSeals === 0 ? 'Zero Breaches' : `${brokenSeals} Opened`}
						</span>
					</div>
					<div class="text-3xl font-extrabold {intactRate === 100 ? 'text-emerald-400' : 'text-white'} font-display">
						{intactRate}%
					</div>
					<div class="text-[11px] text-[#7a7a8e] mt-1.5 font-mono-tight">
						{intactSeals} of {totalUnits} physical seals intact
					</div>
				</div>

				<!-- Card 4: Smart Contract Status -->
				<div class="p-5 rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg relative overflow-hidden">
					<div class="flex items-center justify-between text-xs text-[#8e8ea0] mb-2 font-display">
						<div class="flex items-center gap-1.5">
							<Activity size={14} class="text-accent" />
							<span>Contract Authority</span>
						</div>
						<span class="text-accent font-mono-tight text-[10px]">Active</span>
					</div>
					<div class="text-sm font-bold text-white font-mono-tight mt-1 truncate">
						{truncate(data.contractAddress, 8, 6)}
					</div>
					<div class="text-[11px] text-accent mt-2 font-display">
						<a
							href="{data.explorerBaseUrl}/address/{data.contractAddress}"
							target="_blank"
							rel="noopener noreferrer"
							class="hover:underline flex items-center gap-1"
						>
							<span>View on Sepolia Etherscan</span>
							<ExternalLink size={12} />
						</a>
					</div>
				</div>
			</div>

			<!-- Filter Bar & Search Controls -->
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 relative z-10">
				<!-- Search input -->
				<div class="relative flex-1 max-w-md">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search by product, lot number, or transaction hash..."
						class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] text-xs text-white placeholder-[#606074] focus:outline-none focus:border-accent transition-all"
					/>
					<Search size={14} class="absolute left-3 top-3 text-[#606074]" />
				</div>

				<!-- View tabs -->
				<div class="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-display self-start sm:self-auto">
					<button
						onclick={() => (activeView = 'products')}
						class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 {activeView === 'products' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
					>
						<ClipboardList size={13} />
						<span>Products ({data.products.length})</span>
					</button>
					<button
						onclick={() => (activeView = 'batches')}
						class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 {activeView === 'batches' ? 'bg-white text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
					>
						<Boxes size={13} />
						<span>Batches ({data.batches?.length || 0})</span>
					</button>
					<button
						onclick={() => (activeView = 'alerts')}
						class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 {activeView === 'alerts' ? 'bg-amber-400 text-[#08080e] font-bold shadow' : 'text-[#8e8ea0] hover:text-white'}"
					>
						<ShieldAlert size={13} />
						<span>Breaches ({brokenSeals})</span>
					</button>
				</div>
			</div>

			<!-- ================================================================= -->
			<!-- VIEW 1: AUTHENTICITY PRODUCTS TABLE -->
			<!-- ================================================================= -->
			{#if activeView === 'products'}
				<div class="rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-2xl shadow-xl overflow-hidden relative z-10" in:fade={{ duration: 150 }}>
					<div class="p-5 border-b border-white/[0.06] flex items-center justify-between">
						<div>
							<h2 class="text-sm font-bold text-white font-display">Authenticity Registry</h2>
							<p class="text-xs text-[#8e8ea0] mt-0.5">Direct records anchored on Ethereum Sepolia</p>
						</div>
						<div class="flex items-center gap-2">
							<button
								onclick={() => (statusFilter = 'all')}
								class="px-2.5 py-1 rounded-lg text-[11px] font-mono-tight transition-colors {statusFilter === 'all' ? 'bg-white/10 text-white font-bold' : 'text-[#7a7a8e] hover:text-white'}"
							>
								All ({data.products.length})
							</button>
							<button
								onclick={() => (statusFilter = 'sealed')}
								class="px-2.5 py-1 rounded-lg text-[11px] font-mono-tight transition-colors {statusFilter === 'sealed' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-[#7a7a8e] hover:text-white'}"
							>
								Sealed ({intactSeals})
							</button>
							<button
								onclick={() => (statusFilter = 'opened')}
								class="px-2.5 py-1 rounded-lg text-[11px] font-mono-tight transition-colors {statusFilter === 'opened' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-[#7a7a8e] hover:text-white'}"
							>
								Torn ({brokenSeals})
							</button>
						</div>
					</div>

					{#if filteredProducts.length === 0}
						<div class="p-12 text-center text-xs text-[#8e8ea0]">
							No products found matching your search.
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-xs text-left">
								<thead class="border-b border-white/[0.06] text-[#7a7a8e] uppercase font-mono-tight text-[10px] bg-white/[0.01]">
									<tr>
										<th class="px-5 py-3">Product Name & Issuer</th>
										<th class="px-5 py-3">Batch / LOT</th>
										<th class="px-5 py-3">Unique ID</th>
										<th class="px-5 py-3">Seal Status</th>
										<th class="px-5 py-3">Sepolia Tx</th>
										<th class="px-5 py-3 text-right">Action</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-white/[0.04]">
									{#each paginatedProducts as product}
										<tr class="hover:bg-white/[0.02] transition-colors">
											<td class="px-5 py-3.5 font-medium text-white">
												<div class="font-bold text-sm text-white font-display">{product.name}</div>
												<div class="text-[11px] text-[#8e8ea0]">{product.manufacturer}</div>
											</td>
											<td class="px-5 py-3.5 font-mono-tight">
												{#if product.batchNumber}
													<span class="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-[11px]">
														LOT: {product.batchNumber} (#{product.serialIndex}/{product.batchQuantity})
													</span>
												{:else}
													<span class="text-[#7a7a8e]">Single Item</span>
												{/if}
											</td>
											<td class="px-5 py-3.5 font-mono-tight text-[#8e8ea0]">
												<button
													onclick={() => copyToClipboard(product.id, product.id)}
													class="hover:text-white transition-colors flex items-center gap-1"
													title="Click to copy ID"
												>
													<span>{truncate(product.id, 8, 4)}</span>
													{#if copiedId === product.id}
														<Check size={11} class="text-emerald-400" />
													{:else}
														<Copy size={11} class="text-[#606074]" />
													{/if}
												</button>
											</td>
											<td class="px-5 py-3.5">
												<span class="px-2 py-0.5 rounded-full text-[10px] font-mono-tight {product.sealStatus === 'opened' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}">
													{product.sealStatus === 'opened' ? 'Torn / Broken' : 'Seal: Intact'}
												</span>
											</td>
											<td class="px-5 py-3.5 font-mono-tight">
												{#if product.blockchainTxHash}
													<a
														href="{data.explorerBaseUrl}/tx/{product.blockchainTxHash}"
														target="_blank"
														rel="noopener noreferrer"
														class="text-accent hover:underline flex items-center gap-1"
													>
														<span>{truncate(product.blockchainTxHash, 6, 4)}</span>
														<ExternalLink size={10} />
													</a>
												{:else}
													<span class="text-[#606074]">—</span>
												{/if}
											</td>
											<td class="px-5 py-3.5 text-right">
												<a
													href="/verify/{product.id}"
													class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-display text-xs transition-all inline-flex items-center gap-1"
												>
													<span>Verify Proof</span>
													<ArrowRight size={11} />
												</a>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Pagination Bar -->
						{#if filteredProducts.length > 0}
							<div class="px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
								<!-- Left: Counter & Page Size Selector -->
								<div class="flex items-center gap-4 text-[#8e8ea0] font-mono-tight">
									<div>
										Showing <span class="text-white font-semibold">{startIndex}</span>
										–
										<span class="text-white font-semibold">{endIndex}</span>
										of <span class="text-white font-semibold">{filteredProducts.length}</span> records
									</div>

									<div class="hidden sm:flex items-center gap-1.5 border-l border-white/[0.08] pl-4">
										<span>Rows:</span>
										{#each [10, 25, 50] as size}
											<button
												onclick={() => (pageSize = size)}
												class="px-2 py-0.5 rounded text-[11px] font-mono-tight transition-colors {pageSize === size ? 'bg-white text-[#08080e] font-bold shadow-sm' : 'text-[#7a7a8e] hover:text-white hover:bg-white/[0.05]'}"
											>
												{size}
											</button>
										{/each}
									</div>
								</div>

								<!-- Right: Page Controls -->
								{#if totalPages > 1}
									<div class="flex items-center gap-1.5 self-end sm:self-auto font-mono-tight">
										<button
											onclick={() => goToPage(currentPage - 1)}
											disabled={currentPage === 1}
											class="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
											aria-label="Previous page"
										>
											<ChevronLeft size={14} />
										</button>

										{#each visiblePages as p}
											{#if typeof p === 'number'}
												<button
													onclick={() => goToPage(p)}
													class="w-7 h-7 rounded-lg text-xs transition-all {currentPage === p ? 'bg-white text-[#08080e] font-bold shadow-md' : 'text-[#8e8ea0] hover:text-white hover:bg-white/[0.05]'}"
												>
													{p}
												</button>
											{:else}
												<span class="w-6 text-center text-[#606074]">…</span>
											{/if}
										{/each}

										<button
											onclick={() => goToPage(currentPage + 1)}
											disabled={currentPage === totalPages}
											class="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
											aria-label="Next page"
										>
											<ChevronRight size={14} />
										</button>
									</div>
								{/if}
							</div>
						{/if}
					{/if}
				</div>

			<!-- ================================================================= -->
			<!-- VIEW 2: BATCH MERKLE RUNS TABLE -->
			<!-- ================================================================= -->
			{:else if activeView === 'batches'}
				<div class="rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-2xl shadow-xl overflow-hidden relative z-10" in:fade={{ duration: 150 }}>
					<div class="p-5 border-b border-white/[0.06] flex items-center justify-between">
						<div>
							<h2 class="text-sm font-bold text-white font-display">Industrial Merkle Batch Rollups</h2>
							<p class="text-xs text-[#8e8ea0] mt-0.5">High-volume production runs committed in 1 single Ethereum transaction</p>
						</div>
						<a
							href="/register"
							class="px-3 py-1.5 rounded-full bg-white text-[#08080e] hover:bg-white/90 text-xs font-bold font-display flex items-center gap-1"
						>
							<Plus size={13} />
							<span>Mint New Batch</span>
						</a>
					</div>

					{#if filteredBatches.length === 0}
						<div class="p-12 text-center text-xs text-[#8e8ea0]">
							No batch runs registered yet. Click "+ Mint New Batch" to roll up your first industrial lot.
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-xs text-left">
								<thead class="border-b border-white/[0.06] text-[#7a7a8e] uppercase font-mono-tight text-[10px] bg-white/[0.01]">
									<tr>
										<th class="px-5 py-3">Batch LOT Number</th>
										<th class="px-5 py-3">Product Name & Manufacturer</th>
										<th class="px-5 py-3">Quantity</th>
										<th class="px-5 py-3">Merkle Root (On-Chain)</th>
										<th class="px-5 py-3">Sepolia Tx</th>
										<th class="px-5 py-3">Date Committed</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-white/[0.04]">
									{#each paginatedBatches as batch}
										<tr class="hover:bg-white/[0.02] transition-colors">
											<td class="px-5 py-3.5 font-bold font-mono-tight text-indigo-400">
												{batch.batchNumber}
											</td>
											<td class="px-5 py-3.5">
												<div class="font-bold text-white font-display">{batch.productName}</div>
												<div class="text-[11px] text-[#8e8ea0]">{batch.manufacturer}</div>
											</td>
											<td class="px-5 py-3.5 font-mono-tight text-white font-semibold">
												{batch.quantity.toLocaleString()} units
											</td>
											<td class="px-5 py-3.5 font-mono-tight text-[#8e8ea0]">
												<button
													onclick={() => copyToClipboard(batch.merkleRoot, batch.id)}
													class="hover:text-white transition-colors flex items-center gap-1"
													title="Copy Merkle Root"
												>
													<span>{truncate(batch.merkleRoot, 8, 6)}</span>
													{#if copiedId === batch.id}
														<Check size={11} class="text-emerald-400" />
													{:else}
														<Copy size={11} class="text-[#606074]" />
													{/if}
												</button>
											</td>
											<td class="px-5 py-3.5 font-mono-tight">
												{#if batch.blockchainTxHash}
													<a
														href="{data.explorerBaseUrl}/tx/{batch.blockchainTxHash}"
														target="_blank"
														rel="noopener noreferrer"
														class="text-accent hover:underline flex items-center gap-1"
													>
														<span>{truncate(batch.blockchainTxHash, 6, 4)}</span>
														<ExternalLink size={10} />
													</a>
												{:else}
													<span class="text-[#606074]">—</span>
												{/if}
											</td>
											<td class="px-5 py-3.5 text-[#8e8ea0]">
												{formatDate(batch.createdAt)}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Pagination Bar for Batches -->
						{#if filteredBatches.length > 0}
							<div class="px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
								<div class="flex items-center gap-4 text-[#8e8ea0] font-mono-tight">
									<div>
										Showing <span class="text-white font-semibold">{startIndex}</span>
										–
										<span class="text-white font-semibold">{endIndex}</span>
										of <span class="text-white font-semibold">{filteredBatches.length}</span> records
									</div>
								</div>

								{#if totalPages > 1}
									<div class="flex items-center gap-1.5 self-end sm:self-auto font-mono-tight">
										<button
											onclick={() => goToPage(currentPage - 1)}
											disabled={currentPage === 1}
											class="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
											aria-label="Previous page"
										>
											<ChevronLeft size={14} />
										</button>

										{#each visiblePages as p}
											{#if typeof p === 'number'}
												<button
													onclick={() => goToPage(p)}
													class="w-7 h-7 rounded-lg text-xs transition-all {currentPage === p ? 'bg-white text-[#08080e] font-bold shadow-md' : 'text-[#8e8ea0] hover:text-white hover:bg-white/[0.05]'}"
												>
													{p}
												</button>
											{:else}
												<span class="w-6 text-center text-[#606074]">…</span>
											{/if}
										{/each}

										<button
											onclick={() => goToPage(currentPage + 1)}
											disabled={currentPage === totalPages}
											class="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
											aria-label="Next page"
										>
											<ChevronRight size={14} />
										</button>
									</div>
								{/if}
							</div>
						{/if}
					{/if}
				</div>

			<!-- ================================================================= -->
			<!-- VIEW 3: PHYSICAL SEAL BREACH TELEMETRY -->
			<!-- ================================================================= -->
			{:else}
				<div class="rounded-2xl bg-[#0c0c16]/90 border border-white/[0.08] backdrop-blur-2xl shadow-xl overflow-hidden relative z-10" in:fade={{ duration: 150 }}>
					<div class="p-5 border-b border-white/[0.06] flex items-center justify-between">
						<div>
							<h2 class="text-sm font-bold text-amber-300 font-display flex items-center gap-2">
								<ShieldAlert size={16} class="text-amber-400" />
								<span>Physical Tamper-Evident Seal Breaches</span>
							</h2>
							<p class="text-xs text-[#8e8ea0] mt-0.5">Products whose physical tear seals have been broken in the field</p>
						</div>
						<span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono-tight border border-amber-500/20">
							{tamperedProducts.length} Breaches
						</span>
					</div>

					{#if tamperedProducts.length === 0}
						<div class="p-12 text-center text-xs text-[#8e8ea0]">
							<div class="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
								<ShieldCheck size={22} />
							</div>
							<div class="text-white font-bold font-display text-sm">Zero Physical Breaches Detected</div>
							<div class="mt-1">All {totalUnits} registered product seals remain intact and unopened.</div>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<table class="w-full text-xs text-left">
								<thead class="border-b border-white/[0.06] text-[#7a7a8e] uppercase font-mono-tight text-[10px] bg-white/[0.01]">
									<tr>
										<th class="px-5 py-3">Product Name</th>
										<th class="px-5 py-3">LOT / Serial</th>
										<th class="px-5 py-3">Unique ID</th>
										<th class="px-5 py-3">Torn / Unsealed At</th>
										<th class="px-5 py-3 text-right">Audit</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-white/[0.04]">
									{#each paginatedTampered as item}
										<tr class="hover:bg-white/[0.02] transition-colors">
											<td class="px-5 py-3.5 font-bold text-white font-display">
												{item.name}
											</td>
											<td class="px-5 py-3.5 font-mono-tight text-amber-300">
												{item.batchNumber ? `LOT: ${item.batchNumber} (#${item.serialIndex})` : 'Single Item'}
											</td>
											<td class="px-5 py-3.5 font-mono-tight text-[#8e8ea0]">
												{truncate(item.id, 8, 4)}
											</td>
											<td class="px-5 py-3.5 font-mono-tight text-amber-300">
												{item.openedAt ? formatDate(item.openedAt) : 'Logged on-chain'}
											</td>
											<td class="px-5 py-3.5 text-right">
												<a
													href="/verify/{item.id}"
													class="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-display text-xs transition-all inline-flex items-center gap-1"
												>
													<span>View Telemetry</span>
													<ArrowRight size={11} />
												</a>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Pagination Bar for Breaches -->
						{#if tamperedProducts.length > 0}
							<div class="px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
								<div class="flex items-center gap-4 text-[#8e8ea0] font-mono-tight">
									<div>
										Showing <span class="text-white font-semibold">{startIndex}</span>
										–
										<span class="text-white font-semibold">{endIndex}</span>
										of <span class="text-white font-semibold">{tamperedProducts.length}</span> records
									</div>
								</div>

								{#if totalPages > 1}
									<div class="flex items-center gap-1.5 self-end sm:self-auto font-mono-tight">
										<button
											onclick={() => goToPage(currentPage - 1)}
											disabled={currentPage === 1}
											class="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
											aria-label="Previous page"
										>
											<ChevronLeft size={14} />
										</button>

										{#each visiblePages as p}
											{#if typeof p === 'number'}
												<button
													onclick={() => goToPage(p)}
													class="w-7 h-7 rounded-lg text-xs transition-all {currentPage === p ? 'bg-white text-[#08080e] font-bold shadow-md' : 'text-[#8e8ea0] hover:text-white hover:bg-white/[0.05]'}"
												>
													{p}
												</button>
											{:else}
												<span class="w-6 text-center text-[#606074]">…</span>
											{/if}
										{/each}

										<button
											onclick={() => goToPage(currentPage + 1)}
											disabled={currentPage === totalPages}
											class="p-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#8e8ea0] hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:pointer-events-none transition-all"
											aria-label="Next page"
										>
											<ChevronRight size={14} />
										</button>
									</div>
								{/if}
							</div>
						{/if}
					{/if}
				</div>
			{/if}

		</main>
	</div>
</div>

<!-- Global Web3 Connect Modal -->
<PrivyAuthModal />
