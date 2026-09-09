<script lang="ts">
    import { fly } from 'svelte/transition';
    let { data } = $props();
</script>

<svelte:head>
    <title>Dashboard | TearRubr</title>
    <meta name="description" content="Manage your registered products and their blockchain-backed digital identities." />
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed text-slate-200">
    <!-- Top Nav -->
    <nav class="w-full px-8 py-5 flex items-center justify-between border-b border-slate-800/60">
        <a href="/" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span class="text-xl font-bold tracking-tight text-white">Tear<span class="text-blue-500">Rubr</span></span>
        </a>
        <div class="flex items-center gap-4">
            <a href="/verify" class="text-slate-400 hover:text-white text-sm font-medium transition-colors">Verify</a>
            <a href="/register" class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                Register Product
            </a>
        </div>
    </nav>

    <div class="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header>
            <h1 class="text-3xl font-extrabold tracking-tight text-white">Manufacturer Dashboard</h1>
            <p class="text-slate-400 mt-1">Manage your products' digital identities.</p>
        </header>

        <!-- Stat Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <h3 class="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Products</h3>
                <p class="text-3xl font-bold text-white">{data.products.length}</p>
            </div>
            <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <h3 class="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Verified Authentic</h3>
                <p class="text-3xl font-bold text-emerald-400">{data.products.length}</p>
            </div>
            <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <h3 class="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Suspicious Flags</h3>
                <p class="text-3xl font-bold text-rose-400">0</p>
            </div>
        </div>

        <!-- Products Table -->
        <div class="bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-900/80 border-b border-slate-800 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            <th class="px-6 py-4">Product Name</th>
                            <th class="px-6 py-4">Manufacturer</th>
                            <th class="px-6 py-4">Product ID</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/50">
                        {#each data.products as product, i}
                            <tr in:fly={{ y: 10, duration: 300, delay: i * 40 }} class="hover:bg-slate-800/30 transition-colors group">
                                <td class="px-6 py-4 font-medium text-white">{product.name}</td>
                                <td class="px-6 py-4 text-slate-400">{product.manufacturer}</td>
                                <td class="px-6 py-4 font-mono text-xs text-blue-400">
                                    {product.id.slice(0, 8)}…{product.id.slice(-8)}
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Authentic
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="/verify/{product.id}" class="text-sm text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                        View &rarr;
                                    </a>
                                </td>
                            </tr>
                        {/each}
                        {#if data.products.length === 0}
                            <tr>
                                <td colspan="5" class="px-6 py-16 text-center text-slate-500">
                                    <div class="flex flex-col items-center justify-center space-y-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <p class="text-sm">No products registered yet.</p>
                                        <a href="/register" class="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">Register your first product &rarr;</a>
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
