<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    let { data } = $props();
</script>

<svelte:head>
    <title>Dashboard | TearRubr</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed text-slate-200 py-12 px-6">
    <div class="max-w-6xl mx-auto space-y-8" in:fade={{ duration: 800 }}>
        
        <header class="flex justify-between items-center pb-6 border-b border-slate-800/60">
            <div>
                <h1 class="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Manufacturer Dashboard
                </h1>
                <p class="text-slate-400 mt-2 text-lg">Manage your physical products' digital identities.</p>
            </div>
            <a href="/register" class="group relative px-6 py-3 font-semibold text-white rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300">
                <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:rotate-90 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Register Product
                </span>
            </a>
        </header>

        <section>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Stat Cards -->
                <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl shadow-xl hover:bg-slate-800/50 transition-colors">
                    <h3 class="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Products</h3>
                    <p class="text-3xl font-bold text-white">{data.products.length}</p>
                </div>
                <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl shadow-xl hover:bg-slate-800/50 transition-colors">
                    <h3 class="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Verified Authentic</h3>
                    <p class="text-3xl font-bold text-emerald-400">{data.products.length}</p>
                </div>
                <div class="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 p-6 rounded-2xl shadow-xl hover:bg-slate-800/50 transition-colors">
                    <h3 class="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Suspicious Flags</h3>
                    <p class="text-3xl font-bold text-rose-500">0</p>
                </div>
            </div>

            <div class="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-950/50 border-b border-slate-800 text-slate-300 text-sm tracking-wide">
                                <th class="p-4 font-semibold">Product Name</th>
                                <th class="p-4 font-semibold">Manufacturer</th>
                                <th class="p-4 font-semibold">Product ID</th>
                                <th class="p-4 font-semibold">Status</th>
                                <th class="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/50">
                            {#each data.products as product, i}
                                <tr in:fly={{ y: 20, duration: 400, delay: i * 50 }} class="hover:bg-slate-800/30 transition-colors group">
                                    <td class="p-4 font-medium text-white">{product.name}</td>
                                    <td class="p-4 text-slate-400">{product.manufacturer}</td>
                                    <td class="p-4 font-mono text-xs text-cyan-400">
                                        {product.id.slice(0, 8)}...{product.id.slice(-8)}
                                    </td>
                                    <td class="p-4">
                                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                            Authentic
                                        </span>
                                    </td>
                                    <td class="p-4 text-right">
                                        <a href="/verify/{product.id}" class="text-sm text-cyan-400 hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Verify &rarr;
                                        </a>
                                    </td>
                                </tr>
                            {/each}
                            {#if data.products.length === 0}
                                <tr>
                                    <td colspan="5" class="p-12 text-center text-slate-500">
                                        <div class="flex flex-col items-center justify-center space-y-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            <p>No products registered yet.</p>
                                            <a href="/register" class="text-cyan-400 hover:underline">Register your first product</a>
                                        </div>
                                    </td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </div>
</div>
