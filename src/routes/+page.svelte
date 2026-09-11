<script lang="ts">
	import { fly } from 'svelte/transition';
	import Navbar from '$lib/components/Navbar.svelte';
	import ArchitectureIllustration from '$lib/components/ArchitectureIllustration.svelte';
	import Logo from '$lib/components/Logo.svelte';
</script>

<svelte:head>
	<title>TearRubr — Built for Real Products, Open for Everyone</title>
	<meta
		name="description"
		content="Decentralized product authenticity backed by Ethereum, Merkle batch rollups, and physical tamper-evident seals."
	/>
</svelte:head>

<div class="min-h-screen bg-[#08080e] text-text-primary selection:bg-indigo-500/20">
	<!-- Floating Pill Dock Navigation (Privy + ENS enabled) -->
	<Navbar currentPath="/" />

	<!-- Hero Section (Sahara AI Luminous Atmosphere with TearRubr Palette) -->
	<section class="pt-24 sm:pt-36 md:pt-44 pb-14 sm:pb-24 md:pb-32 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
		<!-- Atmospheric Luminous Blooms (Our Palette: Electric Indigo, Cyan, Emerald & Iris) -->
		<div class="absolute inset-0 pointer-events-none overflow-hidden select-none">
			<!-- Top Right Bloom (Electric Indigo / Violet Aura) -->
			<div class="absolute -top-12 -right-16 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-[#6366f1]/25 blur-[100px] sm:blur-[130px]"></div>

			<!-- Bottom Left Bloom (Cryptographic Mint / Emerald & Cyan Aura) -->
			<div class="absolute -bottom-16 -left-20 w-[360px] sm:w-[580px] h-[360px] sm:h-[580px] rounded-full bg-[#10b981]/20 blur-[100px] sm:blur-[130px]"></div>
			<div class="absolute bottom-10 left-10 w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] rounded-full bg-[#06b6d4]/15 blur-[80px] sm:blur-[100px]"></div>

			<!-- Center Soft Wash (Deep Iris) -->
			<div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[320px] sm:h-[450px] rounded-full bg-[#4f46e5]/15 blur-[100px] sm:blur-[140px]"></div>

			<!-- Geometric Rosette / Ray Watermark in Bottom Left -->
			<div class="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 md:left-14 opacity-10 sm:opacity-15 pointer-events-none">
				<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-400 sm:w-[140px] sm:h-[140px]">
					<line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
					<line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
					<line x1="14.6" y1="14.6" x2="85.4" y2="85.4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
					<line x1="85.4" y1="14.6" x2="14.6" y2="85.4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
					<circle cx="50" cy="50" r="18" stroke="currentColor" stroke-width="1.5" />
					<circle cx="50" cy="50" r="6" fill="currentColor" />
				</svg>
			</div>
		</div>

		<!-- Subtle Dot Grid Overlay for Architectural Precision -->
		<div class="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>

		<!-- Main Hero Content -->
		<div class="w-full max-w-4xl mx-auto relative z-10 text-center px-4" in:fly={{ y: 24, duration: 700 }}>
			<!-- Editorial Headline -->
			<h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-[-0.035em] text-white leading-[1.06] mb-7 font-display">
				Built for Real Products,<br class="hidden sm:inline" /> Open for Everyone
			</h1>

			<!-- Subtitle -->
			<p class="text-base sm:text-lg md:text-xl text-[#9da3b4] leading-relaxed max-w-2xl mx-auto mb-11 font-normal font-sans">
				TearRubr delivers trusted cryptographic product identities, tamper-evident physical seals, and immutable on-chain verification for brands and consumers worldwide.
			</p>

			<!-- Dual Pill Buttons -->
			<div class="flex flex-col sm:flex-row items-center justify-center gap-3.5">
				<a
					href="/verify"
					class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#08080e] hover:bg-[#12121e] border border-white/20 hover:border-white/30 text-white font-medium text-sm transition-all duration-200 shadow-xl hover:scale-[1.02] active:scale-[0.98] font-display flex items-center justify-center gap-2.5"
				>
					<span>Verify Product</span>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</a>

				<a
					href="/register"
					class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/[0.07] hover:bg-white/[0.13] border border-white/10 hover:border-white/20 text-white font-medium text-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-display flex items-center justify-center"
				>
					Manufacturer Portal
				</a>
			</div>
		</div>
	</section>

	<!-- Protocol Stats Bar (Sahara AI Frosted Style) -->
	<div class="border-y border-white/[0.08] bg-[#0c0c16]/50 backdrop-blur-md py-6 px-6">
		<div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
			<div>
				<div class="text-2xl sm:text-3xl font-extrabold text-white font-display">10,000+</div>
				<div class="text-xs text-[#8e8ea0] mt-0.5">Units per Batch Rollup</div>
			</div>
			<div>
				<div class="text-2xl sm:text-3xl font-extrabold text-white font-display">1 Tx</div>
				<div class="text-xs text-[#8e8ea0] mt-0.5">Single On-Chain Commit</div>
			</div>
			<div>
				<div class="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">Zero-Trust</div>
				<div class="text-xs text-[#8e8ea0] mt-0.5">Merkle Proof Cryptography</div>
			</div>
			<div>
				<div class="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-display">100% Free</div>
				<div class="text-xs text-[#8e8ea0] mt-0.5">Consumer Verification</div>
			</div>
		</div>
	</div>

	<!-- The Problem Section -->
	<section class="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
		<!-- Ambient Glow -->
		<div class="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-red-500/5 blur-[120px] pointer-events-none"></div>

		<div class="max-w-4xl mx-auto">
			<div class="text-center mb-12 sm:mb-16">
				<p class="text-accent text-xs font-semibold tracking-wider uppercase mb-3 font-mono-tight">The Problem</p>
				<h2 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display text-balance">
					Counterfeit products are identical to the naked eye.
				</h2>
				<p class="text-xs sm:text-base text-[#9494a8] leading-relaxed mt-3 sm:mt-4 max-w-2xl mx-auto text-pretty">
					Traditional anti-counterfeiting signals (packaging, holograms, printed serial numbers, and QR codes) can all be photographed, cloned, and printed in massive quantities.
				</p>
			</div>

			<!-- Cloneable Signals Grid (No-wrap mobile list with badge, multi-col on tablet/desktop) -->
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
				{#each ['Printed QR Codes', 'Hologram Stickers', 'Serial Numbers', 'Outer Packaging', 'Fake Verify Sites', 'Brand Logos'] as item}
					<div class="p-3.5 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3 backdrop-blur-sm">
						<div class="flex items-center gap-2.5 min-w-0">
							<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-danger/10 text-danger flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
								✕
							</span>
							<span class="text-xs font-medium text-[#e0e0ec] truncate">{item}</span>
						</div>
						<span class="text-[10px] font-mono-tight text-danger/80 bg-danger/10 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
							Easily Cloned
						</span>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section id="how-it-works" class="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative">
		<div class="max-w-4xl mx-auto">
			<div class="text-center mb-12 sm:mb-20">
				<p class="text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-3 font-mono-tight">How It Works</p>
				<h2 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display text-balance">
					Three steps from factory floor to consumer hand.
				</h2>
			</div>

			<!-- 3 Clean Step Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
				<!-- Step 1 -->
				<div class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
					<div class="w-8 h-8 rounded-full bg-accent/20 text-accent font-mono-tight text-xs font-bold flex items-center justify-center mb-4">
						01
					</div>
					<h3 class="text-sm sm:text-base font-bold text-white font-display mb-1.5 sm:mb-2">Bulk Product Issuance</h3>
					<p class="text-xs text-[#8e8ea0] leading-relaxed text-pretty">
						Generate unique product identities and tamper-evident seal codes for entire production runs in seconds.
					</p>
				</div>

				<!-- Step 2 -->
				<div class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
					<div class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-mono-tight text-xs font-bold flex items-center justify-center mb-4">
						02
					</div>
					<h3 class="text-sm sm:text-base font-bold text-white font-display mb-1.5 sm:mb-2">Permanent Digital Registry</h3>
					<p class="text-xs text-[#8e8ea0] leading-relaxed text-pretty">
						Records are permanently certified on-chain in 1 single transaction, making authenticity impossible to forge.
					</p>
				</div>

				<!-- Step 3 -->
				<div class="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden">
					<div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-mono-tight text-xs font-bold flex items-center justify-center mb-4">
						03
					</div>
					<h3 class="text-sm sm:text-base font-bold text-white font-display mb-1.5 sm:mb-2">Instant Seal Verification</h3>
					<p class="text-xs text-[#8e8ea0] leading-relaxed text-pretty">
						Consumers scan the tamper-evident seal with any smartphone to verify authenticity in real time.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Why Blockchain Section (Interactive Architectural Illustration) -->
	<section id="why-blockchain" class="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative">
		<div class="max-w-5xl mx-auto">
			<div class="text-center mb-10 sm:mb-14">
				<p class="text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-3 font-mono-tight">Tamper Resistance</p>
				<h2 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-display mb-3 sm:mb-4 text-balance">
					Traditional databases can be hacked.<br class="hidden sm:inline" /> TearRubr is tamper-proof.
				</h2>
				<p class="text-xs sm:text-base text-[#9494a8] leading-relaxed max-w-2xl mx-auto text-pretty">
					Centralized databases can be quietly altered by rogue admins or compromised servers. TearRubr uses cryptographic consensus to guarantee that authenticity proofs cannot be forged.
				</p>
			</div>

			<!-- Interactive Architecture Illustration Component -->
			<ArchitectureIllustration />
		</div>
	</section>

	<!-- Call to Action Section -->
	<section class="py-16 sm:py-28 px-4 sm:px-6 border-t border-white/[0.06] relative overflow-hidden">
		<!-- Luminous Bloom -->
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#6366f1]/20 blur-[130px] pointer-events-none"></div>

		<div class="max-w-3xl mx-auto text-center relative z-10">
			<h2 class="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 font-display text-balance">
				Ready to protect your products?
			</h2>
			<p class="text-xs sm:text-base text-[#9da3b4] mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed text-pretty">
				Deploy tamper-evident physical security and cryptographic product identities across your supply chain.
			</p>
			<div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-xs sm:max-w-none mx-auto">
				<a
					href="/register"
					class="w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white text-[#08080e] font-semibold text-sm hover:bg-white/90 transition-all duration-200 shadow-xl hover:scale-[1.02] active:scale-[0.98] font-display text-center whitespace-nowrap"
				>
					Launch Manufacturer Portal
				</a>
				<a
					href="/verify"
					class="w-full sm:w-auto px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-medium text-sm backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-display text-center whitespace-nowrap"
				>
					Browse Product Directory
				</a>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-white/[0.06] py-10 sm:py-12 px-4 sm:px-6 bg-[#06060a]">
		<div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
			<div class="flex items-center gap-3">
				<Logo size={24} />
				<span class="text-sm font-bold text-white font-display">TearRubr Protocol</span>
				<span class="text-[11px] font-mono-tight text-text-tertiary px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] whitespace-nowrap">
					Ethereum Sepolia
				</span>
			</div>
			<p class="text-xs text-[#7a7a8e]">© 2026 TearRubr. Decentralized product authenticity on Ethereum.</p>
			<div class="flex gap-6 text-xs text-[#8e8ea0]">
				<a href="/verify" class="hover:text-white transition-colors whitespace-nowrap">Product Directory</a>
				<a href="/dashboard" class="hover:text-white transition-colors whitespace-nowrap">Dashboard</a>
				<a href="https://github.com/primidac/tearrubr" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors whitespace-nowrap">
					GitHub
				</a>
			</div>
		</div>
	</footer>
</div>
