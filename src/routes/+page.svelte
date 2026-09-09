<script lang="ts">
    import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
    <title>TearRubr | Absolute Supply Chain Trust</title>
</svelte:head>

<div class="min-h-screen bg-[#0A0F1C] text-slate-200 font-sans selection:bg-blue-500/30">
    
    <!-- Subtle Background Glows (Blue Theme) -->
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

    <!-- Navigation -->
    <nav class="w-full px-8 py-6 flex items-center justify-between relative z-10 border-b border-white/5 bg-[#0A0F1C]/80 backdrop-blur-md sticky top-0">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <span class="text-2xl font-bold tracking-tight text-white">TearRubr</span>
        </div>
        <div class="hidden md:flex gap-8 items-center">
            <a href="#problem" class="text-slate-400 hover:text-white transition-colors text-sm font-medium">The Problem</a>
            <a href="#how-it-works" class="text-slate-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
            <a href="/verify" class="text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm">Verify Product</a>
            <a href="/dashboard" class="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all text-sm">Manufacturer Portal</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative z-10 px-6 pt-32 pb-24 border-b border-white/5">
        <div class="max-w-5xl mx-auto text-center">
            
            <h1 in:fly={{ y: 20, duration: 800, delay: 100 }} class="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-8">
                Verifying what's real in a <br />
                <span class="text-blue-500">world full of counterfeits.</span>
            </h1>
            
            <p in:fly={{ y: 20, duration: 800, delay: 200 }} class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Make it possible to verify a physical product without having to trust the seller. TearRubr gives physical products a verifiable digital identity backed by blockchain.
            </p>

            <div in:fly={{ y: 20, duration: 800, delay: 300 }} class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/dashboard" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all duration-200">
                    Register a Product
                </a>
                
                <a href="/verify" class="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111827] border border-slate-700 text-slate-200 font-semibold hover:bg-[#1F2937] transition-all duration-200 flex items-center justify-center gap-2">
                    Verify Authenticity
                </a>
            </div>
        </div>
    </main>

    <!-- The Problem Section -->
    <section id="problem" class="py-24 px-6 border-b border-white/5 bg-[#0F172A]/50">
        <div class="max-w-6xl mx-auto">
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">The Trust Deficit</h2>
                    <p class="text-slate-400 text-lg leading-relaxed mb-6">
                        Counterfeit products are difficult to identify because consumers generally have to trust the seller, the packaging, serial numbers, and logos. <strong>Those signals can all be copied.</strong>
                    </p>
                    <p class="text-slate-400 text-lg leading-relaxed">
                        A counterfeit product can have convincing packaging, a copied serial number, and even a fake verification website. The fundamental problem is that the customer has no independent way to establish that the product they're holding corresponds to a legitimate record created by the manufacturer.
                    </p>
                </div>
                <div class="bg-[#1E293B] border border-slate-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <span class="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">✕</span>
                        Traditional Verification
                    </h3>
                    <ul class="space-y-4 text-slate-400">
                        <li class="flex items-start gap-3"><span class="text-slate-600">•</span> You must trust the seller completely.</li>
                        <li class="flex items-start gap-3"><span class="text-slate-600">•</span> Holograms and packaging are easily cloned.</li>
                        <li class="flex items-start gap-3"><span class="text-slate-600">•</span> Centralized databases can be altered silently.</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="py-24 px-6 border-b border-white/5 relative">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">How TearRubr Works</h2>
                <p class="text-slate-400 text-lg max-w-2xl mx-auto">A modular system bridging physical goods and decentralized trust.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Step 1 -->
                <div class="bg-[#111827] border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 flex items-center justify-center text-xl font-bold mb-6">1</div>
                    <h3 class="text-xl font-bold text-white mb-3">Identity Creation</h3>
                    <p class="text-slate-400 leading-relaxed">
                        A manufacturer registers a product. It receives a unique identity that can be represented physically using QR codes, serial numbers, or NFC tags.
                    </p>
                </div>

                <!-- Step 2 -->
                <div class="bg-[#111827] border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 flex items-center justify-center text-xl font-bold mb-6">2</div>
                    <h3 class="text-xl font-bold text-white mb-3">Immutable Record</h3>
                    <p class="text-slate-400 leading-relaxed">
                        Important authenticity events are committed to a smart contract on the blockchain, creating a persistent record that cannot be silently rewritten.
                    </p>
                </div>

                <!-- Step 3 -->
                <div class="bg-[#111827] border border-slate-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors">
                    <div class="w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 flex items-center justify-center text-xl font-bold mb-6">3</div>
                    <h3 class="text-xl font-bold text-white mb-3">Simple Verification</h3>
                    <p class="text-slate-400 leading-relaxed">
                        A customer scans the identifier. TearRubr retrieves the corresponding product record and checks its authenticity state against the on-chain data.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Blockchain -->
    <section class="py-24 px-6 bg-[#0A0F1C]">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Blockchain as a Trust Layer</h2>
            <p class="text-slate-400 text-lg leading-relaxed mb-10">
                Blockchain is not being used simply because the project involves Web3. It solves a specific trust problem. 
                A traditional database requires the customer to completely trust the database operator. TearRubr instead uses blockchain for the parts of the verification process where tamper resistance matters.
            </p>
            <div class="inline-flex items-center justify-center p-1 rounded-xl bg-slate-800/50 border border-slate-700">
                <div class="px-6 py-3 text-slate-300 font-medium">Physical Product</div>
                <div class="text-slate-500 px-2">→</div>
                <div class="px-6 py-3 text-blue-400 font-medium border-b-2 border-blue-500">Digital Identity</div>
                <div class="text-slate-500 px-2">→</div>
                <div class="px-6 py-3 text-slate-300 font-medium">On-Chain Proof</div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="w-full py-12 px-6 border-t border-white/5 bg-[#0A0F1C]">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span class="font-bold text-white">TearRubr</span>
            </div>
            <p class="text-slate-500 text-sm">© 2026 TearRubr MVP. Built for the Hackathon.</p>
            <div class="flex gap-4">
                <a href="https://github.com/primidac/tearrubr" class="text-slate-500 hover:text-white transition-colors">GitHub Repository</a>
            </div>
        </div>
    </footer>
</div>
