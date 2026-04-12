<script lang="ts">
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { locations = [] } = $props();
</script>

<div class="space-y-6 px-6 pb-20">
	{#each locations as location}
		<a
			href={localizeHref(`/location/${location.slug}`)}
			class="group block overflow-hidden rounded-[2.5rem] bg-surface-container-lowest p-4 transition-all duration-300 hover:bg-surface-container-low shadow-ambient active:scale-[0.98]"
		>
			<div class="relative mb-4 aspect-[4/3] overflow-hidden rounded-[2rem]">
				{#if location.photos && location.photos[0]}
					<img
						src={location.photos[0]}
						alt={location.name}
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-surface-container-high">
						<span class="text-4xl">🏙️</span>
					</div>
				{/if}
				
				<div class="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-neutral-800 shadow-sm backdrop-blur-md">
					⭐ {location.rating}
				</div>
			</div>

			<div class="px-2">
				<h3 class="mb-1 text-xl font-bold font-display text-neutral-800">{location.name}</h3>
				<p class="mb-3 text-sm text-neutral-500">{location.address || 'Address coming soon'}</p>
				
				<div class="flex flex-wrap gap-1.5">
					{#each location.activities as activity}
						<span class="rounded-full bg-{activity.themeColor}/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-{activity.themeColor}-800">
							{activity.name}
						</span>
					{/each}
				</div>
			</div>
		</a>
	{/each}
</div>
