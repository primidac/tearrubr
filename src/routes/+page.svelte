<script lang="ts">
    import { fly } from 'svelte/transition';
</script>

<svelte:head>
    <title>TearRubr — Verify What's Real</title>
    <meta name="description" content="Blockchain-backed product authentication. Give physical products a verifiable digital identity that consumers can independently verify." />
</svelte:head>

<div class="min-h-screen bg-[#08080e]">

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[#08080e]/80 backdrop-blur-md">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span class="text-lg font-bold tracking-tight text-text-primary">TearRubr</span>
            </a>
            <div class="hidden md:flex items-center gap-8">
                <a href="#how-it-works" class="text-sm text-text-secondary hover:text-text-primary transition-colors">How it works</a>
                <a href="#why-blockchain" class="text-sm text-text-secondary hover:text-text-primary transition-colors">Why blockchain</a>
                <a href="/verify" class="text-sm text-text-secondary hover:text-text-primary transition-colors">Verify</a>
                <a href="/dashboard" class="text-sm font-medium text-text-primary px-4 py-2 rounded-lg border border-border hover:border-text-tertiary hover:bg-surface-raised transition-all">Dashboard</a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="pt-40 pb-24 px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-dots opacity-40"></div>
        <!-- Subtle top glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div class="max-w-6xl mx-auto relative z-10">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <!-- Left: Copy -->
                <div in:fly={{ y: 20, duration: 600 }}>
                    <p class="text-accent text-sm font-semibold tracking-wide uppercase mb-5">Product Authentication</p>
                    <h1 class="text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.1] mb-6">
                        Verify what's real<br />in a world full of<br />counterfeits.
                    </h1>
                    <p class="text-lg text-text-secondary leading-relaxed mb-10 max-w-lg">
                        TearRubr gives physical products a verifiable digital identity backed by blockchain — so consumers can independently verify authenticity without trusting the seller.
                    </p>
                    <div class="flex items-center gap-4">
                        <a href="/verify" class="px-6 py-3 rounded-lg bg-accent hover:bg-accent-muted text-white font-semibold text-sm glow-accent transition-all">
                            Verify a Product
                        </a>
                        <a href="/dashboard" class="px-6 py-3 rounded-lg border border-border hover:border-text-tertiary text-text-secondary hover:text-text-primary font-medium text-sm transition-all">
                            Manufacturer Portal
                        </a>
                    </div>
                </div>

                <!-- Right: Verification card mockup -->
                <div in:fly={{ y: 20, duration: 600, delay: 150 }} class="hidden lg:block">
                    <div class="bg-surface-raised border border-border rounded-xl p-6 max-w-sm ml-auto">
                        <!-- Card header -->
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-success">AUTHENTIC</p>
                                <p class="text-xs text-text-tertiary">Verified just now</p>
                            </div>
                        </div>
                        <!-- Card body -->
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between py-2 border-b border-border-subtle">
                                <span class="text-text-tertiary">Product</span>
                                <span class="text-text-primary font-medium">Precision Watch S1</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-border-subtle">
                                <span class="text-text-tertiary">Manufacturer</span>
                                <span class="text-text-primary font-medium">Horologix Ltd.</span>
                            </div>
                            <div class="flex justify-between py-2 border-b border-border-subtle">
                                <span class="text-text-tertiary">Product ID</span>
                                <span class="text-accent font-mono-tight text-xs">a3f7…c9d1</span>
                            </div>
                            <div class="flex justify-between py-2">
                                <span class="text-text-tertiary">On-chain</span>
                                <span class="text-accent font-mono-tight text-xs flex items-center gap-1">
                                    0x8b2e…4f01
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <!-- Decorative code line beneath the card -->
                    <div class="max-w-sm ml-auto mt-4 px-4 py-2.5 rounded-lg bg-surface border border-border-subtle font-mono-tight text-xs text-text-tertiary overflow-hidden">
                        <span class="text-text-secondary">$</span> tearrubr verify <span class="text-accent">--id</span> a3f7b2d1-e89b-4c67-9a12-c9d1f4e08b3a
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trust bar -->
    <div class="border-y border-border py-5 px-6">
        <div class="max-w-6xl mx-auto flex items-center justify-center gap-8 md:gap-16 text-xs text-text-tertiary font-medium tracking-wide uppercase">
            <span class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                EVM Compatible
            </span>
            <span class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Immutable Records
            </span>
            <span class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Open Source
            </span>
            <span class="hidden md:flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
                QR · NFC · Serial
            </span>
        </div>
    </div>

    <!-- The Problem -->
    <section class="py-28 px-6">
        <div class="max-w-3xl mx-auto">
            <p class="text-accent text-sm font-semibold tracking-wide uppercase mb-4">The Problem</p>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight mb-8">
                Consumers have no independent way to verify a product is genuine.
            </h2>
            <div class="space-y-5 text-text-secondary leading-relaxed">
                <p>
                    Counterfeit products are difficult to identify because consumers generally have to trust the seller, the packaging, serial numbers, and logos. <strong class="text-text-primary">Those signals can all be copied.</strong>
                </p>
                <p>
                    A counterfeit product can have convincing packaging, a copied serial number, and even a fake verification website. The fundamental problem is that the customer has no independent way to establish that the product they're holding corresponds to a legitimate record created by the manufacturer.
                </p>
            </div>

            <!-- Visual: what can be faked -->
            <div class="mt-12 grid grid-cols-2 md:grid-cols-3 gap-3">
                {#each ['Packaging', 'Serial Numbers', 'Logos & Branding', 'QR Codes', 'Holograms', 'Seller Claims'] as item}
                    <div class="px-4 py-3 rounded-lg bg-surface-raised border border-border text-sm text-text-secondary flex items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-danger shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                        {item}
                    </div>
                {/each}
            </div>
        </div>
    </section>

    <!-- How it Works -->
    <section id="how-it-works" class="py-28 px-6 border-t border-border">
        <div class="max-w-3xl mx-auto">
            <p class="text-accent text-sm font-semibold tracking-wide uppercase mb-4">How It Works</p>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight mb-16">
                Three steps to verified authenticity.
            </h2>

            <!-- Vertical timeline -->
            <div class="relative">
                <!-- Timeline line -->
                <div class="absolute left-5 top-0 bottom-0 w-px bg-border"></div>

                <!-- Step 1 -->
                <div class="relative pl-14 pb-14">
                    <div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-sm font-bold text-accent">
                        1
                    </div>
                    <h3 class="text-lg font-bold text-text-primary mb-2">Manufacturer registers a product</h3>
                    <p class="text-text-secondary leading-relaxed">
                        A manufacturer creates a product record through TearRubr. The product receives a unique identity that can be represented physically using QR codes, serial numbers, or NFC tags.
                    </p>
                </div>

                <!-- Step 2 -->
                <div class="relative pl-14 pb-14">
                    <div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-sm font-bold text-accent">
                        2
                    </div>
                    <h3 class="text-lg font-bold text-text-primary mb-2">Identity is committed on-chain</h3>
                    <p class="text-text-secondary leading-relaxed">
                        Important authenticity events are committed to a smart contract on the blockchain, creating a persistent record that cannot be silently rewritten by changing a conventional database.
                    </p>
                </div>

                <!-- Step 3 -->
                <div class="relative pl-14">
                    <div class="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-sm font-bold text-accent">
                        3
                    </div>
                    <h3 class="text-lg font-bold text-text-primary mb-2">Consumer verifies independently</h3>
                    <p class="text-text-secondary leading-relaxed">
                        A customer scans the identifier or enters the product ID. TearRubr retrieves the corresponding product record, checks its authenticity state against the on-chain data, and returns a clear result.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Blockchain -->
    <section id="why-blockchain" class="py-28 px-6 border-t border-border">
        <div class="max-w-3xl mx-auto">
            <p class="text-accent text-sm font-semibold tracking-wide uppercase mb-4">Why Blockchain</p>
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary leading-tight mb-8">
                Blockchain is infrastructure.<br />Verification is the product.
            </h2>
            <p class="text-text-secondary leading-relaxed mb-12">
                A traditional database can only tell a customer: <em>"This product is authentic because our database says so."</em> That requires complete trust in the database operator. TearRubr uses blockchain for the parts of the verification process where tamper resistance and independent verification matter — and conventional infrastructure for everything else.
            </p>

            <!-- Architecture flow -->
            <div class="bg-surface-raised border border-border rounded-xl p-6">
                <div class="font-mono-tight text-sm text-text-tertiary space-y-2">
                    <div class="flex items-center gap-3">
                        <span class="text-text-secondary w-28">Physical</span>
                        <span class="text-border">──────►</span>
                        <span class="text-text-primary font-medium">Unique Product Identity</span>
                    </div>
                    <div class="flex items-center gap-3 pl-36">
                        <span class="text-border">├──►</span>
                        <span class="text-text-secondary">Application Database</span>
                    </div>
                    <div class="flex items-center gap-3 pl-36">
                        <span class="text-border">└──►</span>
                        <span class="text-accent font-medium">Blockchain Record</span>
                        <span class="text-border">──►</span>
                        <span class="text-success">Verification Proof</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-28 px-6 border-t border-border relative overflow-hidden">
        <div class="absolute inset-0 bg-dots opacity-30"></div>
        <div class="max-w-2xl mx-auto text-center relative z-10">
            <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-5">
                Ready to authenticate your products?
            </h2>
            <p class="text-text-secondary mb-10 text-lg">
                Register your products with TearRubr and give your customers the ability to verify authenticity independently.
            </p>
            <div class="flex items-center justify-center gap-4">
                <a href="/register" class="px-6 py-3 rounded-lg bg-accent hover:bg-accent-muted text-white font-semibold text-sm glow-accent transition-all">
                    Register a Product
                </a>
                <a href="/verify" class="px-6 py-3 rounded-lg border border-border hover:border-text-tertiary text-text-secondary hover:text-text-primary font-medium text-sm transition-all">
                    Try Verification
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border py-10 px-6">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-2.5">
                <div class="w-6 h-6 rounded bg-accent flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span class="text-sm font-semibold text-text-primary">TearRubr</span>
            </div>
            <p class="text-xs text-text-tertiary">© 2026 TearRubr. All rights reserved.</p>
            <div class="flex gap-6 text-sm">
                <a href="/dashboard" class="text-text-tertiary hover:text-text-primary transition-colors">Dashboard</a>
                <a href="/verify" class="text-text-tertiary hover:text-text-primary transition-colors">Verify</a>
                <a href="https://github.com/primidac/tearrubr" target="_blank" rel="noopener noreferrer" class="text-text-tertiary hover:text-text-primary transition-colors">GitHub</a>
            </div>
        </div>
    </footer>
</div>
