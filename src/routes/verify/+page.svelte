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
        <a href="/dashboard" class="text-slate-400 hover:text-white text-sm font-medium transition-colors">Manufacturer Portal</a>
    </nav>

    <div class="flex flex-col items-center justify-center px-6 py-24">
        <div in:fly={{ y: 20, duration: 600 }} class="w-full max-w-lg">
            
            <div class="text-center mb-10">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h1 class="text-3xl font-extrabold tracking-tight text-white">
                    Verify Authenticity
                </h1>
                <p class="text-slate-500 mt-2">Enter a TearRubr Product ID to verify its digital identity against the blockchain record.</p>
            </div>

            <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                <form onsubmit={(e) => { e.preventDefault(); verifyProduct(); }} class="space-y-5">
                    <div>
                        <label for="productId" class="sr-only">Product ID</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                id="productId"
                                bind:value={productId}
                                class="w-full pl-12 pr-4 py-4 bg-slate-950/60 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition-all text-white placeholder-slate-600 font-mono text-sm"
                                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || !productId}
                        class="w-full px-6 py-3.5 font-semibold text-white rounded-xl bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                    >
                        {#if isSubmitting}
                            Verifying…
                        {:else}
                            Verify Product
                        {/if}
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
