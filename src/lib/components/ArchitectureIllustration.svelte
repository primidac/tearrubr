<script lang="ts">
	import { fade } from 'svelte/transition';

	let activeModel = $state<'tearrubr' | 'traditional'>('tearrubr');
	let simulateTamper = $state(false);
	let activeNode = $state<number>(2); // Default to Merkle Rollup node

	const nodes = [
		{
			id: 0,
			title: '1. Physical Tear Seal',
			subtitle: 'Under-the-Cap NFC / QR',
			badge: 'Hardware',
			color: 'indigo',
			desc: 'A physical tamper-evident seal is bonded to the bottle or luxury item. When torn or scanned, its physical state irreversibly transitions from sealed to consumed.'
		},
		{
			id: 1,
			title: '2. Merkle Tree Rollup',
			subtitle: 'Industrial Batch Compression',
			badge: 'Cryptography',
			color: 'indigo',
			desc: 'High-volume production lines (e.g. 10,000 Coca-Cola bottles) compute cryptographic SHA-256 leaf hashes and aggregate them into a single 32-byte Merkle Root.'
		},
		{
			id: 2,
			title: '3. Ethereum Sepolia Ledger',
			subtitle: 'Smart Contract Immutable State',
			badge: 'Consensus',
			color: 'emerald',
			desc: 'The single Merkle Root is committed via 1 on-chain transaction. Once mined on Ethereum, no government, hacker, or manufacturer can rewrite history.'
		},
		{
			id: 3,
			title: '4. The Graph Subgraph',
			subtitle: 'Decentralized Query Indexer',
			badge: 'Indexing',
			color: 'cyan',
			desc: 'The Graph indexes on-chain batch events in real time with sub-20ms latency, enabling high-speed verification without centralized database lock-in.'
		},
		{
			id: 4,
			title: '5. Instant Consumer Proof',
			subtitle: 'Mathematical Trustless Verification',
			badge: 'Verification',
			color: 'emerald',
			desc: 'Any smartphone camera verifies the cryptographic Merkle proof against the Ethereum root. Zero trust in the seller or middleman required.'
		}
	];
</script>

<div class="rounded-2xl sm:rounded-3xl bg-[#0b0b14]/80 border border-white/[0.08] p-4 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
	<!-- Background aura -->
	<div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#6366f1]/15 blur-[90px] pointer-events-none"></div>
	<div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#10b981]/15 blur-[90px] pointer-events-none"></div>

	<!-- Top Toolbar: Mode Switcher & Tamper Simulation Toggle -->
	<div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-white/[0.08] relative z-10">
		<div class="w-full sm:w-auto grid grid-cols-2 sm:flex sm:items-center gap-1 sm:gap-2 p-1 rounded-xl bg-[#07070c] border border-white/[0.08]">
			<button
				onclick={() => {
					activeModel = 'tearrubr';
					simulateTamper = false;
				}}
				class="px-2.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all font-display text-center whitespace-nowrap {activeModel === 'tearrubr' ? 'bg-white text-[#08080e] shadow-md' : 'text-[#8e8ea0] hover:text-white'}"
			>
				<span class="sm:hidden">TearRubr</span>
				<span class="hidden sm:inline">TearRubr Tamper-Proof Pipeline</span>
			</button>
			<button
				onclick={() => {
					activeModel = 'traditional';
					simulateTamper = false;
				}}
				class="px-2.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all font-display text-center whitespace-nowrap {activeModel === 'traditional' ? 'bg-white text-[#08080e] shadow-md' : 'text-[#8e8ea0] hover:text-white'}"
			>
				<span class="sm:hidden">Standard DB</span>
				<span class="hidden sm:inline">Traditional Centralized DB</span>
			</button>
		</div>

		<!-- Tamper Attack Simulation Button -->
		<button
			onclick={() => (simulateTamper = !simulateTamper)}
			class="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border transition-all flex items-center justify-center gap-2 whitespace-nowrap {simulateTamper ? 'bg-danger/20 border-danger text-red-300' : 'bg-white/[0.04] border-white/10 text-text-secondary hover:text-white'}"
		>
			<span class="w-2 h-2 rounded-full shrink-0 {simulateTamper ? 'bg-danger animate-ping' : 'bg-text-tertiary'}"></span>
			<span>{simulateTamper ? 'Simulating Database Alteration' : 'Simulate Database Alteration'}</span>
		</button>
	</div>

	<!-- Tamper Attack Alert Box -->
	{#if simulateTamper}
		<div
			class="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-2xl border transition-all relative z-10 {activeModel === 'traditional' ? 'bg-danger/10 border-danger/40 text-red-200' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'}"
			transition:fade={{ duration: 150 }}
		>
			<div class="flex items-start gap-3">
				<div class="text-lg sm:text-xl shrink-0 mt-0.5">
					{activeModel === 'traditional' ? '🚨' : '🛡️'}
				</div>
				<div>
					<h4 class="text-xs sm:text-sm font-bold font-display leading-snug">
						{activeModel === 'traditional' ? 'Centralized DB Failure: Silent Record Forgery' : 'TearRubr Immutable Security: Attack Instantly Blocked'}
					</h4>
					<p class="text-[11px] sm:text-xs opacity-90 mt-1 leading-relaxed text-pretty">
						{#if activeModel === 'traditional'}
							A rogue database admin or attacker modified the serial database. The website now says the counterfeit product is "Authentic". The buyer has zero mathematical way to know the record was forged.
						{:else}
							Even if an attacker modifies the local database, consumer smartphones verify the Merkle proof directly against Ethereum Sepolia's smart contract. The cryptographic mathematical proof fails immediately with 100% certainty.
						{/if}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Architecture Interactive Pipeline -->
	{#if activeModel === 'tearrubr'}
		<div class="mt-6 sm:mt-8 relative z-10">
			<!-- Horizontal Flow Nodes (Desktop & Tablet) -->
			<div class="grid grid-cols-1 md:grid-cols-5 gap-2.5 sm:gap-3">
				{#each nodes as node}
					<button
						onclick={() => (activeNode = node.id)}
						class="text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 group relative {activeNode === node.id ? 'bg-white/[0.08] border-accent/60 shadow-lg' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'}"
					>
						<div class="flex items-center justify-between mb-1 sm:mb-2">
							<span class="text-[10px] uppercase tracking-wider font-semibold font-mono-tight whitespace-nowrap {activeNode === node.id ? 'text-accent' : 'text-[#7a7a8e]'}">
								{node.badge}
							</span>
							<span class="w-1.5 h-1.5 rounded-full shrink-0 {activeNode === node.id ? 'bg-accent shadow-sm' : 'bg-white/20'}"></span>
						</div>
						<div class="text-xs font-bold text-white font-display mb-0.5 sm:mb-1 group-hover:text-accent transition-colors whitespace-nowrap truncate">
							{node.title}
						</div>
						<div class="text-[11px] text-[#8e8ea0] whitespace-nowrap truncate">
							{node.subtitle}
						</div>
					</button>
				{/each}
			</div>

			<!-- Active Node Detail Inspector Card -->
			<div class="mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-[#08080e]/90 border border-white/[0.08] relative overflow-hidden">
				<div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 mb-2">
					<span class="px-2 py-0.5 rounded-md bg-accent/20 text-accent font-mono-tight text-[10px] sm:text-xs font-bold w-fit whitespace-nowrap shrink-0">
						STAGE {activeNode + 1} OF 5
					</span>
					<h3 class="text-xs sm:text-sm font-bold text-white font-display">
						<span>{nodes[activeNode].title}</span>
						<span class="text-[#8e8ea0] font-normal text-[11px] sm:text-xs block sm:inline"> — {nodes[activeNode].subtitle}</span>
					</h3>
				</div>
				<p class="text-xs text-[#9494a8] leading-relaxed max-w-3xl text-pretty">
					{nodes[activeNode].desc}
				</p>

				<!-- Architectural Guarantee Badges -->
				<div class="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] text-[#7a7a8e] font-mono-tight">
					<span class="flex items-center gap-1.5 whitespace-nowrap">
						<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
						Zero-Knowledge Merkle Root
					</span>
					<span class="flex items-center gap-1.5 whitespace-nowrap">
						<span class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
						Ethereum Sepolia Consensus
					</span>
					<span class="flex items-center gap-1.5 whitespace-nowrap">
						<span class="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
						Indexed via The Graph
					</span>
				</div>
			</div>
		</div>
	{:else}
		<!-- Traditional Centralized DB Illustration -->
		<div class="mt-6 sm:mt-8 p-4 sm:p-6 rounded-2xl bg-[#08080e]/90 border border-danger/20 text-left relative z-10">
			<div class="flex items-center gap-2 mb-3 text-danger text-[11px] sm:text-xs font-bold tracking-wide uppercase">
				<span class="sm:hidden">⚠️ Flawed Centralized DB Model</span>
				<span class="hidden sm:inline">⚠️ The Flawed Centralized Database Model</span>
			</div>
			<p class="text-xs text-[#9494a8] leading-relaxed mb-5 sm:mb-6 text-pretty">
				In traditional anti-counterfeiting systems, a single company or cloud server stores the database. Consumers are asked to trust that the database operator, server administrators, and API hosts never modify or lose records.
			</p>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
				<div class="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-[#c0c0d4]">
					<div class="font-bold text-white mb-1 whitespace-nowrap">Single Point of Failure</div>
					<div class="text-[11px] text-[#8e8ea0] leading-snug">If the manufacturer server goes down, products cannot be verified worldwide.</div>
				</div>
				<div class="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-[#c0c0d4]">
					<div class="font-bold text-white mb-1 whitespace-nowrap">Silent Alteration Risk</div>
					<div class="text-[11px] text-[#8e8ea0] leading-snug">An internal bad actor can alter serials or register duplicate counterfeit products secretly.</div>
				</div>
				<div class="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-[#c0c0d4]">
					<div class="font-bold text-white mb-1 whitespace-nowrap">No Mathematical Proof</div>
					<div class="text-[11px] text-[#8e8ea0] leading-snug">Consumers receive a website response with zero cryptographic guarantee of authenticity.</div>
				</div>
			</div>
		</div>
	{/if}
</div>
