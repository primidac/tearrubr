<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    let manufacturer = $state('');
    let name = $state('');
    let description = $state('');
    let isSubmitting = $state(false);
    let error = $state('');

    async function registerProduct() {
        if (!manufacturer || !name) {
            error = 'Manufacturer and Product Name are required.';
            return;
        }

        isSubmitting = true;
        error = '';

        try {
            // Note: In a real app, you would also trigger the smart contract tx here via ethers.js
            // For MVP UI, we'll simulate the backend registration first.
            
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    manufacturer,
                    name,
                    description,
                    blockchainTxHash: '0x' + Math.random().toString(16).slice(2) // Simulated Tx Hash
                })
            });

            if (res.ok) {
                const data = await res.json();
                goto('/dashboard');
            } else {
                const errData = await res.json();
                error = errData.error || 'Failed to register product.';
            }
        } catch (err) {
            error = 'Network error. Please try again.';
        } finally {
            isSubmitting = false;
        }
    }
</script>

<svelte:head>
    <title>Register Product | TearRubr</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed flex items-center justify-center p-6 text-slate-200">
    <div in:fly={{ y: 20, duration: 800 }} class="w-full max-w-xl">
        <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-8 md:p-10">
                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Register New Product
                    </h1>
                    <p class="text-slate-400 mt-2">Generate a verifiable digital identity.</p>
                </div>

                {#if error}
                    <div in:fade class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                        {error}
                    </div>
                {/if}

                <form onsubmit={(e) => { e.preventDefault(); registerProduct(); }} class="space-y-6">
                    <div class="space-y-2">
                        <label for="manufacturer" class="block text-sm font-medium text-slate-300">Manufacturer Name</label>
                        <input 
                            type="text" 
                            id="manufacturer"
                            bind:value={manufacturer}
                            disabled={isSubmitting}
                            class="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-white placeholder-slate-500"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>

                    <div class="space-y-2">
                        <label for="name" class="block text-sm font-medium text-slate-300">Product Name</label>
                        <input 
                            type="text" 
                            id="name"
                            bind:value={name}
                            disabled={isSubmitting}
                            class="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-white placeholder-slate-500"
                            placeholder="e.g. Super Widget Pro"
                        />
                    </div>

                    <div class="space-y-2">
                        <label for="description" class="block text-sm font-medium text-slate-300">Description (Optional)</label>
                        <textarea 
                            id="description"
                            bind:value={description}
                            disabled={isSubmitting}
                            rows="3"
                            class="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-white placeholder-slate-500 resize-none"
                            placeholder="Product details, batch number, etc."
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        class="w-full group relative px-6 py-4 font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {#if isSubmitting}
                            <span class="flex items-center justify-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        {:else}
                            Generate Identity & Register
                        {/if}
                    </button>
                </form>
                
                <div class="mt-8 text-center text-sm text-slate-500">
                    <a href="/dashboard" class="hover:text-cyan-400 transition-colors">&larr; Back to Dashboard</a>
                </div>
            </div>
        </div>
    </div>
</div>
