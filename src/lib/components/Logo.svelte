<script lang="ts">
	interface Props {
		size?: number | string;
		class?: string;
		variant?: 'badge' | 'glyph';
	}

	let { size = 28, class: className = '', variant = 'badge' }: Props = $props();

	let numericSize = $derived(typeof size === 'number' ? `${size}px` : size);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 32 32"
	width={numericSize}
	height={numericSize}
	class="shrink-0 {className}"
	fill="none"
	aria-label="TearRubr logo"
>
	{#if variant === 'badge'}
		<!-- Obsidian squircle background with precision border -->
		<rect width="32" height="32" rx="7.5" fill="#09090F" />
		<rect
			x="0.6"
			y="0.6"
			width="30.8"
			height="30.8"
			rx="6.9"
			stroke="#222230"
			stroke-width="1.2"
		/>
	{/if}

	<!-- T: Left crossbar and central anchor stem (Titanium White) -->
	<path
		d="M7 8.5H14.5M14.5 8.5V23.5"
		stroke="#F4F4F8"
		stroke-width="2.6"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>

	<!-- R: Security seal band with 45° tamper tear notch (Electric Indigo) -->
	<path
		d="M14.5 8.5H18M20.5 8.5C23.2614 8.5 25.5 10.2909 25.5 12.5C25.5 14.7091 23.2614 16.5 20.5 16.5H14.5"
		stroke="#6366F1"
		stroke-width="2.6"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>

	<!-- R: Diagonal security kick / anchor -->
	<path
		d="M18 16.5L24 23.5"
		stroke="#6366F1"
		stroke-width="2.6"
		stroke-linecap="round"
	/>

	<!-- Cryptographic proof indicator (Emerald) -->
	<circle cx="20.5" cy="12.5" r="1.15" fill="#10B981" />
</svg>
