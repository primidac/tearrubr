<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';

    let productId = '';
    let isSubmitting = false;

    function verifyProduct() {
        if (!productId.trim()) return;
        isSubmitting = true;
        goto(`/verify/${productId.trim()}`);
    }
</script>

<svelte:head>
    <title>Verify Product | TearRubr</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed flex flex-col items-center justify-center p-6 text-slate-200">
    <div in:fly={{ y: 20, duration: 800 }} class="w-full max-w-lg">
        
        <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900/80 shadow-[0_0_40px_rgba(16,185,129,0.2)] border border-slate-700/50 mb-6 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h1 class="text-4xl font-extrabold tracking-tight text-white">
                Verify Authenticity
            </h1>
            <p class="text-slate-400 mt-3 text-lg">Enter a TearRubr Product ID or scan a QR code to establish its digital identity.</p>
        </div>

        <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <!-- decorative gradient -->
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>

            <form on:submit|preventDefault={verifyProduct} class="relative z-10 space-y-6">
                <div>
                    <label for="productId" class="sr-only">Product ID</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            id="productId"
                            bind:value={productId}
                            class="w-full pl-12 pr-4 py-4 bg-slate-950/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-white placeholder-slate-500 text-lg font-mono shadow-inner"
                            placeholder="e.g. 123e4567-e89b-12d3..."
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting || !productId}
                    class="w-full group relative px-6 py-4 font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if isSubmitting}
                        <span class="flex items-center justify-center gap-2">
                            Verifying...
                        </span>
                    {:else}
                        Verify Now
                    {/if}
                </button>
            </form>
        </div>
    </div>
</div>
