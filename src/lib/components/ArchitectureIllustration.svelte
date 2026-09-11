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

<div class="rounded-3xl bg-[#0b0b14]/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
	<!-- Background aura -->
	<div class="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#6366f1]/15 blur-[90px] pointer-events-none"></div>
	<div class="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#10b981]/15 blur-[90px] pointer-events-none"></div>

	<!-- Top Toolbar: Mode Switcher & Tamper Simulation Toggle -->
	<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] relative z-10">
		<div class="flex items-center gap-2 p-1 rounded-full bg-[#07070c] border border-white/[0.08]">
			<button
				onclick={() => {
					activeModel = 'tearrubr';
					simulateTamper = false;
				}}
				class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all font-display {activeModel === 'tearrubr' ? 'bg-white text-[#08080e] shadow-md' : 'text-[#8e8ea0] hover:text-white'}"
			>
				TearRubr Cryptographic Pipeline
			</button>
			<button
				onclick={() => {
					activeModel = 'traditional';
					simulateTamper = false;
				}}
				class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all font-display {activeModel === 'traditional' ? 'bg-white text-[#08080e] shadow-md' : 'text-[#8e8ea0] hover:text-white'}"
			>
				Traditional Centralized DB
			</button>
		</div>

		<!-- Tamper Attack Simulation Button -->
		<button
			onclick={() => (simulateTamper = !simulateTamper)}
			class="px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-2 {simulateTamper ? 'bg-danger/20 border-danger text-red-300' : 'bg-white/[0.04] border-white/10 text-text-secondary hover:text-white'}"
		>
			<span class="w-2 h-2 rounded-full {simulateTamper ? 'bg-danger animate-ping' : 'bg-text-tertiary'}"></span>
			<span>{simulateTamper ? 'Simulating Database Alteration Attack' : 'Simulate Database Alteration'}</span>
		</button>
	</div>

	<!-- Tamper Attack Alert Box -->
	{#if simulateTamper}
		<div
			class="mt-6 p-4 rounded-2xl border transition-all relative z-10 {activeModel === 'traditional' ? 'bg-danger/10 border-danger/40 text-red-200' : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'}"
			transition:fade={{ duration: 150 }}
		>
			<div class="flex items-start gap-3">
				<div class="text-xl shrink-0 mt-0.5">
					{activeModel === 'traditional' ? '🚨' : '🛡️'}
				</div>
				<div>
					<h4 class="text-sm font-bold font-display">
						{activeModel === 'traditional' ? 'Centralized DB Failure: Silent Record Forgery' : 'TearRubr Immutable Security: Attack Instantly Blocked'}
					</h4>
					<p class="text-xs opacity-90 mt-1 leading-relaxed">
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
		<div class="mt-8 relative z-10">
			<!-- Horizontal Flow Nodes (Desktop & Tablet) -->
			<div class="grid grid-cols-1 md:grid-cols-5 gap-3">
				{#each nodes as node}
					<button
						onclick={() => (activeNode = node.id)}
						class="text-left p-4 rounded-2xl border transition-all duration-200 group relative {activeNode === node.id ? 'bg-white/[0.08] border-accent/60 shadow-lg' : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]'}"
					>
						<div class="flex items-center justify-between mb-2">
							<span class="text-[10px] uppercase tracking-wider font-semibold font-mono-tight {activeNode === node.id ? 'text-accent' : 'text-[#7a7a8e]'}">
								{node.badge}
							</span>
							<span class="w-1.5 h-1.5 rounded-full {activeNode === node.id ? 'bg-accent shadow-sm' : 'bg-white/20'}"></span>
						</div>
						<div class="text-xs font-bold text-white font-display mb-1 group-hover:text-accent transition-colors">
							{node.title}
						</div>
						<div class="text-[11px] text-[#8e8ea0] line-clamp-1">
							{node.subtitle}
						</div>
					</button>
				{/each}
			</div>

			<!-- Active Node Detail Inspector Card -->
			<div class="mt-6 p-5 rounded-2xl bg-[#08080e]/90 border border-white/[0.08] relative overflow-hidden">
				<div class="flex items-center gap-3 mb-2">
					<span class="px-2 py-0.5 rounded-md bg-accent/20 text-accent font-mono-tight text-xs font-bold">
						STAGE {activeNode + 1} OF 5
					</span>
					<h3 class="text-sm font-bold text-white font-display">
						{nodes[activeNode].title} — {nodes[activeNode].subtitle}
					</h3>
				</div>
				<p class="text-xs text-[#9494a8] leading-relaxed max-w-3xl">
					{nodes[activeNode].desc}
				</p>

				<!-- Architectural Guarantee Badges -->
				<div class="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-4 text-[11px] text-[#7a7a8e] font-mono-tight">
					<span class="flex items-center gap-1.5">
						<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
						Zero-Knowledge Merkle Root
					</span>
					<span class="flex items-center gap-1.5">
						<span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
						Ethereum Sepolia Consensus
					</span>
					<span class="flex items-center gap-1.5">
						<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
						Indexed via The Graph
					</span>
				</div>
			</div>
		</div>
	{:else}
		<!-- Traditional Centralized DB Illustration -->
		<div class="mt-8 p-6 rounded-2xl bg-[#08080e]/90 border border-danger/20 text-left relative z-10">
			<div class="flex items-center gap-2 mb-3 text-danger text-xs font-bold tracking-wide uppercase">
				<span>⚠️ The Flawed Centralized Database Model</span>
			</div>
			<p class="text-xs text-[#9494a8] leading-relaxed mb-6">
				In traditional anti-counterfeiting systems, a single company or cloud server stores the database. Consumers are asked to trust that the database operator, server administrators, and API hosts never modify or lose records.
			</p>

			<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
				<div class="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-[#c0c0d4]">
					<div class="font-bold text-white mb-1">Single Point of Failure</div>
					<div class="text-[11px] text-[#8e8ea0]">If the manufacturer server goes down, products cannot be verified worldwide.</div>
				</div>
				<div class="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-[#c0c0d4]">
					<div class="font-bold text-white mb-1">Silent Alteration Risk</div>
					<div class="text-[11px] text-[#8e8ea0]">An internal bad actor can alter serials or register duplicate counterfeit products secretly.</div>
				</div>
				<div class="p-3.5 rounded-xl bg-danger/5 border border-danger/20 text-[#c0c0d4]">
					<div class="font-bold text-white mb-1">No Mathematical Proof</div>
					<div class="text-[11px] text-[#8e8ea0]">Consumers receive a website response with zero cryptographic guarantee of authenticity.</div>
				</div>
			</div>
		</div>
	{/if}
</div>
