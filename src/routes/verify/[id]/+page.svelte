<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    export let data;
</script>

<svelte:head>
    <title>Verification Result | TearRubr</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed flex flex-col items-center justify-center p-6 text-slate-200">
    <div in:fly={{ y: 20, duration: 800 }} class="w-full max-w-2xl">
        
        {#if data.product}
            <!-- AUTHENTIC STATE -->
            <div class="bg-slate-900/60 backdrop-blur-xl border-2 border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] p-8 md:p-12 relative overflow-hidden">
                <div class="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div class="text-center mb-10 relative z-10">
                    <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 class="text-5xl font-extrabold tracking-tight text-emerald-400 mb-2">
                        AUTHENTIC
                    </h1>
                    <p class="text-emerald-500/80 text-lg font-medium tracking-wide">Blockchain Identity Verified</p>
                </div>

                <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4 relative z-10">
                    <div class="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
                        <div class="text-slate-500 text-sm font-medium">Manufacturer</div>
                        <div class="col-span-2 text-white font-semibold">{data.product.manufacturer}</div>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
                        <div class="text-slate-500 text-sm font-medium">Product Name</div>
                        <div class="col-span-2 text-white font-semibold">{data.product.name}</div>
                    </div>

                    {#if data.product.description}
                    <div class="grid grid-cols-3 gap-4 border-b border-slate-800 pb-4">
                        <div class="text-slate-500 text-sm font-medium">Description</div>
                        <div class="col-span-2 text-slate-300">{data.product.description}</div>
                    </div>
                    {/if}

                    <div class="grid grid-cols-3 gap-4">
                        <div class="text-slate-500 text-sm font-medium">Verification ID</div>
                        <div class="col-span-2 text-cyan-400 font-mono text-sm break-all">{data.product.id}</div>
                    </div>
                    {#if data.product.blockchainTxHash}
                    <div class="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                        <div class="text-slate-500 text-sm font-medium">On-chain Record</div>
                        <div class="col-span-2 text-emerald-400 font-mono text-sm truncate">
                            <a href="#" class="hover:underline flex items-center gap-1">
                                {data.product.blockchainTxHash}
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            </a>
                        </div>
                    </div>
                    {/if}
                </div>
            </div>
        {:else}
            <!-- NOT VERIFIED STATE -->
            <div class="bg-slate-900/60 backdrop-blur-xl border-2 border-rose-500/30 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.15)] p-8 md:p-12 relative overflow-hidden">
                <div class="absolute -top-32 -right-32 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
                
                <div class="text-center relative z-10">
                    <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.3)] mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 class="text-5xl font-extrabold tracking-tight text-rose-400 mb-4">
                        NOT VERIFIED
                    </h1>
                    <p class="text-rose-300/80 text-lg mb-8">
                        TearRubr cannot establish a legitimate product record for the supplied identifier. 
                        This product may be counterfeit.
                    </p>

                    <div class="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 inline-block">
                        <span class="text-slate-500 text-sm block mb-1">Attempted ID</span>
                        <span class="text-white font-mono">{data.id}</span>
                    </div>
                </div>
            </div>
        {/if}

        <div class="mt-8 text-center">
            <a href="/verify" class="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Verify Another Product
            </a>
        </div>
    </div>
</div>
