<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';

	let status = $derived(page.status || 404);
	let is404 = $derived(status === 404);

	function reloadPage() {
		if (typeof window !== 'undefined') {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>{status} · {is404 ? 'Page Not Found' : 'Internal Server Error'} | TearRubr</title>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-white flex flex-col items-center justify-between p-6 selection:bg-indigo-500/20 font-sans">
	
	<!-- Simple Minimal Header -->
	<header class="w-full max-w-4xl flex items-center justify-between py-4">
		<a href="/" class="flex items-center gap-2.5">
			<Logo size={26} />
			<span class="font-bold text-sm tracking-tight font-display">TearRubr</span>
		</a>
		<a href="/" class="text-xs text-[#8e8ea0] hover:text-white transition-colors">
			Home
		</a>
	</header>

	<!-- Simple Centered Content -->
	<main class="text-center max-w-md my-auto py-12">
		<p class="text-sm font-mono-tight text-accent font-semibold tracking-wider uppercase mb-3">
			{status} {is404 ? 'Error' : 'Server Error'}
		</p>

		<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-3">
			{is404 ? 'Page not found' : 'Something went wrong'}
		</h1>

		<p class="text-sm text-[#8e8ea0] leading-relaxed mb-8">
			{#if is404}
				Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn’t exist.
			{:else}
				An internal error occurred while processing your request. Please try refreshing or check back in a moment.
			{/if}
		</p>

		<div class="flex items-center justify-center gap-3">
			{#if !is404}
				<button
					onclick={reloadPage}
					class="px-5 py-2 rounded-full bg-white text-[#08080e] hover:bg-white/90 font-bold text-xs font-display transition-all"
				>
					Try Again
				</button>
			{/if}

			<a
				href="/"
				class="px-5 py-2 rounded-full {is404 ? 'bg-white text-[#08080e] hover:bg-white/90 font-bold' : 'bg-white/10 hover:bg-white/15 text-white font-semibold'} text-xs font-display transition-all"
			>
				Go Home
			</a>

			<a
				href="/verify"
				class="px-4 py-2 rounded-full text-xs text-[#8e8ea0] hover:text-white transition-colors"
			>
				Public Ledger →
			</a>
		</div>
	</main>

	<!-- Minimal Footer -->
	<footer class="text-xs text-[#555566] py-4">
		TearRubr &copy; {new Date().getFullYear()}
	</footer>

</div>
