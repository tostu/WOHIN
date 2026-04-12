<script lang="ts">
	import ActivitySearch from '$lib/components/discovery/ActivitySearch.svelte';
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import MapView from '$lib/components/discovery/MapView.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { Search } from 'lucide-svelte';

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
</script>

<div class="flex min-h-screen flex-col">
	<!-- Massive Hero Section -->
	<header class="relative overflow-hidden px-6 pt-16 pb-12">
		<div
			class="animate-pulse-soft absolute -top-20 -right-20 h-64 w-64 rounded-full bg-sun-golden/20 blur-3xl"
		></div>

		<h1 class="text-massive relative z-10 mb-6 text-sun-ink">
			Whatcha <br />
			<span class="text-sun-peach italic drop-shadow-sm">wanna</span> <br />
			<span class="inline-block transition-transform duration-300 hover:rotate-2">do?</span>
		</h1>

		<p class="max-w-[320px] text-xl leading-tight font-bold text-sun-ink/60">
			Find the perfect spot for your next radiant move.
		</p>
	</header>

	<section class="glass sticky top-20 z-30 py-2">
		<ActivitySearch activities={data.activities} onSelect={handleActivitySelect} />
	</section>

	<section class="p-6">
		<div class="card-asymmetric group h-64 overflow-hidden bg-sun-ink shadow-extreme">
			<MapView {locations} />
		</div>
	</section>

	<section class="flex-grow pt-8">
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
			<div class="mb-8 flex items-end justify-between px-6">
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
		{:else}
			<div class="animate-fade-up px-6 py-32 text-center">
				<div
					class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-sun-peach/20"
				>
					<Search class="h-10 w-10 text-sun-peach" />
				</div>
				<p class="font-black tracking-widest text-sun-ink/40 uppercase">
					Pick an activity to start the discovery! 🚀
				</p>
			</div>
		{/if}
	</section>
</div>
