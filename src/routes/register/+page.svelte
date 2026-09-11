<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Logo from '$lib/components/Logo.svelte';

    let activeTab = $state<'single' | 'batch'>('batch');

    // Single item state
    let manufacturer = $state('');
    let name = $state('');
    let description = $state('');

    // Batch state
    let batchManufacturer = $state('The Coca-Cola Company');
    let batchProductName = $state('Coca-Cola Original Taste 500ml');
    let batchNumber = $state('LOT-2026-ATL-09');
    let batchQuantity = $state(25);
    let batchFacility = $state('Atlanta Bottling Plant #4, Line 2');

    let isSubmitting = $state(false);
    let error = $state('');

    // Batch result modal/view state
    let batchResult = $state<{
        batchId: string;
        batchNumber: string;
        manufacturer: string;
        productName: string;
        quantity: number;
        merkleRoot: string;
        blockchainTxHash: string | null;
        csvManifest: string;
    } | null>(null);

    function autoBatchNumber() {
        const year = new Date().getFullYear();
        const rand = Math.floor(1000 + Math.random() * 9000);
        batchNumber = `LOT-${year}-RUN-${rand}`;
    }

    async function registerSingleProduct() {
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
                    description: description.trim() || null
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

    async function registerBatchRun() {
        if (!batchManufacturer.trim() || !batchProductName.trim() || !batchNumber.trim() || !batchQuantity) {
            error = 'All batch fields are required.';
            return;
        }

        isSubmitting = true;
        error = '';

        try {
            const res = await fetch('/api/batches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    manufacturer: batchManufacturer.trim(),
                    productName: batchProductName.trim(),
                    batchNumber: batchNumber.trim(),
                    quantity: batchQuantity,
                    description: batchFacility.trim() || null
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                batchResult = data;
            } else {
                error = data.error || 'Failed to register batch.';
            }
        } catch (err) {
            error = 'Network error connecting to batch server.';
        } finally {
            isSubmitting = false;
        }
    }

    function downloadCsvManifest() {
        if (!batchResult?.csvManifest) return;
        const blob = new Blob([batchResult.csvManifest], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `TearRubr_${batchResult.batchNumber}_Manifest.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
</script>

<svelte:head>
    <title>Register Products | TearRubr Portal</title>
    <meta name="description" content="Register single products or high-volume industrial batches on the TearRubr public blockchain." />
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary">
    <!-- Top bar -->
    <nav class="border-b border-border bg-[#08080e]">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-6">
                <a href="/" class="flex items-center gap-2.5">
                    <Logo size={28} />
                    <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
                </a>
                <div class="h-5 w-px bg-border"></div>
                <span class="text-sm text-text-tertiary">Manufacturer Registration</span>
            </div>
            <div class="flex items-center gap-4">
                <a href="/verify" class="text-sm text-text-secondary hover:text-text-primary transition-colors">Public Ledger</a>
                <a href="/dashboard" class="text-sm text-text-secondary hover:text-text-primary transition-colors">← Dashboard</a>
            </div>
        </div>
    </nav>

    <div class="flex justify-center px-6 py-12">
        <div in:fly={{ y: 12, duration: 400 }} class="w-full max-w-xl">
            
            {#if batchResult}
                <!-- Batch Registration Success View -->
                <div class="border border-success/20 rounded-2xl bg-surface-raised overflow-hidden p-8 shadow-2xl">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <span class="text-xs font-semibold uppercase tracking-wider text-success">Batch Confirmed</span>
                            <h2 class="text-xl font-bold text-text-primary">{batchResult.quantity} Units Minted On-Chain</h2>
                        </div>
                    </div>

                    <p class="text-sm text-text-secondary mb-6 leading-relaxed">
                        The entire production batch was committed to the Ethereum Sepolia smart contract in <strong>a single cryptographic transaction</strong>. All bottle serials are secured by the Merkle root below.
                    </p>

                    <div class="space-y-3 bg-surface p-4 rounded-xl border border-border text-xs font-mono-tight mb-8">
                        <div class="flex justify-between py-1 border-b border-border">
                            <span class="text-text-tertiary">Batch / Lot #</span>
                            <span class="text-text-primary font-bold">{batchResult.batchNumber}</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-border">
                            <span class="text-text-tertiary">Product</span>
                            <span class="text-text-primary">{batchResult.productName}</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-border">
                            <span class="text-text-tertiary">Quantity</span>
                            <span class="text-accent font-bold">{batchResult.quantity} units</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-border">
                            <span class="text-text-tertiary">Merkle Root</span>
                            <span class="text-accent break-all">{batchResult.merkleRoot}</span>
                        </div>
                        {#if batchResult.blockchainTxHash}
                            <div class="flex justify-between py-1">
                                <span class="text-text-tertiary">On-Chain Tx</span>
                                <a 
                                    href="https://sepolia.etherscan.io/tx/{batchResult.blockchainTxHash}" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    class="text-accent hover:underline flex items-center gap-1"
                                >
                                    {batchResult.blockchainTxHash.slice(0, 10)}…{batchResult.blockchainTxHash.slice(-8)}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        {/if}
                    </div>

                    <div class="space-y-3">
                        <button 
                            type="button" 
                            onclick={downloadCsvManifest}
                            class="w-full py-3.5 px-4 rounded-xl bg-accent hover:bg-accent-muted text-white font-semibold text-sm flex items-center justify-center gap-2 glow-accent transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Factory Print Manifest (CSV)
                        </button>

                        <div class="grid grid-cols-2 gap-3 pt-2">
                            <a 
                                href="/verify?q={batchResult.batchNumber}" 
                                class="py-2.5 px-3 rounded-lg border border-border hover:border-text-tertiary text-text-secondary hover:text-text-primary text-xs font-medium text-center transition-all"
                            >
                                View in Public Ledger →
                            </a>
                            <a 
                                href="/dashboard" 
                                class="py-2.5 px-3 rounded-lg border border-border hover:border-text-tertiary text-text-secondary hover:text-text-primary text-xs font-medium text-center transition-all"
                            >
                                Go to Dashboard →
                            </a>
                        </div>
                    </div>
                </div>

            {:else}
                <!-- Registration Tabs Header -->
                <div class="mb-6 text-center">
                    <h1 class="text-2xl font-extrabold tracking-tight text-text-primary">Manufacturer Portal</h1>
                    <p class="text-sm text-text-tertiary mt-1">Register products or industrial high-volume batches with cryptographic proof.</p>
                </div>

                <!-- Tab Toggle -->
                <div class="grid grid-cols-2 p-1 bg-surface border border-border rounded-xl mb-8">
                    <button 
                        type="button" 
                        onclick={() => { activeTab = 'batch'; error = ''; }}
                        class="py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 {activeTab === 'batch' ? 'bg-surface-raised text-text-primary border border-border shadow-sm' : 'text-text-tertiary hover:text-text-primary'}"
                    >
                        <span class="w-2 h-2 rounded-full {activeTab === 'batch' ? 'bg-accent' : 'bg-transparent'}"></span>
                        Batch Production Run (FMCG)
                    </button>
                    <button 
                        type="button" 
                        onclick={() => { activeTab = 'single'; error = ''; }}
                        class="py-2.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 {activeTab === 'single' ? 'bg-surface-raised text-text-primary border border-border shadow-sm' : 'text-text-tertiary hover:text-text-primary'}"
                    >
                        <span class="w-2 h-2 rounded-full {activeTab === 'single' ? 'bg-accent' : 'bg-transparent'}"></span>
                        Single Item (Luxury / Serialized)
                    </button>
                </div>

                {#if error}
                    <div in:fade={{ duration: 200 }} class="mb-6 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                        {error}
                    </div>
                {/if}

                {#if activeTab === 'batch'}
                    <!-- BATCH PRODUCTION FORM -->
                    <div class="bg-surface-raised border border-border rounded-2xl p-6 sm:p-8">
                        <div class="flex items-center justify-between pb-4 mb-6 border-b border-border">
                            <div>
                                <h2 class="text-base font-bold text-text-primary">Batch Production Run</h2>
                                <p class="text-xs text-text-tertiary">Cryptographic Merkle rollup · 1 Sepolia transaction</p>
                            </div>
                            <span class="text-[11px] font-mono-tight px-2.5 py-1 rounded bg-surface border border-border text-accent">
                                High-Volume Mode
                            </span>
                        </div>

                        <form onsubmit={(e) => { e.preventDefault(); registerBatchRun(); }} class="space-y-5">
                            <div>
                                <label for="batchManufacturer" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Manufacturer</label>
                                <input 
                                    type="text" 
                                    id="batchManufacturer"
                                    bind:value={batchManufacturer}
                                    disabled={isSubmitting}
                                    class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                    placeholder="e.g. The Coca-Cola Company"
                                />
                            </div>

                            <div>
                                <label for="batchProductName" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Product Name</label>
                                <input 
                                    type="text" 
                                    id="batchProductName"
                                    bind:value={batchProductName}
                                    disabled={isSubmitting}
                                    class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                    placeholder="e.g. Coca-Cola Original Taste 500ml"
                                />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div class="flex items-center justify-between mb-1.5">
                                        <label for="batchNumber" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider">Lot / Batch Number</label>
                                        <button 
                                            type="button" 
                                            onclick={autoBatchNumber}
                                            class="text-[10px] text-accent hover:underline font-mono-tight"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="batchNumber"
                                        bind:value={batchNumber}
                                        disabled={isSubmitting}
                                        class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary font-mono-tight placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                        placeholder="e.g. LOT-2026-ATL-09"
                                    />
                                </div>

                                <div>
                                    <label for="batchQuantity" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Run Size (Units)</label>
                                    <input 
                                        type="number" 
                                        id="batchQuantity"
                                        min="1"
                                        max="1000"
                                        bind:value={batchQuantity}
                                        disabled={isSubmitting}
                                        class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary font-mono-tight placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <!-- Quick quantity presets -->
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-text-tertiary">Presets:</span>
                                {#each [10, 25, 50, 100, 250] as size}
                                    <button 
                                        type="button"
                                        onclick={() => batchQuantity = size}
                                        class="px-2.5 py-1 text-xs rounded border border-border hover:border-text-tertiary font-mono-tight text-text-secondary hover:text-text-primary {batchQuantity === size ? 'bg-accent/10 border-accent/40 text-accent font-bold' : 'bg-surface'}"
                                    >
                                        {size}
                                    </button>
                                {/each}
                            </div>

                            <div>
                                <label for="batchFacility" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                                    Bottling Plant / Line Notes
                                </label>
                                <input 
                                    type="text" 
                                    id="batchFacility"
                                    bind:value={batchFacility}
                                    disabled={isSubmitting}
                                    class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                    placeholder="e.g. Atlanta Bottling Plant #4, Line 2"
                                />
                            </div>

                            <!-- Industrial preview callout -->
                            <div class="p-3.5 rounded-xl bg-surface border border-border text-xs text-text-tertiary space-y-1">
                                <div class="flex justify-between text-text-secondary font-medium">
                                    <span>Serialization Scheme:</span>
                                    <span class="font-mono-tight text-accent">{batchNumber}-0001 → {batchNumber}-{String(batchQuantity).padStart(4, '0')}</span>
                                </div>
                                <p>Generates {batchQuantity} unique digital identities and commits the Merkle Root on Ethereum Sepolia in 1 single transaction.</p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                class="w-full px-4 py-3.5 font-semibold text-white text-sm rounded-lg bg-accent hover:bg-accent-muted glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {#if isSubmitting}
                                    <span class="flex items-center justify-center gap-2">
                                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Minting Batch on Sepolia Testnet…
                                    </span>
                                {:else}
                                    Register Batch ({batchQuantity} Units) On-Chain
                                {/if}
                            </button>
                        </form>
                    </div>

                {:else}
                    <!-- SINGLE ITEM FORM -->
                    <div class="bg-surface-raised border border-border rounded-2xl p-6 sm:p-8">
                        <div class="flex items-center justify-between pb-4 mb-6 border-b border-border">
                            <div>
                                <h2 class="text-base font-bold text-text-primary">Single Product Registration</h2>
                                <p class="text-xs text-text-tertiary">Ideal for luxury watches, electronics, and bespoke goods</p>
                            </div>
                            <span class="text-[11px] font-mono-tight px-2.5 py-1 rounded bg-surface border border-border text-accent">
                                1:1 Identity
                            </span>
                        </div>

                        <form onsubmit={(e) => { e.preventDefault(); registerSingleProduct(); }} class="space-y-5">
                            <div>
                                <label for="manufacturer" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Manufacturer</label>
                                <input 
                                    type="text" 
                                    id="manufacturer"
                                    bind:value={manufacturer}
                                    disabled={isSubmitting}
                                    class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            <div>
                                <label for="name" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">Product Name</label>
                                <input 
                                    type="text" 
                                    id="name"
                                    bind:value={name}
                                    disabled={isSubmitting}
                                    class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all disabled:opacity-50"
                                    placeholder="e.g. Precision Watch S1"
                                />
                            </div>

                            <div>
                                <label for="description" class="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                                    Description <span class="text-text-tertiary font-normal">(optional)</span>
                                </label>
                                <textarea 
                                    id="description"
                                    bind:value={description}
                                    disabled={isSubmitting}
                                    rows="3"
                                    class="w-full px-3.5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none disabled:opacity-50"
                                    placeholder="Product details, serial number, batch, etc."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                class="w-full px-4 py-3.5 font-semibold text-white text-sm rounded-lg bg-accent hover:bg-accent-muted glow-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {#if isSubmitting}
                                    <span class="flex items-center justify-center gap-2">
                                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Recording on-chain (Sepolia)…
                                    </span>
                                {:else}
                                    Register Product
                                {/if}
                            </button>
                        </form>
                    </div>
                {/if}
            {/if}

        </div>
    </div>
</div>
