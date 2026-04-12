<script lang="ts">
	import ActivitySearch from '$lib/components/discovery/ActivitySearch.svelte';
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { Flame, Sparkles, Coffee, Music, Zap, Heart } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { data } = $props();

	let selectedActivityId = $state<string | null>(null);
	let locations = $state<LocationSearchResult[]>([]);
	let loading = $state(false);

	async function handleActivitySelect(activityId: string) {
		selectedActivityId = activityId;
		loading = true;

		try {
			const response = await fetch(`/api/v1/discovery/search?activityId=${activityId}`);
			const data = await response.json();
			locations = data.results || [];
		} catch (e) {
			console.error('Search failed:', e);
			locations = [];
		} finally {
			loading = false;
		}
	}

	const vibes = [
		{ name: 'Cozy', icon: Coffee, color: 'bg-sun-peach' },
		{ name: 'Energetic', icon: Zap, color: 'bg-sun-golden' },
		{ name: 'Chill', icon: Music, color: 'bg-sun-matcha' },
		{ name: 'Radiant', icon: Sparkles, color: 'bg-sun-peach' },
		{ name: 'Loud', icon: Flame, color: 'bg-sun-golden' }
	];

	// Mock data for trending and new sections
	const trendingSpots = [
		{
			name: 'Matcha Mornings',
			vibe: 'Cozy',
			image:
				'https://images.unsplash.com/photo-1515442261904-6c3e2c3b1742?auto=format&fit=crop&w=400&q=80'
		},
		{
			name: 'Neon Dreams',
			vibe: 'Loud',
			image:
				'https://images.unsplash.com/photo-1514525253361-bee24387052b?auto=format&fit=crop&w=400&q=80'
		},
		{
			name: 'Zen Garden',
			vibe: 'Chill',
			image:
				'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80'
		}
	];

	const newArrivals = [
		{ name: 'The Golden Hour', location: 'Kreuzberg', date: '2 days ago' },
		{ name: 'Velvet Lounge', location: 'Mitte', date: 'Just in' },
		{ name: 'Petal & Brew', location: 'Neukölln', date: 'New' }
	];
</script>

<div class="flex min-h-screen flex-col bg-[#fefcf4]">
	<!-- Massive Hero Section -->
	<header class="relative overflow-hidden px-6 pt-20 pb-16">
		<div
			class="animate-pulse-soft absolute -top-20 -right-20 h-96 w-96 rounded-full bg-sun-golden/20 blur-[100px]"
		></div>
		<div
			class="animate-pulse-soft absolute top-40 -left-20 h-64 w-64 rounded-full bg-sun-peach/20 blur-[80px]"
			style="animation-delay: 2s"
		></div>

		<div class="relative z-10">
			<span
				class="mb-4 inline-block rounded-full bg-sun-ink px-4 py-1 text-[10px] font-black tracking-[0.3em] text-white uppercase"
			>
				The Radiant Curator
			</span>
			<h1 class="text-massive mb-8 leading-[0.85] text-sun-ink">
				Whatcha <br />
				<span class="text-sun-peach italic drop-shadow-sm">wanna</span> <br />
				<span class="inline-block transition-transform duration-500 hover:scale-110 hover:rotate-3"
					>do?</span
				>
			</h1>

			<p class="max-w-[280px] text-2xl leading-tight font-black text-sun-ink/60">
				Find the <span
					class="text-sun-ink underline decoration-sun-golden decoration-4 underline-offset-4"
					>perfect</span
				> spot for your next radiant move.
			</p>
		</div>
	</header>

	<!-- Search & Activity Discovery -->
	<section class="glass sticky top-0 z-40 border-b border-sun-ink/5 py-4 backdrop-blur-xl">
		<ActivitySearch activities={data.activities} onSelect={handleActivitySelect} />
	</section>

	<div class="space-y-20 py-12">
		<!-- Vibe Filters: Organic Floating Blobs -->
		<section class="px-6">
			<div class="mb-8 flex items-end justify-between">
				<h2 class="font-display text-4xl font-black text-sun-ink">Catch a Vibe</h2>
				<span class="text-xs font-black tracking-widest text-sun-ink/40 uppercase"
					>Quick Access</span
				>
			</div>

			<div class="flex flex-wrap items-center justify-center gap-6">
				{#each vibes as vibe, i (vibe.name)}
					<button
						class="group relative flex h-28 w-28 items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95"
						style="animation: float {3 + i}s ease-in-out infinite"
					>
						<div
							class="absolute inset-0 rounded-[35%_65%_70%_30%/30%_30%_70%_70%] opacity-20 transition-all duration-500 group-hover:rounded-full group-hover:opacity-100 {vibe.color}"
						></div>
						<div class="relative z-10 flex flex-col items-center gap-1">
							<vibe.icon class="h-8 w-8 text-sun-ink" />
							<span class="text-[10px] font-black tracking-widest text-sun-ink uppercase"
								>{vibe.name}</span
							>
						</div>
					</button>
				{/each}
			</div>
		</section>

		{#if !selectedActivityId}
			<!-- Trending This Week: Chaotic Masonry-ish Grid -->
			<section class="px-6">
				<div class="mb-10 flex items-center gap-4">
					<div class="h-[2px] flex-1 bg-sun-ink/10"></div>
					<h2 class="font-display text-5xl font-black text-sun-ink">Trending</h2>
					<div class="h-[2px] flex-1 bg-sun-ink/10"></div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					{#each trendingSpots as spot, i (spot.name)}
						<div
							class="card-asymmetric relative overflow-hidden bg-white shadow-extreme {i === 0
								? 'col-span-2 h-64'
								: 'h-48'}"
						>
							<img
								src={spot.image}
								alt={spot.name}
								class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-sun-ink/80 via-transparent to-transparent"
							></div>
							<div class="absolute bottom-4 left-4">
								<span
									class="mb-1 block text-[10px] font-black tracking-[0.2em] text-white/70 uppercase"
									>{spot.vibe}</span
								>
								<h3 class="text-xl font-black text-white">{spot.name}</h3>
							</div>
							<div
								class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md"
							>
								<Heart class="h-5 w-5" />
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- New Arrivals: Horizontal Scroll with Impact -->
			<section class="overflow-hidden bg-sun-ink py-16 text-white">
				<div class="mb-8 flex items-center justify-between px-6">
					<h2 class="font-display text-4xl font-black">New Arrivals</h2>
					<span class="animate-pulse text-xs font-black tracking-widest text-sun-golden uppercase"
						>Freshly Baked</span
					>
				</div>

				<div class="no-scrollbar flex gap-6 overflow-x-auto px-6 pb-4">
					{#each newArrivals as arrival (arrival.name)}
						<div
							class="min-w-[240px] rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
						>
							<span
								class="mb-2 block text-[10px] font-black tracking-widest text-sun-golden uppercase"
								>{arrival.date}</span
							>
							<h3 class="mb-4 text-2xl font-black">{arrival.name}</h3>
							<div class="flex items-center gap-2 text-sm font-bold text-white/40">
								<div class="h-1 w-1 rounded-full bg-sun-golden"></div>
								{arrival.location}
							</div>
						</div>
					{/each}
				</div>
			</section>

			<!-- Curated Top List: The Big One -->
			<section class="px-6">
				<div class="card-asymmetric relative overflow-hidden bg-sun-matcha p-10 shadow-extreme">
					<div class="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
						<div class="flex-1">
							<span class="mb-2 block text-xs font-black tracking-[0.3em] text-sun-ink uppercase"
								>Editor's Choice</span
							>
							<h2 class="font-display text-6xl leading-[0.9] font-black text-sun-ink">
								Top 10 <br /> <span class="text-white italic">Cozy</span> <br /> Spaces
							</h2>
							<p class="mt-6 text-lg font-bold text-sun-ink/60">
								Our hand-picked selection of Berlin's most intimate retreats.
							</p>
							<button
								class="mt-8 rounded-full bg-sun-ink px-8 py-4 text-sm font-black tracking-widest text-white uppercase transition-transform hover:-translate-y-1 hover:shadow-heavy active:scale-95"
							>
								Explore the List
							</button>
						</div>
						<div class="relative mt-8 md:mt-0">
							<div class="h-64 w-64 rotate-3 rounded-[2rem] bg-sun-ink p-4 shadow-extreme">
								<div
									class="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-sun-peach"
								>
									<Coffee class="h-24 w-24 text-sun-ink" />
								</div>
							</div>
						</div>
					</div>
					<!-- Decoration -->
					<div
						class="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
					></div>
				</div>
			</section>
		{/if}

		<!-- Results Section -->
		<section id="results" class="flex-grow pt-8">
			{#if loading}
				<div class="animate-fade-up flex flex-col items-center justify-center gap-4 py-24">
					<div
						class="h-16 w-16 animate-spin rounded-full border-8 border-sun-golden border-t-sun-ink"
					></div>
					<p class="text-lg font-black tracking-widest text-sun-ink uppercase">
						Summoning the vibes... ✨
					</p>
				</div>
			{:else if locations.length > 0}
				<div class="mb-8 flex items-end justify-between px-6" in:fly={{ y: 20 }}>
					<h2 class="text-4xl font-black text-sun-ink">The Selection</h2>
					<span class="mb-2 text-xs font-black tracking-[0.2em] text-sun-ink/30 uppercase">
						{locations.length} Spots found
					</span>
				</div>
				<LocationList {locations} />
			{:else if selectedActivityId}
				<div class="animate-fade-up">
					<EmptyState />
				</div>
			{:else if !selectedActivityId}
				<!-- If no activity selected, maybe show something else or nothing extra here -->
			{/if}
		</section>
	</div>
</div>

<style>
	@keyframes float {
		0%,
		100% {
			transform: translateY(0) rotate(0);
		}
		50% {
			transform: translateY(-10px) rotate(2deg);
		}
	}

	.text-massive {
		font-size: clamp(4rem, 15vw, 8rem);
		font-weight: 900;
	}

	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
