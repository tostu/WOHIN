<script lang="ts">
	import type { PageData } from './$types';
	import VibeCheck from '$lib/components/feedback/VibeCheck.svelte';
	
	let { data }: { data: any } = $props();
	
	let location = $derived(data.location);
	let selectedActivityId = $state<string | null>(null);

	$effect(() => {
		if (location && location.activities.length > 0 && !selectedActivityId) {
			selectedActivityId = location.activities[0].id;
		}
	});
</script>

{#if location}
	<article class="relative flex min-h-screen flex-col bg-surface">
		<header class="relative h-[50vh] w-full overflow-hidden rounded-b-[3rem]">
			{#if location.photos && location.photos[0]}
				<img
					src={location.photos[0]}
					alt={location.name}
					class="h-full w-full object-cover"
				/>
			{:else}
				<div class="flex h-full w-full items-center justify-center bg-surface-container-high">
					<span class="text-8xl">🏙️</span>
				</div>
			{/if}
			
			<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
			
			<div class="absolute bottom-10 left-6 right-6">
				<h1 class="mb-2 text-4xl font-black font-display text-white sm:text-6xl">{location.name}</h1>
				<p class="text-lg font-medium text-white/90">{location.address || 'Address coming soon'}</p>
			</div>
		</header>

		<section class="flex-grow rounded-t-[3rem] bg-surface-container-low px-6 pt-10 shadow-ambient -mt-12 relative z-10">
			<div class="mb-10 flex flex-wrap gap-2">
				{#each location.activities as activity}
					<button 
						onclick={() => selectedActivityId = activity.id}
						class="rounded-full px-5 py-2 text-sm font-bold tracking-wide transition-all {selectedActivityId === activity.id ? `bg-peach text-white` : `bg-${activity.themeColor}/20 text-${activity.themeColor}-800`}"
					>
						{activity.icon} {activity.name}
					</button>
				{/each}
			</div>

			<div class="prose prose-neutral max-w-none text-neutral-700 mb-12">
				<p>{location.description || 'No description available yet.'}</p>
			</div>

			{#if selectedActivityId}
				<div class="rounded-[2.5rem] bg-surface-container-lowest p-8 mb-12 shadow-ambient">
					<VibeCheck locationId={location.id} activityId={selectedActivityId} />
				</div>
			{/if}

			<div class="rounded-[2.5rem] bg-surface-container-lowest p-8 mb-24 shadow-ambient">
				<h3 class="mb-4 text-xl font-bold font-display text-neutral-800">✨ Vibe History</h3>
				<p class="text-neutral-500 italic">No vibe checks yet. Be the first to drop one! 💖</p>
			</div>
		</section>
	</article>
{:else}
	<div class="flex h-screen items-center justify-center">
		<p>Loading the magic... ✨</p>
	</div>
{/if}
