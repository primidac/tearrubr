<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import Logo from '$lib/components/Logo.svelte';
    let { data } = $props();

    let sealStatus = $state<string>('sealed');
    let openedAt = $state<Date | string | number | null>(null);
    let isUnsealing = $state(false);

    $effect(() => {
        sealStatus = data.product?.sealStatus || 'sealed';
        openedAt = data.product?.openedAt || null;
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

    async function handleUnseal() {
        if (!data.id) return;
        isUnsealing = true;
        try {
            const res = await fetch(`/api/products/${data.id}/unseal`, { method: 'POST' });
            const result = await res.json();
            if (result.success) {
                sealStatus = 'opened';
                openedAt = result.openedAt;
            }
        } catch (err) {
            console.error('Failed to unseal', err);
        } finally {
            isUnsealing = false;
        }
    }
</script>

<svelte:head>
    <title>{data.product ? 'Authentic Product' : 'Not Verified'} | TearRubr</title>
    <meta name="description" content="Product verification result from TearRubr blockchain authentication." />
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary">
    <!-- Top bar -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2.5">
                    <Logo size={28} />
                    <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
                </a>
                <div class="h-5 w-px bg-border"></div>
                <span class="text-sm text-text-tertiary">Cryptographic Verification</span>
            </div>
            <a href="/verify" class="text-sm text-text-secondary hover:text-text-primary transition-colors">← Public Ledger</a>
        </div>
    </nav>

    <div class="flex flex-col items-center px-6 py-12">
        <div in:fly={{ y: 12, duration: 400 }} class="w-full max-w-xl space-y-6">
            
            {#if data.product}
                <!-- AUTHENTIC IDENTITY CARD -->
                <div class="border border-success/20 rounded-2xl overflow-hidden bg-surface-raised shadow-2xl shadow-success/5">
                    <!-- Status header -->
                    <div class="bg-success/10 px-6 py-5 flex items-center justify-between border-b border-success/15">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <p class="text-sm font-bold text-success tracking-wide">AUTHENTIC</p>
                                    {#if data.onChain?.isAuthentic}
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/20 text-success border border-success/30">
                                            <span class="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                            On-Chain Proof
                                        </span>
                                    {/if}
                                    {#if data.product.batchNumber}
                                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono-tight bg-accent/20 text-accent border border-accent/30">
                                            Batch Rollup
                                        </span>
                                    {/if}
                                </div>
                                <p class="text-xs text-text-tertiary">Cryptographically verified on Ethereum Sepolia</p>
                            </div>
                        </div>

                        <span class="text-xs font-mono-tight text-text-tertiary px-2.5 py-1 rounded bg-surface border border-border">
                            Sepolia Testnet
                        </span>
                    </div>

                    <!-- Product details -->
                    <div class="divide-y divide-border text-sm">
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Manufacturer</span>
                            <span class="col-span-2 text-sm text-text-primary font-bold">{data.product.manufacturer}</span>
                        </div>
                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Product</span>
                            <span class="col-span-2 text-sm text-text-primary font-medium">{data.product.name}</span>
                        </div>
                        
                        {#if data.product.batchNumber}
                            <div class="grid grid-cols-3 px-6 py-3.5 bg-accent/5">
                                <span class="text-xs text-accent font-medium uppercase tracking-wider self-center">Production Batch</span>
                                <div class="col-span-2 space-y-1">
                                    <div class="flex items-center justify-between">
                                        <span class="font-mono-tight text-xs text-accent font-bold">{data.product.batchNumber}</span>
                                        <span class="text-xs text-text-tertiary">Unit #{data.product.serialIndex} of {data.product.batchQuantity}</span>
                                    </div>
                                    {#if data.batch?.merkleRoot}
                                        <div class="text-[10px] text-text-tertiary font-mono-tight break-all">
                                            Merkle Root: {data.batch.merkleRoot}
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if data.product.description}
                            <div class="grid grid-cols-3 px-6 py-3.5">
                                <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Details</span>
                                <span class="col-span-2 text-sm text-text-secondary">{data.product.description}</span>
                            </div>
                        {/if}

                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Registered</span>
                            <span class="col-span-2 text-sm text-text-secondary">{formatDate(data.product.createdAt)}</span>
                        </div>

                        <div class="grid grid-cols-3 px-6 py-3.5">
                            <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Product ID</span>
                            <span class="col-span-2 font-mono-tight text-xs text-accent break-all select-all">{data.product.id}</span>
                        </div>

                        {#if data.product.blockchainTxHash}
                            <div class="grid grid-cols-3 px-6 py-3.5">
                                <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">On-Chain Tx</span>
                                <div class="col-span-2">
                                    {#if data.onChain?.explorerUrl}
                                        <a 
                                            href={data.onChain.explorerUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            class="font-mono-tight text-xs text-accent hover:underline inline-flex items-center gap-1.5 break-all"
                                        >
                                            {data.product.blockchainTxHash}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    {:else}
                                        <span class="font-mono-tight text-xs text-accent break-all">{data.product.blockchainTxHash}</span>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if data.onChain?.contractAddress}
                            <div class="grid grid-cols-3 px-6 py-3.5">
                                <span class="text-xs text-text-tertiary font-medium uppercase tracking-wider self-center">Smart Contract</span>
                                <div class="col-span-2">
                                    <a 
                                        href={data.onChain.contractExplorerUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        class="font-mono-tight text-xs text-text-secondary hover:text-text-primary hover:underline inline-flex items-center gap-1.5 break-all"
                                    >
                                        {data.onChain.contractAddress}
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- TEARRUBR TAMPER-EVIDENT SEAL CARD -->
                <div class="border rounded-2xl overflow-hidden bg-surface-raised p-6 transition-all {sealStatus === 'opened' ? 'border-amber-500/30' : 'border-success/30'}">
                    <div class="flex items-start justify-between gap-4 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 {sealStatus === 'opened' ? 'bg-amber-500/10 text-amber-400' : 'bg-success/10 text-success'}">
                                {#if sealStatus === 'opened'}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                {/if}
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h3 class="text-sm font-bold text-text-primary">
                                        {sealStatus === 'opened' ? 'Tear Seal Broken / Consumed' : 'TearRubr Tamper Seal: Intact'}
                                    </h3>
                                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full {sealStatus === 'opened' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-success/10 text-success border border-success/20'}">
                                        {sealStatus === 'opened' ? 'UNSEALED' : 'SEALED'}
                                    </span>
                                </div>
                                <p class="text-xs text-text-secondary mt-1">
                                    {#if sealStatus === 'opened'}
                                        First opened on {formatDate(openedAt)}. If you received this product in a sealed box/bottle, do not consume it.
                                    {:else}
                                        The physical cap/seal has never been broken. Opening it invalidates the seal to prevent counterfeit refills.
                                    {/if}
                                </p>
                            </div>
                        </div>
                    </div>

                    {#if sealStatus === 'sealed'}
                        <div class="pt-2 border-t border-border/60 mt-4 flex items-center justify-between">
                            <span class="text-xs text-text-tertiary">Customer First-Scan Simulation:</span>
                            <button 
                                type="button" 
                                onclick={handleUnseal}
                                disabled={isUnsealing}
                                class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border hover:border-amber-500/50 hover:text-amber-400 transition-all flex items-center gap-1.5 text-text-secondary disabled:opacity-50"
                            >
                                {#if isUnsealing}
                                    Unsealing…
                                {:else}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    </svg>
                                    Simulate Breaking Seal
                                {/if}
                            </button>
                        </div>
                    {/if}
                </div>

            {:else}
                <!-- NOT VERIFIED -->
                <div class="border border-danger/20 rounded-2xl overflow-hidden bg-surface-raised shadow-2xl">
                    <!-- Status header -->
                    <div class="bg-danger/5 px-6 py-5 flex items-center gap-3 border-b border-danger/10">
                        <div class="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-sm font-bold text-danger tracking-wide">NOT VERIFIED</p>
                            <p class="text-xs text-text-tertiary">No matching cryptographic record found</p>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="px-6 py-8 text-center">
                        <p class="text-sm text-text-secondary mb-5">
                            TearRubr cannot establish a legitimate product or batch record for the supplied identifier. This product may be counterfeit.
                        </p>
                        <div class="inline-block px-4 py-2.5 rounded-lg bg-[#08080e] border border-border">
                            <span class="text-xs text-text-tertiary block mb-0.5 uppercase tracking-wider font-medium">Attempted ID</span>
                            <span class="font-mono-tight text-sm text-text-primary">{data.id}</span>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Navigation -->
            <div class="flex items-center justify-center gap-6 text-sm pt-4">
                <a href="/verify" class="text-text-tertiary hover:text-text-primary transition-colors font-medium">Public Ledger</a>
                <span class="text-border">·</span>
                <a href="/" class="text-text-tertiary hover:text-text-primary transition-colors font-medium">Home</a>
                <span class="text-border">·</span>
                <a href="/dashboard" class="text-text-tertiary hover:text-text-primary transition-colors font-medium">Dashboard</a>
            </div>
        </div>
    </div>
</div>
