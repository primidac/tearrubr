<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    let manufacturer = $state('');
    let name = $state('');
    let description = $state('');
    let isSubmitting = $state(false);
    let error = $state('');

    async function registerProduct() {
        if (!manufacturer.trim() || !name.trim()) {
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
                    manufacturer: manufacturer.trim(),
                    name: name.trim(),
                    description: description.trim() || null,
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

<div class="min-h-screen bg-[#08080e]">
    <!-- Top bar -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
                </a>
                <div class="h-5 w-px bg-border"></div>
                <span class="text-sm text-text-tertiary">Register Product</span>
            </div>
            <a href="/dashboard" class="text-sm text-text-secondary hover:text-text-primary transition-colors">← Dashboard</a>
        </div>
    </nav>

    <div class="flex justify-center px-6 py-16">
        <div in:fly={{ y: 12, duration: 400 }} class="w-full max-w-md">
            <div class="mb-8">
                <h1 class="text-2xl font-extrabold tracking-tight text-text-primary">New Product</h1>
                <p class="text-sm text-text-tertiary mt-1">Generate a verifiable digital identity backed by the blockchain.</p>
            </div>

            {#if error}
                <div in:fade={{ duration: 200 }} class="mb-6 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {error}
                </div>
            {/if}

            <form onsubmit={(e) => { e.preventDefault(); registerProduct(); }} class="space-y-5">
                <div>
                    <label for="manufacturer" class="block text-sm font-medium text-text-secondary mb-1.5">Manufacturer</label>
                    <input 
                        type="text" 
                        id="manufacturer"
                        bind:value={manufacturer}
                        disabled={isSubmitting}
                        class="w-full px-3.5 py-2.5 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                        placeholder="e.g. Acme Corp"
                    />
                </div>

                <div>
                    <label for="name" class="block text-sm font-medium text-text-secondary mb-1.5">Product Name</label>
                    <input 
                        type="text" 
                        id="name"
                        bind:value={name}
                        disabled={isSubmitting}
                        class="w-full px-3.5 py-2.5 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                        placeholder="e.g. Precision Watch S1"
                    />
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-text-secondary mb-1.5">
                        Description <span class="text-text-tertiary font-normal">(optional)</span>
                    </label>
                    <textarea 
                        id="description"
                        bind:value={description}
                        disabled={isSubmitting}
                        rows="3"
                        class="w-full px-3.5 py-2.5 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none disabled:opacity-50"
                        placeholder="Product details, batch number, etc."
                    ></textarea>
                </div>

                <div class="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        class="w-full px-4 py-3 font-semibold text-white text-sm rounded-lg bg-accent hover:bg-accent-muted glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {#if isSubmitting}
                            <span class="flex items-center justify-center gap-2">
                                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering…
                            </span>
                        {:else}
                            Register Product
                        {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
