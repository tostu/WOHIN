<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import type { LocationSearchResult } from '$lib/server/services/discovery';

	let { locations = [] } = $props();

	let mapContainer: HTMLElement;
	let map: maplibregl.Map;

	onMount(() => {
		map = new maplibregl.Map({
			container: mapContainer,
			style: 'https://demotiles.maplibre.org/style.json', // Basic style
			center: [13.405, 52.52], // Berlin
			zoom: 12
		});

		map.addControl(new maplibregl.NavigationControl());
	});

	$effect(() => {
		if (map && locations.length > 0) {
			// Clear existing markers if any (simplified)
			locations.forEach((loc) => {
				// In a real implementation, we would add markers for each location
				// console.log('Adding marker for:', loc.name);
			});
		}
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div
	class="bg-surface-container-low shadow-ambient h-64 w-full overflow-hidden rounded-[2.5rem]"
	bind:this={mapContainer}
></div>
