<script lang="ts">
	import ActivitySearch from '$lib/components/discovery/ActivitySearch.svelte';
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { Sparkles, Coffee, Heart } from 'lucide-svelte';
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

	function getThemeColor(theme?: string) {
		switch (theme) {
			case 'matcha':
				return 'bg-accent';
			case 'peach':
				return 'bg-secondary';
			case 'sunny':
				return 'bg-primary';
			default:
				return 'bg-secondary';
		}
	}
</script>

<div class="flex min-h-screen flex-col bg-surface">
	<!-- Massive Hero Section -->
	<header class="relative overflow-hidden px-6 pt-20 pb-16">
		<div
			class="animate-pulse-soft absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]"
		></div>
		<div
			class="animate-pulse-soft absolute top-40 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-[80px]"
			style="animation-delay: 2s"
		></div>

		<div class="relative z-10">
			<span
				class="mb-4 inline-block rounded-full bg-ink px-4 py-1 text-[10px] font-black tracking-[0.3em] text-white uppercase"
			>
				The Radiant Curator
			</span>
			<h1 class="text-massive mb-8 leading-[0.85] text-ink">
				Whatcha <br />
				<span class="text-secondary italic drop-shadow-sm">wanna</span> <br />
				<span class="inline-block transition-transform duration-500 hover:scale-110 hover:rotate-3"
					>do?</span
				>
			</h1>

			<p class="max-w-[280px] text-2xl leading-tight font-black text-ink/60">
				Find the <span class="text-ink underline decoration-primary decoration-4 underline-offset-4"
					>perfect</span
				> spot for your next radiant move.
			</p>
		</div>
	</header>

	<!-- Search & Activity Discovery -->
	<section class="glass sticky top-0 z-40 border-b border-ink/5 py-4 backdrop-blur-xl">
		<ActivitySearch activities={data.activities} onSelect={handleActivitySelect} />
	</section>

	<div class="space-y-20 py-12">
		<!-- Vibe Filters: Organic Floating Blobs -->
		<section class="px-6">
			<div class="mb-8 flex items-end justify-between">
				<h2 class="font-display text-4xl font-black text-ink">Catch a Vibe</h2>
				<span class="text-xs font-black tracking-widest text-ink/40 uppercase">Quick Access</span>
			</div>

			<div class="flex flex-wrap items-center justify-center gap-6">
				{#each data.activities as activity, i (activity.id)}
					<button
						onclick={() => handleActivitySelect(activity.id)}
						class="group relative flex h-28 w-28 items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95"
						style="animation: float {3 + i}s ease-in-out infinite"
					>
						<div
							class="absolute inset-0 rounded-[35%_65%_70%_30%/30%_30%_70%_70%] opacity-20 transition-all duration-500 group-hover:rounded-full group-hover:opacity-100 {getThemeColor(
								activity.themeColor
							)}"
						></div>
						<div class="relative z-10 flex flex-col items-center gap-1">
							{#if activity.icon}
								<span class="text-4xl">{activity.icon}</span>
							{/if}
							<span class="text-[10px] font-black tracking-widest text-ink uppercase"
								>{activity.name}</span
							>
						</div>
					</button>
				{/each}
			</div>
		</section>

		{#if !selectedActivityId}
			{#if data.trendingSpots.length > 0}
				<!-- Trending This Week: Chaotic Masonry-ish Grid -->
				<section class="px-6">
					<div class="mb-10 flex items-center gap-4">
						<div class="h-[2px] flex-1 bg-ink/10"></div>
						<h2 class="font-display text-5xl font-black text-ink">Trending</h2>
						<div class="h-[2px] flex-1 bg-ink/10"></div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						{#each data.trendingSpots as spot, i (spot.id)}
							<div
								class="card-asymmetric relative overflow-hidden bg-white shadow-extreme {i === 0
									? 'col-span-2 h-64'
									: 'h-48'}"
							>
								{#if spot.photos?.[0]}
									<img
										src={spot.photos[0]}
										alt={spot.name}
										class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110"
									/>
								{:else}
									<div class="absolute inset-0 flex items-center justify-center bg-primary/20">
										<Sparkles class="h-12 w-12 text-primary" />
									</div>
								{/if}
								<div
									class="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
								></div>
								<div class="absolute bottom-4 left-4">
									{#if spot.activities?.[0]}
										<span
											class="mb-1 block text-[10px] font-black tracking-[0.2em] text-white/70 uppercase"
											>{spot.activities[0].name}</span
										>
									{/if}
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
			{/if}

			{#if data.newArrivals.length > 0}
				<!-- New Arrivals: Horizontal Scroll with Impact -->
				<section class="overflow-hidden bg-ink py-16 text-white">
					<div class="mb-8 flex items-center justify-between px-6">
						<h2 class="font-display text-4xl font-black">New Arrivals</h2>
						<span class="animate-pulse text-xs font-black tracking-widest text-primary uppercase"
							>Freshly Baked</span
						>
					</div>

					<div class="no-scrollbar flex gap-6 overflow-x-auto px-6 pb-4">
						{#each data.newArrivals as arrival (arrival.id)}
							<div
								class="min-w-[240px] rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-colors hover:bg-white/10"
							>
								<span
									class="mb-2 block text-[10px] font-black tracking-widest text-primary uppercase"
									>New</span
								>
								<h3 class="mb-4 text-2xl font-black">{arrival.name}</h3>
								<div class="flex items-center gap-2 text-sm font-bold text-white/40">
									<div class="h-1 w-1 rounded-full bg-primary"></div>
									{arrival.address || 'Berlin'}
								</div>
							</div>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Curated Top List: The Big One -->
			<section class="px-6">
				<div class="card-asymmetric relative overflow-hidden bg-accent p-10 shadow-extreme">
					<div class="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
						<div class="flex-1">
							<span class="mb-2 block text-xs font-black tracking-[0.3em] text-ink uppercase"
								>Editor's Choice</span
							>
							<h2 class="font-display text-6xl leading-[0.9] font-black text-ink">
								Top 10 <br /> <span class="text-white italic">Cozy</span> <br /> Spaces
							</h2>
							<p class="mt-6 text-lg font-bold text-ink/60">
								Our hand-picked selection of Berlin's most intimate retreats.
							</p>
							<button
								class="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-black tracking-widest text-white uppercase transition-transform hover:-translate-y-1 hover:shadow-heavy active:scale-95"
							>
								Explore the List
							</button>
						</div>
						<div class="relative mt-8 md:mt-0">
							<div class="h-64 w-64 rotate-3 rounded-[2rem] bg-ink p-4 shadow-extreme">
								<div
									class="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-secondary"
								>
									<Coffee class="h-24 w-24 text-ink" />
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
						class="h-16 w-16 animate-spin rounded-full border-8 border-primary border-t-ink"
					></div>
					<p class="text-lg font-black tracking-widest text-ink uppercase">
						Summoning the vibes... ✨
					</p>
				</div>
			{:else if locations.length > 0}
				<div class="mb-8 flex items-end justify-between px-6" in:fly={{ y: 20 }}>
					<h2 class="text-4xl font-black text-ink">The Selection</h2>
					<span class="mb-2 text-xs font-black tracking-[0.2em] text-ink/30 uppercase">
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
