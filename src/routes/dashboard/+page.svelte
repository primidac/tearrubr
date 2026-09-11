<script lang="ts">
    import { fly } from 'svelte/transition';
    import Logo from '$lib/components/Logo.svelte';
    let { data } = $props();

    function formatDate(timestamp: Date | number) {
        const date = timestamp instanceof Date ? timestamp : new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function truncateId(id: string) {
        return id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-6)}` : id;
    }
</script>

<svelte:head>
    <title>Dashboard | TearRubr</title>
    <meta name="description" content="Manage your registered products and their blockchain-backed digital identities." />
</svelte:head>

<div class="min-h-screen bg-[#08080e]">
    <!-- Top bar -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2.5">
                    <Logo size={28} />
                    <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
                </a>
                <div class="h-5 w-px bg-border"></div>
                <span class="text-sm text-text-tertiary">Dashboard</span>
            </div>
            <div class="flex items-center gap-3">
                <a href="/verify" class="text-sm text-text-secondary hover:text-text-primary transition-colors">Public Ledger</a>
                <a href="/register" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-muted text-white font-medium text-sm transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    New Product
                </a>
            </div>
        </div>
    </nav>

    <div class="max-w-6xl mx-auto px-6 py-10">
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden mb-10">
            <div class="bg-surface-raised px-6 py-5">
                <p class="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Products</p>
                <p class="text-2xl font-bold text-text-primary">{data.products.length}</p>
            </div>
            <div class="bg-surface-raised px-6 py-5">
                <p class="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Verified</p>
                <p class="text-2xl font-bold text-success">{data.products.length}</p>
            </div>
            <div class="bg-surface-raised px-6 py-5">
                <p class="text-xs text-text-tertiary font-medium uppercase tracking-wider mb-1">Network</p>
                <p class="text-base font-semibold text-text-primary flex items-center gap-2 mt-1">
                    <span class="w-2 h-2 rounded-full bg-success"></span>
                    Sepolia
                </p>
            </div>
        </div>

        <!-- Products table -->
        <div class="border border-border rounded-xl overflow-hidden bg-surface-raised">
            <table class="w-full text-left">
                <thead>
                    <tr class="bg-surface text-xs text-text-tertiary font-medium uppercase tracking-wider border-b border-border">
                        <th class="px-6 py-3.5">Product</th>
                        <th class="px-6 py-3.5">Manufacturer</th>
                        <th class="px-6 py-3.5">ID</th>
                        <th class="px-6 py-3.5">On-Chain Tx</th>
                        <th class="px-6 py-3.5">Registered</th>
                        <th class="px-6 py-3.5">Status</th>
                        <th class="px-6 py-3.5 text-right"></th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    {#each data.products as product, i}
                        <tr in:fly={{ y: 8, duration: 250, delay: i * 30 }} class="hover:bg-surface/50 transition-colors">
                            <td class="px-6 py-4 text-sm font-medium text-text-primary">{product.name}</td>
                            <td class="px-6 py-4 text-sm text-text-secondary">{product.manufacturer}</td>
                            <td class="px-6 py-4 font-mono-tight text-xs text-accent">{truncateId(product.id)}</td>
                            <td class="px-6 py-4 font-mono-tight text-xs">
                                {#if product.blockchainTxHash}
                                    <a 
                                        href="{data.explorerBaseUrl || 'https://sepolia.etherscan.io'}/tx/{product.blockchainTxHash}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="text-accent hover:underline inline-flex items-center gap-1"
                                    >
                                        {truncateId(product.blockchainTxHash)}
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                {:else}
                                    <span class="text-text-tertiary">Local</span>
                                {/if}
                            </td>
                            <td class="px-6 py-4 text-sm text-text-tertiary">{formatDate(product.createdAt)}</td>
                            <td class="px-6 py-4">
                                <span class="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                                    <span class="w-1.5 h-1.5 rounded-full bg-success"></span>
                                    Authentic
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <a href="/verify/{product.id}" class="text-xs text-text-tertiary hover:text-accent transition-colors font-medium">
                                    Verify →
                                </a>
                            </td>
                        </tr>
                    {/each}

                    {#if data.products.length === 0}
                        <tr>
                            <td colspan="6" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p class="text-sm text-text-tertiary">No products registered yet.</p>
                                    <a href="/register" class="text-sm text-accent hover:text-accent-muted font-medium transition-colors">Register your first product →</a>
                                </div>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
</div>
