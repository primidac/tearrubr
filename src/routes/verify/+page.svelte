<script lang="ts">
    import { fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    let productId = $state('');
    let isSubmitting = $state(false);

    function verifyProduct() {
        if (!productId.trim()) return;
        isSubmitting = true;
        goto(`/verify/${productId.trim()}`);
    }
</script>

<svelte:head>
    <title>Verify Product | TearRubr</title>
    <meta name="description" content="Verify the authenticity of any physical product using its TearRubr digital identity." />
</svelte:head>

<div class="min-h-screen bg-[#08080e]">
    <!-- Top bar -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
            </a>
            <a href="/dashboard" class="text-sm text-text-secondary hover:text-text-primary transition-colors">Dashboard</a>
        </div>
    </nav>

    <div class="flex flex-col items-center justify-center px-6 py-32 relative">
        <div class="absolute inset-0 bg-dots opacity-30"></div>

        <div in:fly={{ y: 12, duration: 400 }} class="w-full max-w-lg relative z-10">
            <div class="text-center mb-10">
                <h1 class="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
                    Verify a Product
                </h1>
                <p class="text-text-tertiary text-sm">
                    Enter a TearRubr Product ID to check its authenticity against the blockchain record.
                </p>
            </div>

            <form onsubmit={(e) => { e.preventDefault(); verifyProduct(); }} class="space-y-4">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input 
                        type="text" 
                        id="productId"
                        bind:value={productId}
                        class="w-full pl-11 pr-4 py-3.5 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all font-mono-tight"
                        placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || !productId.trim()}
                    class="w-full px-4 py-3.5 font-semibold text-white text-sm rounded-lg bg-accent hover:bg-accent-muted glow-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {#if isSubmitting}
                        Verifying…
                    {:else}
                        Verify Product
                    {/if}
                </button>
            </form>

            <p class="text-center text-xs text-text-tertiary mt-6">
                Scan a product's QR code or enter its ID manually.
            </p>
        </div>
    </div>
</div>
