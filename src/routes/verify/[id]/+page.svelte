<script lang="ts">
    import { fly } from 'svelte/transition';
    let { data } = $props();
</script>

<svelte:head>
    <title>{data.product ? 'Authentic' : 'Not Verified'} | TearRubr</title>
    <meta name="description" content="Product verification result from TearRubr blockchain authentication." />
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
        <a href="/verify" class="text-slate-400 hover:text-white text-sm font-medium transition-colors">← Verify Another</a>
    </nav>

    <div class="flex flex-col items-center justify-center px-6 py-16">
        <div in:fly={{ y: 20, duration: 600 }} class="w-full max-w-2xl">
            
            {#if data.product}
                <!-- AUTHENTIC STATE -->
                <div class="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 md:p-10">
                    <div class="text-center mb-8">
                        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 class="text-4xl font-extrabold tracking-tight text-emerald-400 mb-1">AUTHENTIC</h1>
                        <p class="text-slate-500 text-sm font-medium tracking-wide uppercase">Blockchain Identity Verified</p>
                    </div>

                    <div class="bg-slate-950/50 border border-slate-800 rounded-xl divide-y divide-slate-800">
                        <div class="grid grid-cols-3 gap-4 px-6 py-4">
                            <div class="text-slate-500 text-sm">Manufacturer</div>
                            <div class="col-span-2 text-white font-medium text-sm">{data.product.manufacturer}</div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-4 px-6 py-4">
                            <div class="text-slate-500 text-sm">Product</div>
                            <div class="col-span-2 text-white font-medium text-sm">{data.product.name}</div>
                        </div>

                        {#if data.product.description}
                        <div class="grid grid-cols-3 gap-4 px-6 py-4">
                            <div class="text-slate-500 text-sm">Description</div>
                            <div class="col-span-2 text-slate-300 text-sm">{data.product.description}</div>
                        </div>
                        {/if}

                        <div class="grid grid-cols-3 gap-4 px-6 py-4">
                            <div class="text-slate-500 text-sm">Verification ID</div>
                            <div class="col-span-2 text-blue-400 font-mono text-xs break-all">{data.product.id}</div>
                        </div>

                        {#if data.product.blockchainTxHash}
                        <div class="grid grid-cols-3 gap-4 px-6 py-4">
                            <div class="text-slate-500 text-sm">On-chain Record</div>
                            <div class="col-span-2 text-blue-400 font-mono text-xs truncate">{data.product.blockchainTxHash}</div>
                        </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <!-- NOT VERIFIED STATE -->
                <div class="bg-slate-900/60 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-8 md:p-10">
                    <div class="text-center">
                        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/20 mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 class="text-4xl font-extrabold tracking-tight text-rose-400 mb-3">NOT VERIFIED</h1>
                        <p class="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                            TearRubr cannot establish a legitimate product record for the supplied identifier. This product may be counterfeit.
                        </p>

                        <div class="bg-slate-950/50 border border-slate-800 rounded-xl px-6 py-4 inline-block">
                            <span class="text-slate-600 text-xs block mb-1 uppercase tracking-wider font-medium">Attempted ID</span>
                            <span class="text-white font-mono text-sm">{data.id}</span>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="mt-8 flex items-center justify-center gap-6">
                <a href="/verify" class="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    Verify Another Product
                </a>
                <span class="text-slate-800">·</span>
                <a href="/" class="text-slate-500 hover:text-white transition-colors text-sm font-medium">Home</a>
            </div>
        </div>
    </div>
</div>
