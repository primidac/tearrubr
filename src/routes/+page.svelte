<script lang="ts">
    import { fly } from 'svelte/transition';
    import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
    <title>TearRubr — Verify What's Real</title>
    <meta name="description" content="Blockchain-backed product authentication. Give physical products a verifiable digital identity that consumers can independently verify." />
</svelte:head>

<div class="min-h-screen bg-[#08080e]">

    <!-- Floating Dock Navigation (Sahara AI style) -->
    <header class="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
        <nav class="max-w-5xl w-full mx-auto px-5 py-2.5 rounded-full bg-[#0a0a14]/75 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center justify-between transition-all duration-200">
            <a href="/" class="flex items-center gap-2.5">
                <Logo size={24} />
                <span class="text-[15px] font-bold tracking-tight text-white font-display">TearRubr</span>
            </a>
            
            <div class="hidden md:flex items-center gap-7 text-xs font-medium text-text-secondary">
                <a href="/verify" class="hover:text-white transition-colors">Public Ledger</a>
                <a href="#how-it-works" class="hover:text-white transition-colors">How it works</a>
                <a href="#why-blockchain" class="hover:text-white transition-colors">Why blockchain</a>
                <a href="/register" class="hover:text-white transition-colors">Register</a>
            </div>

            <div class="flex items-center gap-3">
                <a href="/dashboard" class="rounded-full px-5 py-2 text-xs font-semibold bg-white text-[#08080e] hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm font-display">
                    Dashboard
                </a>
            </div>
        </nav>
    </header>

    <!-- Hero Section (Sahara AI luminous atmosphere with TearRubr palette) -->
    <section class="pt-36 md:pt-44 pb-28 md:pb-36 px-6 relative overflow-hidden flex flex-col items-center justify-center">
        
        <!-- Atmospheric Luminous Blooms (Our Palette: Electric Indigo, Cyan, Emerald & Iris) -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <!-- Top Right Bloom (Electric Indigo / Violet Aura) -->
            <div class="absolute -top-12 -right-16 w-[550px] h-[550px] rounded-full bg-[#6366f1]/25 blur-[130px]"></div>
            
            <!-- Bottom Left Bloom (Cryptographic Mint / Emerald & Cyan Aura) -->
            <div class="absolute -bottom-16 -left-20 w-[580px] h-[580px] rounded-full bg-[#10b981]/20 blur-[130px]"></div>
            <div class="absolute bottom-10 left-10 w-[380px] h-[380px] rounded-full bg-[#06b6d4]/15 blur-[100px]"></div>
            
            <!-- Center Soft Wash (Deep Iris) -->
            <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full bg-[#4f46e5]/15 blur-[140px]"></div>

            <!-- Geometric Rosette / Ray Watermark in Bottom Left (Sahara AI signature detail) -->
            <div class="absolute bottom-8 left-6 md:left-14 opacity-15">
                <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-400">
                    <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    <line x1="14.6" y1="14.6" x2="85.4" y2="85.4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    <line x1="85.4" y1="14.6" x2="14.6" y2="85.4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                    <line x1="30" y1="5" x2="70" y2="95" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 4" />
                    <line x1="5" y1="30" x2="95" y2="70" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 4" />
                    <circle cx="50" cy="50" r="18" stroke="currentColor" stroke-width="1.5" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" />
                </svg>
            </div>
        </div>

        <!-- Subtle Dot Grid Overlay for Architectural Precision -->
        <div class="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>

        <!-- Main Hero Content -->
        <div class="max-w-4xl mx-auto relative z-10 text-center px-4" in:fly={{ y: 24, duration: 700 }}>
            
            <!-- Live Protocol Badge -->
            <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 hover:bg-white/[0.07] transition-all">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-xs font-medium text-[#c0c0d4] tracking-wide font-display">Ethereum Sepolia Live · Cryptographic Tamper-Proof Protocol</span>
            </div>

            <!-- Sahara AI Style Editorial Headline -->
            <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-white leading-[1.06] mb-7 font-display">
                Built for Real Products,<br class="hidden sm:inline" /> Open for Everyone
            </h1>

            <!-- Subtitle -->
            <p class="text-base sm:text-lg md:text-xl text-[#9da3b4] leading-relaxed max-w-2xl mx-auto mb-11 font-normal font-sans">
                TearRubr delivers trusted cryptographic product identities, tamper-evident physical seals, and immutable on-chain verification for brands and consumers worldwide.
            </p>

            <!-- Dual Pill Buttons (Sahara AI style) -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <!-- Primary Solid Pill Button -->
                <a 
                    href="/verify" 
                    class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#08080e] hover:bg-[#12121e] border border-white/20 hover:border-white/30 text-white font-medium text-sm transition-all duration-200 shadow-xl hover:scale-[1.02] active:scale-[0.98] font-display flex items-center justify-center gap-2.5"
                >
                    <span>Public Ledger Explorer</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>

                <!-- Secondary Frosted Glass Pill Button -->
                <a 
                    href="/register" 
                    class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.07] hover:bg-white/[0.13] border border-white/10 hover:border-white/20 text-white font-medium text-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-display"
                >
                    Manufacturer Portal
                </a>
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
                    Public Ledger
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border py-10 px-6">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-2.5">
                <Logo size={22} />
                <span class="text-sm font-semibold text-text-primary">TearRubr</span>
            </div>
            <p class="text-xs text-text-tertiary">© 2026 TearRubr. All rights reserved.</p>
            <div class="flex gap-6 text-sm">
                <a href="/dashboard" class="text-text-tertiary hover:text-text-primary transition-colors">Dashboard</a>
                <a href="/verify" class="text-text-tertiary hover:text-text-primary transition-colors">Public Ledger</a>
                <a href="https://github.com/primidac/tearrubr" target="_blank" rel="noopener noreferrer" class="text-text-tertiary hover:text-text-primary transition-colors">GitHub</a>
            </div>
        </div>
    </footer>
</div>
