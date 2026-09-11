<script lang="ts">
	import Logo from './Logo.svelte';
	import PrivyAuthModal from './PrivyAuthModal.svelte';
	import { auth } from '$lib/auth.svelte';
	import { Menu, X, Check, Wallet, LayoutDashboard } from '@lucide/svelte';

	interface Props {
		currentPath?: string;
	}

	let { currentPath = '' }: Props = $props();

	let isMobileMenuOpen = $state(false);

	function openAuth() {
		auth.openModal();
	}

	function formatAddress(addr: string | null, short = false) {
		if (!addr) return '';
		if (addr.length <= 10) return addr;
		return short ? `${addr.slice(0, 4)}…${addr.slice(-2)}` : `${addr.slice(0, 6)}…${addr.slice(-4)}`;
	}
</script>

<header class="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
	<nav
		class="max-w-5xl w-full mx-auto px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0a0a14]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-between transition-all duration-200"
	>
		<!-- Brand -->
		<a href="/" class="flex items-center gap-2 sm:gap-2.5 shrink-0">
			<Logo size={22} />
			<span class="text-sm sm:text-[15px] font-bold tracking-tight text-white font-display">TearRubr</span>
		</a>

		<!-- Desktop Nav Links -->
		<div class="hidden md:flex items-center gap-6 text-xs font-medium text-[#9494a8]">
			<a
				href="/verify"
				class="hover:text-white transition-colors {currentPath === '/verify' ? 'text-white' : ''}"
			>
				Verify
			</a>
			<a
				href="/register"
				class="hover:text-white transition-colors {currentPath === '/register' ? 'text-white' : ''}"
			>
				Register
			</a>
			<a href="/#how-it-works" class="hover:text-white transition-colors">How It Works</a>
			<a href="/#why-blockchain" class="hover:text-white transition-colors">Security</a>
		</div>

		<!-- Right Action & Identity Dock -->
		<div class="flex items-center gap-1.5 sm:gap-2.5">
			<!-- Wallet / Auth Connection Pill -->
			{#if auth.session.isConnected}
				<button
					onclick={openAuth}
					class="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11px] sm:text-xs font-mono-tight text-white transition-all whitespace-nowrap shrink-0"
					title="Connected: {auth.session.walletAddress || auth.session.email}"
				>
					<span class="w-1.5 h-1.5 rounded-full {auth.session.isVerifiedManufacturer ? 'bg-emerald-400' : 'bg-indigo-400'} shrink-0"></span>
					<!-- Compact on mobile, standard on sm+ -->
					<span class="sm:hidden font-medium whitespace-nowrap">
						{auth.session.ensName || formatAddress(auth.session.walletAddress, true) || auth.session.email}
					</span>
					<span class="hidden sm:inline font-medium whitespace-nowrap">
						{auth.session.ensName || formatAddress(auth.session.walletAddress, false) || auth.session.email}
					</span>
					{#if auth.session.isVerifiedManufacturer}
						<Check size={11} class="text-emerald-400 shrink-0" />
					{/if}
				</button>
			{:else}
				<button
					onclick={openAuth}
					class="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11px] sm:text-xs font-medium text-white transition-all font-display flex items-center gap-1.5 whitespace-nowrap shrink-0"
				>
					<span class="w-1.5 h-1.5 rounded-full bg-[#8e8ea0] shrink-0"></span>
					<span class="hidden sm:inline">Sign In / Connect</span>
					<span class="sm:hidden">Sign In</span>
				</button>
			{/if}

			<!-- Dashboard Pill Button -->
			<a
				href="/dashboard"
				class="rounded-lg px-3 sm:px-5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold bg-white text-[#08080e] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm font-display shrink-0 whitespace-nowrap"
			>
				Dashboard
			</a>

			<!-- Mobile menu toggle -->
			<button
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="md:hidden p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white transition-colors shrink-0"
				aria-label="Toggle navigation"
			>
				{#if isMobileMenuOpen}
					<X size={15} />
				{:else}
					<Menu size={15} />
				{/if}
			</button>
		</div>
	</nav>

	<!-- Mobile Dropdown -->
	{#if isMobileMenuOpen}
		<div
			class="md:hidden fixed top-16 left-3 right-3 p-4 rounded-2xl bg-[#0c0c16]/95 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-2.5 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150"
		>
			{#if auth.session.isConnected}
				<div class="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-2">
					<div class="space-y-0.5 truncate">
						<div class="text-[10px] font-mono-tight text-[#7a7a8e] uppercase flex items-center gap-1">
							<span class="w-1.5 h-1.5 rounded-full {auth.session.isVerifiedManufacturer ? 'bg-emerald-400' : 'bg-indigo-400'}"></span>
							<span>{auth.session.isVerifiedManufacturer ? 'Verified Manufacturer' : 'Connected Wallet'}</span>
						</div>
						<div class="font-mono-tight text-white text-xs truncate">
							{auth.session.walletAddress}
						</div>
					</div>
					<button
						onclick={() => {
							isMobileMenuOpen = false;
							openAuth();
						}}
						class="px-2 py-1 rounded-lg bg-white/[0.06] text-[10px] text-accent hover:underline shrink-0"
					>
						Manage
					</button>
				</div>
			{/if}

			<div class="divide-y divide-white/[0.05]">
				<a
					href="/verify"
					onclick={() => (isMobileMenuOpen = false)}
					class="block py-2.5 text-[#9494a8] hover:text-white font-display text-xs"
				>
					Product Directory
				</a>
				<a
					href="/register"
					onclick={() => (isMobileMenuOpen = false)}
					class="block py-2.5 text-[#9494a8] hover:text-white font-display text-xs"
				>
					Register Products
				</a>
				<a
					href="/dashboard"
					onclick={() => (isMobileMenuOpen = false)}
					class="block py-2.5 text-[#9494a8] hover:text-white font-display text-xs flex items-center justify-between"
				>
					<span>Dashboard</span>
					<LayoutDashboard size={13} class="text-white/40" />
				</a>
				<a
					href="/#how-it-works"
					onclick={() => (isMobileMenuOpen = false)}
					class="block py-2.5 text-[#9494a8] hover:text-white font-display text-xs"
				>
					How It Works
				</a>
				<a
					href="/#why-blockchain"
					onclick={() => (isMobileMenuOpen = false)}
					class="block py-2.5 text-[#9494a8] hover:text-white font-display text-xs"
				>
					Security
				</a>
			</div>

			{#if !auth.session.isConnected}
				<button
					onclick={() => {
						isMobileMenuOpen = false;
						openAuth();
					}}
					class="w-full py-2.5 rounded-lg bg-white text-[#08080e] font-bold font-display text-xs transition-all shadow flex items-center justify-center gap-2 mt-2"
				>
					<Wallet size={14} />
					<span>Sign In / Connect</span>
				</button>
			{/if}
		</div>
	{/if}
</header>

<!-- Global Real Web3 Auth Modal -->
<PrivyAuthModal />
