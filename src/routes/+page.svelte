<script lang="ts">
    import { fade, fly } from 'svelte/transition';
</script>

<svelte:head>
    <title>TearRubr | Absolute Supply Chain Trust</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed flex flex-col justify-between overflow-hidden relative">
    
    <!-- Background glow effects -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] pointer-events-none"></div>

    <!-- Navigation Bar -->
    <nav class="w-full px-8 py-6 flex items-center justify-between relative z-10">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <span class="text-2xl font-black tracking-tight text-white">Tear<span class="text-emerald-400">Rubr</span></span>
        </div>
        <div class="hidden md:flex gap-6 items-center">
            <a href="/verify" class="text-slate-300 hover:text-white font-medium transition-colors">Verify Product</a>
            <a href="/dashboard" class="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold backdrop-blur-md transition-all">Manufacturer Login</a>
        </div>
    </nav>

    <!-- Hero Section -->
    <main class="flex-grow flex items-center justify-center relative z-10 px-6 py-20">
        <div class="max-w-5xl mx-auto text-center">
            
            <div in:fly={{ y: 30, duration: 1000, delay: 100 }} class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-400 font-medium text-sm mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Blockchain verification is live
            </div>

            <h1 in:fly={{ y: 30, duration: 1000, delay: 200 }} class="text-6xl md:text-8xl font-extrabold tracking-tight text-white leading-tight mb-6">
                Absolute Trust for <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Physical Products.</span>
            </h1>
            
            <p in:fly={{ y: 30, duration: 1000, delay: 300 }} class="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                TearRubr generates cryptographically secure, blockchain-backed digital identities for physical goods, eliminating counterfeits and establishing provenance.
            </p>

            <div in:fly={{ y: 30, duration: 1000, delay: 400 }} class="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a href="/dashboard" class="w-full sm:w-auto px-8 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300">
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

    <!-- Footer -->
    <footer class="w-full py-8 text-center text-slate-500 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-lg relative z-10">
        <p>© 2026 TearRubr. Built for the Hackathon.</p>
    </footer>
</div>
