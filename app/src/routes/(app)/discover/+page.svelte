<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { X } from 'lucide-svelte';
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';

	let { data } = $props();

	type ThemeColor = 'matcha' | 'peach' | 'sunny';

	type Vibe = {
		id: string;
		name: string;
		tagline: string;
		emoji: string;
		themeColor: ThemeColor;
		keywords: string[];
		area: string;
		bg: string;
		ink: 'light' | 'dark';
		rotate: string;
	};

	const vibes: Vibe[] = [
		{
			id: 'cozy',
			name: 'Cozy',
			tagline: 'warm corners, slow sips',
			emoji: '☕',
			themeColor: 'peach',
			keywords: ['coffee', 'cafe', 'café', 'book', 'tea'],
			area: 'cozy',
			bg: 'from-peach via-peach to-[#ff9e99]',
			ink: 'dark',
			rotate: 'rotate-[-1.5deg]'
		},
		{
			id: 'wild',
			name: 'Wild',
			tagline: 'let the night win',
			emoji: '🔥',
			themeColor: 'sunny',
			keywords: ['bar', 'club', 'party', 'late', 'dance'],
			area: 'wild',
			bg: 'from-[#2c2b29] via-[#3a2a28] to-[#ff6b5a]',
			ink: 'light',
			rotate: 'rotate-[1deg]'
		},
		{
			id: 'romantic',
			name: 'Romantic',
			tagline: 'candlelit, lingering',
			emoji: '🌹',
			themeColor: 'peach',
			keywords: ['wine', 'dinner', 'date', 'intimate', 'bistro'],
			area: 'romantic',
			bg: 'from-[#ff8479] via-peach to-sunny',
			ink: 'dark',
			rotate: 'rotate-[-0.5deg]'
		},
		{
			id: 'heady',
			name: 'Heady',
			tagline: 'think, stare, feel',
			emoji: '🎨',
			themeColor: 'matcha',
			keywords: ['art', 'gallery', 'film', 'museum', 'bookshop'],
			area: 'heady',
			bg: 'from-matcha via-[#7dd3b3] to-[#4a8a72]',
			ink: 'dark',
			rotate: 'rotate-[2deg]'
		},
		{
			id: 'slow',
			name: 'Slow',
			tagline: 'no rush, no map',
			emoji: '🌿',
			themeColor: 'matcha',
			keywords: ['park', 'garden', 'walk', 'canal', 'river'],
			area: 'slow',
			bg: 'from-matcha via-[#c8f0da] to-cream',
			ink: 'dark',
			rotate: 'rotate-[-1deg]'
		},
		{
			id: 'loud',
			name: 'Loud',
			tagline: 'bass in your teeth',
			emoji: '🎧',
			themeColor: 'sunny',
			keywords: ['live', 'music', 'gig', 'venue', 'concert'],
			area: 'loud',
			bg: 'from-sunny via-[#ffc347] to-[#ff8f3c]',
			ink: 'dark',
			rotate: 'rotate-[1.5deg]'
		},
		{
			id: 'green',
			name: 'Green',
			tagline: 'trees, sky, breathe',
			emoji: '🌳',
			themeColor: 'matcha',
			keywords: ['nature', 'outdoor', 'forest', 'lake', 'park'],
			area: 'green',
			bg: 'from-[#4a8a72] via-matcha to-[#e8f5d8]',
			ink: 'light',
			rotate: 'rotate-[-2deg]'
		},
		{
			id: 'hidden',
			name: 'Hidden',
			tagline: 'only the locals know',
			emoji: '🗝️',
			themeColor: 'peach',
			keywords: ['secret', 'local', 'hidden', 'tucked', 'speakeasy'],
			area: 'hidden',
			bg: 'from-[#1a1a1a] via-[#3d2c2a] to-peach',
			ink: 'light',
			rotate: 'rotate-[0.5deg]'
		}
	];

	function matchesVibe(loc: LocationSearchResult, vibe: Vibe): boolean {
		const byColor = loc.activities?.some((a) => a.themeColor === vibe.themeColor) ?? false;
		const hay = (
			loc.name +
			' ' +
			(loc.address ?? '') +
			' ' +
			(loc.activities?.map((a) => a.name).join(' ') ?? '')
		).toLowerCase();
		const byKeyword = vibe.keywords.some((k) => hay.includes(k));
		return byKeyword || byColor;
	}

	function tileImage(vibe: Vibe): string | undefined {
		const match = data.featured.find((loc: LocationSearchResult) =>
			loc.activities?.some((a) => a.themeColor === vibe.themeColor)
		);
		return match?.image ?? match?.photos?.[0];
	}

	let activeVibe = $state<Vibe | null>(null);
	let activeResults = $state<LocationSearchResult[]>([]);

	function openVibe(vibe: Vibe) {
		activeVibe = vibe;
		const strict = data.featured.filter((loc: LocationSearchResult) => matchesVibe(loc, vibe));
		const loose =
			strict.length > 0
				? strict
				: data.featured.filter((loc: LocationSearchResult) =>
						loc.activities?.some((a) => a.themeColor === vibe.themeColor)
					);
		activeResults = loose;
	}

	function closeVibe() {
		activeVibe = null;
		activeResults = [];
	}
</script>

<svelte:head>
	<title>Discover vibes · WOHIN</title>
</svelte:head>

<!-- Header -->
<section class="px-5 pt-6 pb-3">
	<p class="mb-1.5 text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
		Berlin · Pick your mood
	</p>
	<h1 class="font-display text-[2.75rem] leading-[0.95] font-black tracking-tighter text-ink">
		What's the
		<span class="relative inline-block">
			<span class="relative z-10 italic">vibe</span>
			<span
				class="absolute bottom-1 left-0 -z-10 h-3 w-full -rotate-1 transform rounded-full bg-sunny opacity-80"
			></span>
		</span>
		?
	</h1>
	<p class="mt-2 max-w-[22rem] text-sm font-medium text-muted">
		One tap. We'll handle the rest.
	</p>
</section>

<!-- Vibe Mosaic -->
<section class="vibe-grid px-4 pt-3 pb-8">
	{#each vibes as vibe, i (vibe.id)}
		{@const img = tileImage(vibe)}
		<button
			type="button"
			onclick={() => openVibe(vibe)}
			style="grid-area: {vibe.area}; animation-delay: {i * 55}ms;"
			class="vibe-tile animate-slide-up group relative overflow-hidden rounded-[1.75rem] text-left transition-transform duration-300 hover:-translate-y-1 active:scale-[0.97] {vibe.rotate}"
		>
			{#if img}
				<img
					src={img}
					alt=""
					loading="lazy"
					class="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
				/>
			{/if}
			<div class="absolute inset-0 bg-gradient-to-br {vibe.bg} mix-blend-multiply"></div>
			<div
				class="absolute inset-0 opacity-[0.18]"
				style="background-image: radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px); background-size: 3px 3px;"
			></div>
			<div
				class="absolute inset-0 bg-gradient-to-t {vibe.ink === 'light'
					? 'from-black/40'
					: 'from-black/15'} to-transparent"
			></div>

			<div
				class="relative z-10 flex h-full flex-col justify-between p-4 {vibe.ink === 'light'
					? 'text-cream'
					: 'text-ink'}"
			>
				<div class="flex items-start justify-between">
					<span
						class="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-xl !bg-white/30"
					>
						{vibe.emoji}
					</span>
					<span
						class="h-6 w-6 rounded-full border-2 transition-transform duration-300 group-hover:rotate-45 {vibe.ink ===
						'light'
							? 'border-cream/80'
							: 'border-ink/50'}"
					>
						<span class="block h-full w-full rotate-45">
							<span
								class="mx-auto block h-full w-[2px] {vibe.ink === 'light'
									? 'bg-cream/80'
									: 'bg-ink/50'}"
							></span>
						</span>
					</span>
				</div>
				<div>
					<h2
						class="font-display text-[2rem] leading-[0.88] font-black tracking-tighter {vibe.id ===
							'wild' || vibe.id === 'hidden'
							? 'italic'
							: ''}"
					>
						{vibe.name}
					</h2>
					<p
						class="mt-1.5 text-[11px] font-semibold tracking-wide {vibe.ink === 'light'
							? 'text-cream/80'
							: 'text-ink/70'}"
					>
						{vibe.tagline}
					</p>
				</div>
			</div>
		</button>
	{/each}
</section>

<!-- Results Sheet -->
{#if activeVibe}
	{@const vibe = activeVibe}
	<div
		class="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
		onclick={closeVibe}
		onkeydown={(e) => e.key === 'Escape' && closeVibe()}
		role="button"
		tabindex="-1"
		transition:fade={{ duration: 200 }}
	></div>

	<section
		class="fixed inset-x-0 bottom-0 z-40 max-h-[88vh] overflow-y-auto rounded-t-[2.5rem] bg-cream shadow-extreme"
		transition:fly={{ y: 600, duration: 420, easing: cubicOut }}
	>
		<div class="sticky top-0 z-10 bg-cream/90 px-5 pt-3 pb-4 backdrop-blur-xl">
			<div class="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15"></div>
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<p class="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
						Vibe · {activeResults.length} spot{activeResults.length === 1 ? '' : 's'}
					</p>
					<h2
						class="font-display text-4xl leading-none font-black tracking-tighter text-ink"
					>
						<span class="text-2xl">{vibe.emoji}</span>
						{vibe.name}
					</h2>
					<p class="mt-1 text-xs font-semibold text-muted">{vibe.tagline}</p>
				</div>
				<button
					type="button"
					onclick={closeVibe}
					aria-label="Close"
					class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ink text-cream shadow-heavy transition-transform active:scale-90"
				>
					<X class="h-5 w-5" strokeWidth={2.5} />
				</button>
			</div>
		</div>

		<div class="pb-28">
			{#if activeResults.length > 0}
				<LocationList locations={activeResults} />
			{:else}
				<div class="px-5 pt-8"><EmptyState /></div>
			{/if}
		</div>
	</section>
{/if}

<style>
	.vibe-grid {
		display: grid;
		gap: 0.9rem;
		grid-template-columns: repeat(6, 1fr);
		grid-auto-rows: 112px;
		grid-template-areas:
			'cozy cozy cozy cozy wild wild'
			'cozy cozy cozy cozy wild wild'
			'romantic romantic heady heady wild wild'
			'slow slow slow slow loud loud'
			'slow slow slow slow loud loud'
			'green green green hidden hidden hidden'
			'green green green hidden hidden hidden';
	}

	.vibe-tile {
		min-height: 0;
		min-width: 0;
	}

	@media (max-width: 420px) {
		.vibe-grid {
			grid-auto-rows: 96px;
			gap: 0.75rem;
		}
	}

	@media (min-width: 768px) {
		.vibe-grid {
			max-width: 720px;
			margin-inline: auto;
			grid-auto-rows: 140px;
		}
	}
</style>
