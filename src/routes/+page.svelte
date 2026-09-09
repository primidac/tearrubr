<script lang="ts">
    import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
    <title>TearRubr | Absolute Supply Chain Trust</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed font-sans text-slate-200 selection:bg-blue-500/30">
    
    <!-- Hero & Navbar Section -->
    <div class="relative flex flex-col min-h-screen overflow-hidden">
        <!-- Background glow effects -->
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none"></div>

        <!-- Navigation Bar -->
        <nav class="w-full px-8 py-6 flex items-center justify-between relative z-50">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span class="text-2xl font-black tracking-tight text-white">Tear<span class="text-blue-500">Rubr</span></span>
            </div>
            <div class="hidden md:flex gap-6 items-center">
                <a href="#problem" class="text-slate-300 hover:text-white font-medium transition-colors">The Problem</a>
                <a href="#how-it-works" class="text-slate-300 hover:text-white font-medium transition-colors">How it Works</a>
                <a href="/verify" class="text-slate-300 hover:text-white font-medium transition-colors">Verify Product</a>
                <a href="/dashboard" class="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold backdrop-blur-md transition-all">Manufacturer Login</a>
            </div>
        </nav>

        <!-- Hero Section -->
        <main class="flex-grow flex items-center justify-center relative z-10 px-6 pt-10 pb-32">
            <div class="max-w-5xl mx-auto text-center">
                
                <h1 in:fly={{ y: 30, duration: 1000, delay: 100 }} class="text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-tight mb-6">
                    Absolute Trust for <br />
                    <span class="text-blue-500">Physical Products.</span>
                </h1>
                
                <p in:fly={{ y: 30, duration: 1000, delay: 200 }} class="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                    TearRubr generates cryptographically secure, blockchain-backed digital identities for physical goods, eliminating counterfeits and establishing provenance.
                </p>

                <div in:fly={{ y: 30, duration: 1000, delay: 300 }} class="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a href="/dashboard" class="w-full sm:w-auto px-8 py-5 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:bg-blue-500 hover:scale-105 transition-all duration-300">
                        Manufacturer Portal
                    </a>
                    
                    <a href="/verify" class="w-full sm:w-auto px-8 py-5 rounded-2xl bg-slate-900/80 border border-slate-700 text-slate-200 font-bold text-lg backdrop-blur-xl hover:bg-slate-800 hover:border-slate-500 transition-all duration-300 flex items-center justify-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Verify Authenticity
                    </a>
                </div>
            </div>
        </main>
    </div>

    <!-- Divider -->
    <div class="w-full h-px bg-blue-500/20"></div>

    <!-- The Problem Section -->
    <section id="problem" class="py-32 px-6 relative z-10">
        <div class="max-w-6xl mx-auto">
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 class="text-4xl font-extrabold text-white mb-6">The Trust Deficit</h2>
                    <p class="text-slate-400 text-lg leading-relaxed mb-6">
                        Counterfeit products are difficult to identify because consumers generally have to trust the seller, the packaging, serial numbers, and logos. <strong>Those signals can all be copied.</strong>
                    </p>
                    <p class="text-slate-400 text-lg leading-relaxed">
                        A counterfeit product can have convincing packaging, a copied serial number, and even a fake verification website. The fundamental problem is that the customer has no independent way to establish that the product they're holding corresponds to a legitimate record created by the manufacturer.
                    </p>
                </div>
                <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-rose-400">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        Traditional Verification
                    </h3>
                    <ul class="space-y-5 text-slate-400">
                        <li class="flex items-start gap-4">
                            <span class="mt-1 text-slate-600 font-bold">•</span>
                            <span>You must trust the seller completely.</span>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="mt-1 text-slate-600 font-bold">•</span>
                            <span>Holograms and packaging are easily cloned.</span>
                        </li>
                        <li class="flex items-start gap-4">
                            <span class="mt-1 text-slate-600 font-bold">•</span>
                            <span>Centralized databases can be altered silently.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="py-32 px-6 relative z-10">
        <!-- Background element for depth -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-600/5 rounded-[100%] blur-[100px] pointer-events-none"></div>

        <div class="max-w-6xl mx-auto relative z-10">
            <div class="text-center mb-20">
                <h2 class="text-4xl font-extrabold text-white mb-6">How TearRubr Works</h2>
                <p class="text-slate-400 text-xl max-w-2xl mx-auto">A modular system bridging physical goods and decentralized trust.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Step 1 -->
                <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 group">
                    <div class="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-2xl font-black mb-8 group-hover:scale-110 transition-transform">
                        1
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">Identity Creation</h3>
                    <p class="text-slate-400 leading-relaxed text-lg">
                        A manufacturer registers a product. It receives a unique identity that can be represented physically using QR codes, serial numbers, or NFC tags.
                    </p>
                </div>

                <!-- Step 2 -->
                <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 group relative md:top-8">
                    <div class="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-2xl font-black mb-8 group-hover:scale-110 transition-transform">
                        2
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">Immutable Record</h3>
                    <p class="text-slate-400 leading-relaxed text-lg">
                        Important authenticity events are committed to a smart contract on the blockchain, creating a persistent record that cannot be silently rewritten.
                    </p>
                </div>

                <!-- Step 3 -->
                <div class="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 group">
                    <div class="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center text-2xl font-black mb-8 group-hover:scale-110 transition-transform">
                        3
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">Simple Verification</h3>
                    <p class="text-slate-400 leading-relaxed text-lg">
                        A customer scans the identifier. TearRubr retrieves the corresponding product record and checks its authenticity state against the on-chain data.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Blockchain -->
    <section class="py-32 px-6 relative z-10 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div class="max-w-4xl mx-auto text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <h2 class="text-4xl font-extrabold text-white mb-8">Blockchain as a Trust Layer</h2>
            <p class="text-slate-400 text-xl leading-relaxed mb-16">
                Blockchain is not being used simply because the project involves Web3. It solves a specific trust problem. 
                A traditional database requires the customer to completely trust the database operator. TearRubr instead uses blockchain for the parts of the verification process where tamper resistance matters.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 font-mono text-sm sm:text-base">
                <div class="px-8 py-4 rounded-xl sm:rounded-r-none bg-slate-900/80 border border-slate-700 text-slate-300 shadow-inner">
                    Physical Product
                </div>
                <div class="hidden sm:flex text-slate-600 px-4">→</div>
                <div class="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10 scale-110">
                    Digital Identity
                </div>
                <div class="hidden sm:flex text-slate-600 px-4">→</div>
                <div class="px-8 py-4 rounded-xl sm:rounded-l-none bg-slate-900/80 border border-slate-700 text-slate-300 shadow-inner">
                    On-Chain Proof
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="w-full py-12 px-6 border-t border-slate-800/80 bg-slate-950 relative z-20">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <span class="font-bold text-white text-lg tracking-tight">TearRubr</span>
            </div>
            <p class="text-slate-500">© 2026 TearRubr MVP. Built for the Hackathon.</p>
            <div class="flex gap-6">
                <a href="/dashboard" class="text-slate-500 hover:text-white transition-colors">Portal</a>
                <a href="/verify" class="text-slate-500 hover:text-white transition-colors">Verify</a>
                <a href="https://github.com/primidac/tearrubr" class="text-slate-500 hover:text-white transition-colors">GitHub</a>
            </div>
        </div>
    </footer>
</div>
