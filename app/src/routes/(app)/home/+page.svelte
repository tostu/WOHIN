<script lang="ts">
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();

	let selectedActivityId = $state<string | null>(null);
	let selectedActivityName = $state<string>('');
	let locations = $state<LocationSearchResult[]>([]);
	let loading = $state(false);

	async function handleActivitySelect(activityId: string, activityName: string) {
		if (selectedActivityId === activityId) {
			selectedActivityId = null;
			selectedActivityName = '';
			locations = [];
			return;
		}

		selectedActivityId = activityId;
		selectedActivityName = activityName;
		loading = true;

		try {
			const response = await fetch(`/api/v1/discovery/search?activityId=${activityId}`);
			const resData = (await response.json()) as { results?: LocationSearchResult[] };
			locations = resData.results || [];
		} catch (e) {
			console.error('Search failed:', e);
			locations = [];
		} finally {
			loading = false;
		}
	}

	function getActivityColor(theme?: string) {
		switch (theme) {
			case 'matcha':
				return 'bg-matcha';
			case 'peach':
				return 'bg-peach';
			case 'sunny':
				return 'bg-sunny';
			default:
				return 'bg-sunny';
		}
	}
</script>

<!-- Compact greeting -->
<section class="px-5 pt-6 pb-2">
	<p class="mb-1.5 text-[10px] font-bold tracking-[0.2em] text-muted uppercase">Berlin · Today</p>
	<h1 class="font-display text-4xl leading-[1.05] font-black tracking-tighter text-ink">
		Whatcha
		<span class="relative inline-block">
			<span class="relative z-10 italic">wanna</span>
			<span
				class="absolute bottom-0.5 left-0 -z-10 h-2.5 w-full rotate-1 transform rounded-full bg-sunny opacity-80"
			></span>
		</span>
		do?
	</h1>
</section>

<!-- VIBE PILLS — hero affordance -->
<section class="pt-5 pb-2">
	<div
		class="scrollbar-hide flex snap-x gap-3 overflow-x-auto px-5 pb-3"
	>
		{#each data.activities as activity, i (activity.id)}
			{@const active = selectedActivityId === activity.id}
			<button
				type="button"
				onclick={() => handleActivitySelect(activity.id, activity.name)}
				class="animate-slide-up flex min-h-[56px] flex-shrink-0 snap-start transform items-center gap-2.5 rounded-full border-2 px-6 py-4 transition-all duration-300 active:scale-95 {active
					? `${getActivityColor(activity.themeColor)} scale-[1.03] border-transparent shadow-[0_10px_30px_rgba(0,0,0,0.12)]`
					: 'border-ink/10 bg-white hover:border-ink/30'}"
				style="animation-delay: {i * 40}ms;"
			>
				{#if activity.icon}
					<span class="text-xl">{activity.icon}</span>
				{/if}
				<span class="font-display text-base font-black tracking-tight">{activity.name}</span>
			</button>
		{/each}
	</div>
</section>

{#if loading}
	<div class="space-y-4 px-5 pt-6" in:fade>
		<div
			class="h-[220px] animate-pulse rounded-[2rem] bg-gradient-to-r from-ink/5 via-ink/10 to-ink/5 bg-[length:200%_100%]"
		></div>
		<div class="flex gap-4">
			<div class="h-[140px] flex-1 animate-pulse rounded-3xl bg-ink/5"></div>
			<div class="h-[140px] flex-1 animate-pulse rounded-3xl bg-ink/5"></div>
		</div>
	</div>
{:else if selectedActivityId && locations.length > 0}
	<section class="pt-4 pb-4" in:fly={{ y: 20, duration: 400 }}>
		<div class="mb-5 flex items-center gap-3 px-5">
			<h2 class="font-display text-2xl font-black tracking-tight">
				{selectedActivityName}
			</h2>
			<span class="rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">
				{locations.length}
			</span>
		</div>
		<div class="px-5">
			<LocationList {locations} />
		</div>
	</section>
{:else if selectedActivityId}
	<div class="px-5 pt-8" in:fade>
		<EmptyState />
	</div>
{:else}
	<!-- Fallback feed — only when no vibe picked -->
	<div class="px-5 pt-6 pb-2">
		<p class="text-[10px] font-bold tracking-[0.2em] text-muted uppercase">While you decide</p>
	</div>

	{#if data.trendingSpots.length > 0}
		<section class="pt-4">
			<div class="mb-4 flex items-center justify-between px-5">
				<h2 class="font-display text-xl font-black tracking-tight">Trending</h2>
				<button type="button" class="text-xs font-bold text-muted transition-colors hover:text-ink">
					See all
				</button>
			</div>

			{#if data.trendingSpots[0]}
				{@const spot = data.trendingSpots[0]}
				<div class="mb-6 px-5">
					<a
						href={localizeHref(`/location/${spot.slug}`)}
						class="group relative block h-[240px] overflow-hidden rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 active:scale-[0.98]"
						in:fly={{ y: 20, duration: 500 }}
					>
						{#if spot.image || (spot.photos && spot.photos[0])}
							<img
								src={spot.image || spot.photos![0]}
								alt={spot.name}
								class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						{:else}
							<div class="absolute inset-0 bg-gradient-to-br from-peach to-sunny"></div>
						{/if}
						<div
							class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent"
						></div>
						<div
							class="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/20 text-xl shadow-lg backdrop-blur-xl"
						>
							🔥
						</div>
						<div class="absolute right-0 bottom-0 left-0 p-5">
							{#if spot.activities?.[0]}
								<span
									class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md"
								>
									{spot.activities[0].icon} {spot.activities[0].name}
								</span>
							{/if}
							<h3 class="mb-1 font-display text-2xl font-black leading-none tracking-tight text-white">
								{spot.name}
							</h3>
							<p class="text-xs font-medium text-white/70">
								{spot.address?.split(',').slice(0, 2).join(',') || 'Berlin'}
							</p>
						</div>
					</a>
				</div>
			{/if}

			<div class="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-5 pb-6">
				{#each data.trendingSpots.slice(1) as spot, i (spot.id)}
					<a
						href={localizeHref(`/location/${spot.slug}`)}
						class="group w-[160px] flex-shrink-0 snap-start overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 active:scale-95"
						in:fly={{ x: 20, delay: i * 80, duration: 400 }}
					>
						<div class="relative h-[120px] overflow-hidden">
							{#if spot.image || (spot.photos && spot.photos[0])}
								<img
									src={spot.image || spot.photos![0]}
									alt={spot.name}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-matcha to-sunny text-4xl"
								>
									{spot.activities[0]?.icon || '📍'}
								</div>
							{/if}
						</div>
						<div class="p-3">
							<p
								class="mb-1 truncate font-display text-[14px] font-black leading-tight text-ink"
							>
								{spot.name}
							</p>
							<p class="truncate text-[11px] font-medium text-muted">
								{spot.address?.split(',')[0] || 'Berlin'}
							</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if data.newArrivals.length > 0}
		<section class="pt-2 pb-4">
			<div class="mb-4 flex items-center gap-3 px-5">
				<h2 class="font-display text-xl font-black tracking-tight">Just Landed</h2>
				<span
					class="rounded-full bg-matcha px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
				>
					New ✨
				</span>
			</div>
			<div class="flex flex-col gap-3 px-5">
				{#each data.newArrivals as arrival, i (arrival.id)}
					<a
						href={localizeHref(`/location/${arrival.slug}`)}
						class="group flex items-center gap-4 rounded-3xl border border-white bg-white/60 p-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-lg transition-all duration-300 active:scale-[0.98] hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
						in:fly={{ x: -20, delay: i * 80, duration: 400 }}
					>
						<div
							class="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-peach to-sunny"
						>
							{#if arrival.image || (arrival.photos && arrival.photos[0])}
								<img
									src={arrival.image || arrival.photos![0]}
									alt={arrival.name}
									class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
								/>
							{:else}
								<span class="text-2xl">{arrival.activities[0]?.icon || '📍'}</span>
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<p class="mb-0.5 truncate font-display text-[15px] font-black text-ink">
								{arrival.name}
							</p>
							<p class="truncate text-[11px] font-medium text-muted">
								{arrival.activities[0]?.name || ''}{arrival.activities[0] ? ' · ' : ''}{arrival
									.address?.split(',')[0] || 'Berlin'}
							</p>
						</div>
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-ink shadow-sm transition-colors group-hover:bg-sunny"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 transition-transform group-hover:translate-x-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2.5"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
{/if}
