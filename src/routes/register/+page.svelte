<script lang="ts">
    import { fly, fade } from 'svelte/transition';
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
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    manufacturer,
                    name,
                    description,
                    blockchainTxHash: '0x' + Math.random().toString(16).slice(2)
                })
            });

            if (res.ok) {
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
    <meta name="description" content="Register a new product and generate a verifiable digital identity on the blockchain." />
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
        <a href="/dashboard" class="text-slate-400 hover:text-white text-sm font-medium transition-colors">← Dashboard</a>
    </nav>

    <div class="flex items-center justify-center px-6 py-16">
        <div in:fly={{ y: 20, duration: 600 }} class="w-full max-w-xl">
            <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden">
                <div class="p-8 md:p-10">
                    <div class="mb-8">
                        <h1 class="text-2xl font-extrabold tracking-tight text-white">Register New Product</h1>
                        <p class="text-slate-500 mt-1 text-sm">Generate a verifiable digital identity backed by the blockchain.</p>
                    </div>

                    {#if error}
                        <div in:fade class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    {/if}

                    <form onsubmit={(e) => { e.preventDefault(); registerProduct(); }} class="space-y-5">
                        <div class="space-y-1.5">
                            <label for="manufacturer" class="block text-sm font-medium text-slate-400">Manufacturer Name</label>
                            <input 
                                type="text" 
                                id="manufacturer"
                                bind:value={manufacturer}
                                disabled={isSubmitting}
                                class="w-full px-4 py-3 bg-slate-950/60 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition-all text-white placeholder-slate-600 text-sm"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label for="name" class="block text-sm font-medium text-slate-400">Product Name</label>
                            <input 
                                type="text" 
                                id="name"
                                bind:value={name}
                                disabled={isSubmitting}
                                class="w-full px-4 py-3 bg-slate-950/60 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition-all text-white placeholder-slate-600 text-sm"
                                placeholder="e.g. Super Widget Pro"
                            />
                        </div>

                        <div class="space-y-1.5">
                            <label for="description" class="block text-sm font-medium text-slate-400">Description <span class="text-slate-600">(optional)</span></label>
                            <textarea 
                                id="description"
                                bind:value={description}
                                disabled={isSubmitting}
                                rows="3"
                                class="w-full px-4 py-3 bg-slate-950/60 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 outline-none transition-all text-white placeholder-slate-600 resize-none text-sm"
                                placeholder="Product details, batch number, etc."
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            class="w-full px-6 py-3.5 font-semibold text-white rounded-xl bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            {#if isSubmitting}
                                <span class="flex items-center justify-center gap-2">
                                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering…
                                </span>
                            {:else}
                                Generate Identity & Register
                            {/if}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
