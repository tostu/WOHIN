<script lang="ts">
	import ActivitySearch from '$lib/components/discovery/ActivitySearch.svelte';
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import MapView from '$lib/components/discovery/MapView.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	
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

<div class="flex flex-col min-h-screen">
	<header class="px-6 pt-12 pb-6">
		<h1 class="text-6xl font-black font-display text-neutral-800 leading-[0.9] mb-4">
			Whatcha <br /> wanna <br /> <span class="text-peach italic">do?</span>
		</h1>
		<p class="text-lg text-neutral-500 font-medium max-w-[280px]">Find the perfect spot for your next move.</p>
	</header>

	<section class="sticky top-0 z-30 bg-surface/90 backdrop-blur-md">
		<ActivitySearch activities={data.activities} onSelect={handleActivitySelect} />
	</section>

	<section class="p-6">
		<MapView {locations} />
	</section>

	<section class="flex-grow">
		{#if loading}
			<div class="flex items-center justify-center py-20">
				<p class="text-peach animate-pulse font-bold">Summoning the vibes... ✨</p>
			</div>
		{:else if locations.length > 0}
			<div class="px-6 mb-4">
				<h2 class="text-2xl font-black font-display text-neutral-800">Results</h2>
			</div>
			<LocationList {locations} />
		{:else if selectedActivityId}
			<EmptyState />
		{:else}
			<div class="px-6 py-20 text-center">
				<p class="text-neutral-400 font-medium">Pick an activity to start the discovery! 🚀</p>
			</div>
		{/if}
	</section>
</div>
