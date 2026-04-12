<script lang="ts">
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import LocationCard from './LocationCard.svelte';

	let { locations = [] } = $props();
</script>

<div class="px-6 pb-20">
	{#each locations as location}
		<LocationCard {location} />
	{/each}
</div>
