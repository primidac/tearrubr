<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Logo from '$lib/components/Logo.svelte';

    let { data } = $props();

    let searchQuery = $state('');
    let filterType = $state<'all' | 'batches' | 'single'>('all');
    let copiedId = $state<string | null>(null);

    $effect(() => {
        if (data.initialQuery) {
            searchQuery = data.initialQuery;
        }
    });

    let batchCount = $derived(data.products.filter(p => Boolean(p.batchNumber)).length);
    let singleCount = $derived(data.products.filter(p => !p.batchNumber).length);

    let filteredProducts = $derived(
        data.products.filter(p => {
            // Type filter
            if (filterType === 'batches' && !p.batchNumber) return false;
            if (filterType === 'single' && p.batchNumber) return false;

            // Search filter
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase().trim();
            return (
                p.name.toLowerCase().includes(q) ||
                p.manufacturer.toLowerCase().includes(q) ||
                p.id.toLowerCase().includes(q) ||
                (p.batchNumber && p.batchNumber.toLowerCase().includes(q)) ||
                (p.blockchainTxHash && p.blockchainTxHash.toLowerCase().includes(q)) ||
                (p.description && p.description.toLowerCase().includes(q))
            );
        })
    );

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

    function truncate(str: string, lead = 8, trail = 6) {
        if (!str) return '';
        if (str.length <= lead + trail) return str;
        return `${str.slice(0, lead)}…${str.slice(-trail)}`;
    }

    function copyToClipboard(text: string, id: string) {
        navigator.clipboard.writeText(text);
        copiedId = id;
        setTimeout(() => {
            if (copiedId === id) copiedId = null;
        }, 2000);
    }

    function handleSearchSubmit(e: SubmitEvent) {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        
        // If there is an exact single match, go to it
        if (filteredProducts.length === 1) {
            goto(`/verify/${filteredProducts[0].id}`);
            return;
        }

        // If user typed a UUID or ID-like string not in list, allow direct verification lookup
        if (trimmed.length > 20 && !trimmed.includes(' ')) {
            goto(`/verify/${trimmed}`);
        }
    }
</script>

<svelte:head>
    <title>Public Ledger | TearRubr</title>
    <meta name="description" content="Explore the public ledger of authenticated products backed by Ethereum smart contracts." />
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary">
    <!-- Top Navigation -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2.5">
                    <Logo size={28} />
                    <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
                </a>
                <div class="h-5 w-px bg-border"></div>
                <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-text-primary">Public Ledger</span>
                    <span class="text-[11px] font-mono-tight px-2 py-0.5 rounded bg-surface-raised border border-border text-accent">
                        Sepolia
                    </span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <a href="/" class="text-sm text-text-secondary hover:text-text-primary transition-colors">Home</a>
                <a href="/dashboard" class="text-sm font-medium text-text-primary px-3.5 py-1.5 rounded-lg border border-border hover:border-text-tertiary hover:bg-surface-raised transition-all">
                    Manufacturer Portal
                </a>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-10">
        <!-- Header & Stats -->
        <div class="mb-8" in:fly={{ y: 10, duration: 400 }}>
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
                <div>
                    <div class="flex items-center gap-2.5 mb-2">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                            On-Chain Explorer
                        </span>
                        <span class="text-xs text-text-tertiary font-mono-tight">Chain ID: 11155111</span>
                    </div>
                    <h1 class="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
                        Public Authenticity Ledger
                    </h1>
                    <p class="text-sm text-text-secondary max-w-2xl">
                        A transparent, decentralized ledger recording genuine product identities and cryptographic verification proofs on Ethereum.
                    </p>
                </div>

                <!-- Contract Details Badge -->
                {#if data.contractAddress}
                    <div class="bg-surface-raised border border-border rounded-xl p-3.5 text-xs">
                        <span class="text-text-tertiary block mb-1 uppercase tracking-wider font-semibold text-[10px]">Smart Contract</span>
                        <a 
                            href="{data.explorerBaseUrl}/address/{data.contractAddress}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="font-mono-tight text-accent hover:underline flex items-center gap-1.5"
                        >
                            {truncate(data.contractAddress, 10, 8)}
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                {/if}
            </div>

            <!-- Ledger Stats Bar -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden mt-6">
                <div class="bg-surface-raised px-6 py-4">
                    <p class="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Total Ledger Records</p>
                    <p class="text-2xl font-bold text-text-primary">{data.products.length}</p>
                </div>
                <div class="bg-surface-raised px-6 py-4">
                    <p class="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Authentic Status</p>
                    <div class="flex items-center gap-2">
                        <p class="text-2xl font-bold text-success">{data.products.length}</p>
                        <span class="text-xs text-text-tertiary font-mono-tight">(100% Verified)</span>
                    </div>
                </div>
                <div class="bg-surface-raised px-6 py-4">
                    <p class="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Testnet Environment</p>
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-success"></span>
                        <p class="text-base font-semibold text-text-primary">Ethereum Sepolia</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search & Query Bar -->
        <div class="mb-6">
            <form onsubmit={handleSearchSubmit} class="relative flex items-center">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    bind:value={searchQuery}
                    placeholder="Search by product name, manufacturer, product ID, or on-chain tx hash…"
                    class="w-full pl-11 pr-32 py-3.5 bg-surface-raised border border-border rounded-xl text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all font-mono-tight"
                />
                {#if searchQuery.trim()}
                    <button 
                        type="button" 
                        onclick={() => searchQuery = ''}
                        class="absolute right-24 text-text-tertiary hover:text-text-primary text-xs px-2 py-1 transition-colors"
                    >
                        Clear
                    </button>
                {/if}
                <button 
                    type="submit"
                    class="absolute right-2.5 px-4 py-2 rounded-lg bg-surface border border-border hover:border-text-tertiary text-text-secondary hover:text-text-primary text-xs font-medium transition-all"
                >
                    Search
                </button>
            </form>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 px-1 text-xs text-text-tertiary">
                <div class="flex items-center gap-2">
                    <button 
                        type="button" 
                        onclick={() => filterType = 'all'}
                        class="px-2.5 py-1 rounded-lg border text-xs transition-all {filterType === 'all' ? 'bg-surface-raised border-accent text-accent font-semibold' : 'bg-surface border-border text-text-secondary hover:text-text-primary'}"
                    >
                        All ({data.products.length})
                    </button>
                    <button 
                        type="button" 
                        onclick={() => filterType = 'batches'}
                        class="px-2.5 py-1 rounded-lg border text-xs transition-all {filterType === 'batches' ? 'bg-surface-raised border-accent text-accent font-semibold' : 'bg-surface border-border text-text-secondary hover:text-text-primary'}"
                    >
                        Batch Runs ({batchCount})
                    </button>
                    <button 
                        type="button" 
                        onclick={() => filterType = 'single'}
                        class="px-2.5 py-1 rounded-lg border text-xs transition-all {filterType === 'single' ? 'bg-surface-raised border-accent text-accent font-semibold' : 'bg-surface border-border text-text-secondary hover:text-text-primary'}"
                    >
                        Single Items ({singleCount})
                    </button>
                </div>
                <span>Showing {filteredProducts.length} records</span>
            </div>
        </div>

        <!-- Ledger Table -->
        <div class="border border-border rounded-xl overflow-hidden bg-surface-raised">
            {#if filteredProducts.length > 0}
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-border bg-surface text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                                <th class="py-3.5 px-6">Status</th>
                                <th class="py-3.5 px-6">Product / Manufacturer</th>
                                <th class="py-3.5 px-6">Product ID</th>
                                <th class="py-3.5 px-6">On-Chain Tx Hash</th>
                                <th class="py-3.5 px-6">Registered</th>
                                <th class="py-3.5 px-6 text-right">Verification</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border text-sm">
                            {#each filteredProducts as product (product.id)}
                                <tr class="hover:bg-surface/50 transition-colors group">
                                    <!-- Status -->
                                    <td class="py-4 px-6 whitespace-nowrap">
                                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                                            <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                                            AUTHENTIC
                                        </div>
                                    </td>

                                    <!-- Product Info -->
                                    <td class="py-4 px-6">
                                        <div class="font-semibold text-text-primary group-hover:text-accent transition-colors">
                                            {product.name}
                                        </div>
                                        <div class="text-xs text-text-tertiary flex items-center gap-1.5 mt-0.5">
                                            <span>{product.manufacturer}</span>
                                            {#if product.description}
                                                <span class="text-border">·</span>
                                                <span class="truncate max-w-[200px]">{product.description}</span>
                                            {/if}
                                        </div>
                                        {#if product.batchNumber}
                                            <div class="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-tight bg-accent/10 text-accent border border-accent/20">
                                                    Lot: {product.batchNumber} (#{product.serialIndex || 1} of {product.batchQuantity || '–'})
                                                </span>
                                                {#if product.sealStatus === 'opened'}
                                                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                        <span class="w-1 h-1 rounded-full bg-amber-400"></span>
                                                        Unsealed
                                                    </span>
                                                {:else}
                                                    <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-success/10 text-success border border-success/20">
                                                        <span class="w-1 h-1 rounded-full bg-success"></span>
                                                        Sealed
                                                    </span>
                                                {/if}
                                            </div>
                                        {/if}
                                    </td>

                                    <!-- Product ID -->
                                    <td class="py-4 px-6 whitespace-nowrap font-mono-tight text-xs">
                                        <div class="flex items-center gap-2">
                                            <span class="text-text-secondary">{truncate(product.id, 8, 6)}</span>
                                            <button 
                                                type="button"
                                                onclick={() => copyToClipboard(product.id, product.id)}
                                                class="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded hover:bg-surface"
                                                title="Copy full Product ID"
                                            >
                                                {#if copiedId === product.id}
                                                    <span class="text-success text-[10px] font-medium">Copied</span>
                                                {:else}
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                {/if}
                                            </button>
                                        </div>
                                    </td>

                                    <!-- Blockchain Tx Hash -->
                                    <td class="py-4 px-6 whitespace-nowrap font-mono-tight text-xs">
                                        {#if product.blockchainTxHash}
                                            <a 
                                                href="{data.explorerBaseUrl}/tx/{product.blockchainTxHash}"
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                class="text-accent hover:underline inline-flex items-center gap-1.5"
                                                title="View transaction on Etherscan Sepolia"
                                            >
                                                {truncate(product.blockchainTxHash, 8, 6)}
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        {:else}
                                            <span class="text-text-tertiary">Local Record</span>
                                        {/if}
                                    </td>

                                    <!-- Date -->
                                    <td class="py-4 px-6 whitespace-nowrap text-xs text-text-tertiary">
                                        {formatDate(product.createdAt)}
                                    </td>

                                    <!-- Action -->
                                    <td class="py-4 px-6 whitespace-nowrap text-right">
                                        <a 
                                            href="/verify/{product.id}"
                                            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:border-accent text-text-secondary hover:text-accent text-xs font-medium transition-all"
                                        >
                                            Verify Proof
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <!-- No Results / Empty State -->
                <div class="px-6 py-16 text-center">
                    <div class="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4 text-text-tertiary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 class="text-base font-semibold text-text-primary mb-1">No Ledger Records Found</h3>
                    <p class="text-sm text-text-secondary max-w-md mx-auto mb-6">
                        {#if searchQuery.trim()}
                            No products in the ledger match "{searchQuery}". You can verify an unindexed ID directly.
                        {:else}
                            No products have been registered yet. Register a product to create the first on-chain record.
                        {/if}
                    </p>
                    
                    <div class="flex items-center justify-center gap-4">
                        {#if searchQuery.trim()}
                            <a 
                                href="/verify/{searchQuery.trim()}"
                                class="px-4 py-2 rounded-lg bg-accent hover:bg-accent-muted text-white text-xs font-semibold transition-all"
                            >
                                Lookup ID Directly →
                            </a>
                            <button 
                                type="button" 
                                onclick={() => searchQuery = ''}
                                class="px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary text-xs font-medium transition-all"
                            >
                                Reset Search
                            </button>
                        {:else}
                            <a 
                                href="/register"
                                class="px-4 py-2 rounded-lg bg-accent hover:bg-accent-muted text-white text-xs font-semibold transition-all"
                            >
                                Register First Product
                            </a>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    </main>
</div>
