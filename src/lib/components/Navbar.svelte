<script lang="ts">
	import Logo from './Logo.svelte';
	import PrivyAuthModal from './PrivyAuthModal.svelte';
	import { auth } from '$lib/auth.svelte';
	import { page } from '$app/state';

	interface Props {
		currentPath?: string;
	}

	let { currentPath = '' }: Props = $props();

	let isMobileMenuOpen = $state(false);

	function openAuth() {
		auth.openModal();
	}
</script>

<header class="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-4">
	<nav
		class="max-w-5xl w-full mx-auto px-4 sm:px-5 py-2.5 rounded-full bg-[#0a0a14]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.45)] flex items-center justify-between transition-all duration-200"
	>
		<!-- Brand -->
		<a href="/" class="flex items-center gap-2.5 shrink-0">
			<Logo size={24} />
			<span class="text-[15px] font-bold tracking-tight text-white font-display">TearRubr</span>
		</a>

		<!-- Desktop Nav Links -->
		<div class="hidden md:flex items-center gap-6 text-xs font-medium text-[#9494a8]">
			<a
				href="/verify"
				class="hover:text-white transition-colors {currentPath === '/verify' ? 'text-white' : ''}"
			>
				Public Ledger
			</a>
			<a
				href="/register"
				class="hover:text-white transition-colors {currentPath === '/register' ? 'text-white' : ''}"
			>
				Register
			</a>
			<a href="/#how-it-works" class="hover:text-white transition-colors">How It Works</a>
			<a href="/#why-blockchain" class="hover:text-white transition-colors">Why Blockchain</a>
		</div>

		<!-- Right Action & Identity Dock -->
		<div class="flex items-center gap-2 sm:gap-2.5">
			<!-- Connected Identity Pill (ENS / Privy) -->
			{#if auth.session.isConnected}
				<button
					onclick={openAuth}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono-tight text-white transition-all"
					title="Authenticated with {auth.session.ensName || auth.session.walletAddress}"
				>
					<span class="w-1.5 h-1.5 rounded-full {auth.session.isVerifiedManufacturer ? 'bg-emerald-400' : 'bg-indigo-400'}"></span>
					<span class="font-medium truncate max-w-[100px] sm:max-w-[130px]">
						{auth.session.ensName || auth.session.walletAddress}
					</span>
					{#if auth.session.isVerifiedManufacturer}
						<span class="text-emerald-400 text-[10px]" title="Verified Brand">✓</span>
					{/if}
				</button>
			{:else}
				<button
					onclick={openAuth}
					class="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white transition-all font-display"
				>
					Connect
				</button>
			{/if}

			<!-- Dashboard Pill Button -->
			<a
				href="/dashboard"
				class="rounded-full px-4 sm:px-5 py-1.5 text-xs font-semibold bg-white text-[#08080e] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm font-display shrink-0"
			>
				Dashboard
			</a>

			<!-- Mobile menu toggle -->
			<button
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="md:hidden p-1.5 rounded-full bg-white/5 text-[#9494a8] hover:text-white"
				aria-label="Toggle navigation"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
	</nav>

	<!-- Mobile Dropdown -->
	{#if isMobileMenuOpen}
		<div
			class="md:hidden fixed top-16 left-4 right-4 p-4 rounded-2xl bg-[#0c0c16]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-3 text-xs"
		>
			<a
				href="/verify"
				onclick={() => (isMobileMenuOpen = false)}
				class="block py-2 text-[#9494a8] hover:text-white"
			>
				Public Ledger
			</a>
			<a
				href="/register"
				onclick={() => (isMobileMenuOpen = false)}
				class="block py-2 text-[#9494a8] hover:text-white"
			>
				Register Product / Batch
			</a>
			<a
				href="/#how-it-works"
				onclick={() => (isMobileMenuOpen = false)}
				class="block py-2 text-[#9494a8] hover:text-white"
			>
				How It Works
			</a>
			<a
				href="/#why-blockchain"
				onclick={() => (isMobileMenuOpen = false)}
				class="block py-2 text-[#9494a8] hover:text-white"
			>
				Why Blockchain
			</a>
			<button
				onclick={() => {
					isMobileMenuOpen = false;
					openAuth();
				}}
				class="w-full text-left py-2 text-accent"
			>
				{auth.session.isConnected ? `Switch Identity (${auth.session.ensName})` : 'Connect with Privy / ENS'}
			</button>
		</div>
	{/if}
</header>

<!-- Global Privy Auth Modal -->
<PrivyAuthModal />
