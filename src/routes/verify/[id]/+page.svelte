<script lang="ts">
    import { fly } from 'svelte/transition';
    let { data } = $props();

    function formatDate(timestamp: Date | number) {
        const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
</script>

<svelte:head>
    <title>{data.product ? 'Authentic' : 'Not Verified'} | TearRubr</title>
    <meta name="description" content="Product verification result from TearRubr blockchain authentication." />
</svelte:head>

<div class="min-h-screen bg-[#08080e]">
    <!-- Top bar -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
                </a>
                <div class="h-5 w-px bg-border"></div>
                <span class="text-sm text-text-tertiary">Verification Result</span>
            </div>
            <a href="/verify" class="text-sm text-text-secondary hover:text-text-primary transition-colors">← New Verification</a>
        </div>
    </nav>

    <div class="flex flex-col items-center px-6 py-16">
        <div in:fly={{ y: 12, duration: 400 }} class="w-full max-w-xl">
            
            {#if data.product}
                <!-- AUTHENTIC -->
                <div class="border border-success/20 rounded-xl overflow-hidden">
                    <!-- Status header -->
                    <div class="bg-success/5 px-6 py-5 flex items-center gap-3 border-b border-success/10">
                        <div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-success tracking-wide">AUTHENTIC</p>
                            <p class="text-xs text-text-tertiary">Blockchain identity verified</p>
                        </div>
                    </div>

                    <!-- Product details -->
                    <div class="bg-surface-raised divide-y divide-border">
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Manufacturer</span>
                            <span class="col-span-2 text-sm text-text-primary font-medium">{data.product.manufacturer}</span>
                        </div>
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Product</span>
                            <span class="col-span-2 text-sm text-text-primary font-medium">{data.product.name}</span>
                        </div>
                        {#if data.product.description}
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Description</span>
                            <span class="col-span-2 text-sm text-text-secondary">{data.product.description}</span>
                        </div>
                        {/if}
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Registered</span>
                            <span class="col-span-2 text-sm text-text-secondary">{formatDate(data.product.createdAt)}</span>
                        </div>
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Product ID</span>
                            <span class="col-span-2 font-mono-tight text-xs text-accent break-all">{data.product.id}</span>
                        </div>
                        {#if data.product.blockchainTxHash}
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Tx Hash</span>
                            <span class="col-span-2 font-mono-tight text-xs text-accent truncate">{data.product.blockchainTxHash}</span>
                        </div>
                        {/if}
                    </div>
                </div>

            {:else}
                <!-- NOT VERIFIED -->
                <div class="border border-danger/20 rounded-xl overflow-hidden">
                    <!-- Status header -->
                    <div class="bg-danger/5 px-6 py-5 flex items-center gap-3 border-b border-danger/10">
                        <div class="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-danger tracking-wide">NOT VERIFIED</p>
                            <p class="text-xs text-text-tertiary">No matching record found</p>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="bg-surface-raised px-6 py-8 text-center">
                        <p class="text-sm text-text-secondary mb-5">
                            TearRubr cannot establish a legitimate product record for the supplied identifier. This product may be counterfeit.
                        </p>
                        <div class="inline-block px-4 py-2.5 rounded-lg bg-[#08080e] border border-border">
                            <span class="text-xs text-text-tertiary block mb-0.5 uppercase tracking-wider font-medium">Attempted ID</span>
                            <span class="font-mono-tight text-sm text-text-primary">{data.id}</span>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Navigation -->
            <div class="mt-8 flex items-center justify-center gap-6 text-sm">
                <a href="/verify" class="text-text-tertiary hover:text-text-primary transition-colors font-medium">Verify Another</a>
                <span class="text-border">·</span>
                <a href="/" class="text-text-tertiary hover:text-text-primary transition-colors font-medium">Home</a>
                <span class="text-border">·</span>
                <a href="/dashboard" class="text-text-tertiary hover:text-text-primary transition-colors font-medium">Dashboard</a>
            </div>
        </div>
    </div>
</div>
