<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import {
		Compass,
		AlertTriangle,
		RefreshCw,
		Home,
		ArrowLeft,
		Copy,
		Check,
		ExternalLink,
		ShieldAlert,
		FileQuestion,
		Layers
	} from '@lucide/svelte';

	let isCopied = $state(false);

	let status = $derived(page.status || 404);
	let errorMessage = $derived(page.error?.message || (status === 404 ? 'The requested resource or cryptographic proof could not be resolved.' : 'An unexpected exception occurred during execution.'));

	let is404 = $derived(status === 404);

	function copyDiagnostics() {
		const diag = JSON.stringify({
			status,
			error: errorMessage,
			path: page.url.pathname,
			timestamp: new Date().toISOString(),
			network: 'Ethereum Sepolia (Chain ID 11155111)'
		}, null, 2);

		navigator.clipboard.writeText(diag);
		isCopied = true;
		setTimeout(() => (isCopied = false), 2500);
	}

	function handleReload() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>{status} · {is404 ? 'Page Not Found' : 'Protocol Exception'} | TearRubr</title>
</svelte:head>

<div class="min-h-screen bg-[#06060a] text-text-primary flex flex-col justify-between selection:bg-indigo-500/20 relative overflow-hidden font-sans">
	
	<!-- Atmospheric Sahara AI Blooms -->
	<div class="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
		{#if is404}
			<div class="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-[#6366f1]/15 blur-[160px]"></div>
			<div class="absolute -bottom-20 -right-20 w-[550px] h-[550px] rounded-full bg-[#06b6d4]/15 blur-[160px]"></div>
		{:else}
			<div class="absolute -top-20 -right-20 w-[550px] h-[550px] rounded-full bg-[#f43f5e]/15 blur-[160px]"></div>
			<div class="absolute -bottom-20 -left-20 w-[550px] h-[550px] rounded-full bg-[#f59e0b]/15 blur-[160px]"></div>
		{/if}
		<div class="absolute inset-0 bg-radial-gradient from-transparent via-[#06060a]/60 to-[#06060a]"></div>
	</div>

	<!-- Minimal Brand Topbar -->
	<header class="h-20 px-6 sm:px-12 flex items-center justify-between relative z-10 border-b border-white/[0.04] backdrop-blur-md">
		<a href="/" class="flex items-center gap-3 group">
			<Logo size={30} />
			<div>
				<div class="text-base font-extrabold text-white font-display tracking-tight flex items-center gap-1.5">
					<span>TearRubr</span>
					<span class="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[9px] font-mono-tight">VAULT</span>
				</div>
				<div class="text-[10px] text-[#7a7a8e] font-mono-tight">Cryptographic Provenance</div>
			</div>
		</a>

		<div class="flex items-center gap-3">
			<div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono-tight text-[#8e8ea0]">
				<span class="w-1.5 h-1.5 rounded-full {is404 ? 'bg-cyan-400' : 'bg-rose-400'} animate-pulse"></span>
				<span>{is404 ? 'Route Unresolved' : 'Fault Safe-Abort'}</span>
			</div>

			<a
				href="/"
				class="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-xs font-display text-white transition-colors flex items-center gap-1.5"
			>
				<Home size={13} />
				<span>Return Home</span>
			</a>
		</div>
	</header>

	<!-- Main Error Visual Canvas -->
	<main class="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 my-8">
		<div class="max-w-2xl w-full">
			
			<!-- Frosted Error Shield Card -->
			<div class="p-6 sm:p-10 rounded-3xl bg-[#0c0c16]/80 border border-white/[0.08] backdrop-blur-3xl shadow-2xl relative overflow-hidden text-center">
				
				<!-- Subtle Top Ambient Beam -->
				<div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent {is404 ? 'via-cyan-400/50' : 'via-rose-400/50'} to-transparent"></div>

				<!-- Status Badge Indicator -->
				<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full {is404 ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'} border text-xs font-mono-tight mb-6 shadow-sm">
					{#if is404}
						<FileQuestion size={14} class="animate-bounce" />
						<span>ERROR_CODE: 404_ORPHAN_PATH</span>
					{:else}
						<ShieldAlert size={14} class="animate-pulse" />
						<span>ERROR_CODE: 500_SYSTEM_FAULT</span>
					{/if}
				</div>

				<!-- Gigantic Glowing Error Code Display -->
				<div class="relative select-none my-2">
					<h1 class="text-7xl sm:text-9xl font-extrabold tracking-tighter font-display leading-none {is404 ? 'bg-gradient-to-b from-white via-cyan-200 to-indigo-400' : 'bg-gradient-to-b from-white via-rose-200 to-amber-400'} bg-clip-text text-transparent drop-shadow-2xl">
						{status}
					</h1>
					<div class="absolute inset-0 flex items-center justify-center -z-10 blur-3xl opacity-30 pointer-events-none {is404 ? 'text-cyan-500' : 'text-rose-500'} font-display text-9xl font-black">
						{status}
					</div>
				</div>

				<!-- Headline & Description -->
				<div class="space-y-2 mt-4 max-w-lg mx-auto">
					<h2 class="text-xl sm:text-2xl font-bold text-white font-display">
						{#if is404}
							Cryptographic Path Not Found
						{:else}
							Protocol Execution Disruption
						{/if}
					</h2>
					<p class="text-xs sm:text-sm text-[#9494a8] leading-relaxed">
						{#if is404}
							The requested URL, product identity token, or ledger index does not exist on this network branch. It may have moved or was never committed.
						{:else}
							A processing anomaly occurred while evaluating cryptographic verification or database state. The operation was aborted to preserve immutability.
						{/if}
					</p>
				</div>

				<!-- Diagnostics Terminal Drawer -->
				<div class="mt-6 p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-left font-mono-tight text-xs max-w-xl mx-auto backdrop-blur-md">
					<div class="flex items-center justify-between text-[11px] text-[#7a7a8e] pb-2 border-b border-white/[0.04] mb-2.5">
						<div class="flex items-center gap-1.5">
							<span class="w-2 h-2 rounded-full {is404 ? 'bg-cyan-400' : 'bg-rose-400'}"></span>
							<span class="uppercase tracking-wider font-semibold">Diagnostic Telemetry</span>
						</div>
						<button
							onclick={copyDiagnostics}
							class="text-accent hover:text-white flex items-center gap-1 text-[11px] transition-colors"
							title="Copy diagnostic object to clipboard"
						>
							{#if isCopied}
								<Check size={12} class="text-emerald-400" />
								<span class="text-emerald-400">Copied</span>
							{:else}
								<Copy size={12} />
								<span>Copy Diagnostics</span>
							{/if}
						</button>
					</div>

					<div class="space-y-1 text-[11px] text-[#8e8ea0] overflow-x-auto">
						<div><span class="text-[#555566]">STATUS:</span> <span class="text-white font-bold">{status}</span></div>
						<div><span class="text-[#555566]">EXCEPTION:</span> <span class="text-[#d0d0e0] break-words">{errorMessage}</span></div>
						<div><span class="text-[#555566]">PATH:</span> <span class="text-accent">{page.url.pathname}</span></div>
						<div><span class="text-[#555566]">NETWORK:</span> <span class="text-emerald-400">Ethereum Sepolia (Chain ID 11155111)</span></div>
					</div>
				</div>

				<!-- Primary Interactive Actions -->
				<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
					{#if !is404}
						<button
							onclick={handleReload}
							class="px-5 py-2.5 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all shadow-lg flex items-center gap-2"
						>
							<RefreshCw size={13} />
							<span>Retry Operation</span>
						</button>
					{/if}

					<a
						href="/verify"
						class="px-5 py-2.5 rounded-full {is404 ? 'bg-white text-[#08080e] hover:bg-white/90 font-bold' : 'bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold'} text-xs font-display transition-all shadow-md flex items-center gap-2"
					>
						<Compass size={13} />
						<span>Public Ledger</span>
					</a>

					<a
						href="/dashboard"
						class="px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-display transition-all flex items-center gap-2"
					>
						<Layers size={13} class="text-indigo-400" />
						<span>Manufacturer Workspace</span>
					</a>

					<a
						href="/"
						class="px-4 py-2.5 rounded-full text-[#8e8ea0] hover:text-white text-xs font-display transition-colors flex items-center gap-1.5"
					>
						<ArrowLeft size={13} />
						<span>Home</span>
					</a>
				</div>

			</div>
		</div>
	</main>

	<!-- Footer Metadata Bar -->
	<footer class="h-16 px-6 sm:px-12 flex items-center justify-between text-xs text-[#7a7a8e] font-mono-tight border-t border-white/[0.04] relative z-10 backdrop-blur-md">
		<div class="flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-emerald-400"></span>
			<span>Sepolia Node Sync: 100% Operational</span>
		</div>
		<div class="flex items-center gap-4">
			<a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1">
				<span>Etherscan</span>
				<ExternalLink size={10} />
			</a>
			<a href="https://thegraph.com/studio/subgraph/tearrubr-sepolia" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors flex items-center gap-1">
				<span>The Graph Studio</span>
				<ExternalLink size={10} />
			</a>
		</div>
	</footer>

</div>
