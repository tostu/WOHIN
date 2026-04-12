<script lang="ts">
	import type { PageData } from './$types';
	import VibeCheck from '$lib/components/feedback/VibeCheck.svelte';

	let { data }: { data: PageData } = $props();

	let location = $derived(data.location);
	let initialVibeHistory = $derived(data.vibeHistory || []);
	let selectedActivityId = $state<string | null>(null);

	// Local state for optimistic updates
	let vibeHistory = $state<any[]>([]);

	$effect(() => {
		if (initialVibeHistory) {
			vibeHistory = [...initialVibeHistory];
		}
	});

	$effect(() => {
		if (location && location.activities.length > 0 && !selectedActivityId) {
			selectedActivityId = location.activities[0].id;
		}
	});

	function handleVibe(vibe: string) {
		// Optimistic update
		vibeHistory = [
			...vibeHistory,
			{
				id: Math.random().toString(),
				locationId: location.id,
				activityId: selectedActivityId,
				vibe: vibe,
				createdAt: new Date().toISOString()
			}
		];
	}

	let vibeCounts = $derived.by(() => {
		const counts: Record<string, number> = { sparkle: 0, fire: 0, chill: 0, nope: 0 };
		for (const v of vibeHistory) {
			if (counts[v.vibe] !== undefined) {
				counts[v.vibe]++;
			}
		}
		return counts;
	});
</script>

{#if location}
	<article class="relative flex min-h-screen flex-col bg-surface">
		<header class="relative h-[50vh] w-full overflow-hidden rounded-b-[3rem]">
			{#if location.photos && location.photos[0]}
				<img src={location.photos[0]} alt={location.name} class="h-full w-full object-cover" />
			{:else}
				<div class="bg-surface-container-high flex h-full w-full items-center justify-center">
					<span class="text-8xl">🏙️</span>
				</div>
			{/if}

			<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

			<div class="absolute right-6 bottom-10 left-6">
				<h1 class="mb-2 font-display text-4xl font-black text-white sm:text-6xl">
					{location.name}
				</h1>
				<p class="text-lg font-medium text-white/90">{location.address || 'Address coming soon'}</p>
			</div>
		</header>

		<section
			class="bg-surface-container-low shadow-ambient relative z-10 -mt-12 flex-grow rounded-t-[3rem] px-6 pt-10"
		>
			<div class="mb-10 flex flex-wrap gap-2">
				{#each location.activities as activity}
					<button
						onclick={() => (selectedActivityId = activity.id)}
						class="rounded-full px-5 py-2 text-sm font-bold tracking-wide transition-all {selectedActivityId ===
						activity.id
							? `bg-peach text-white`
							: `bg-${activity.themeColor}/20 text-${activity.themeColor}-800`}"
					>
						{activity.icon}
						{activity.name}
					</button>
				{/each}
			</div>

			<div class="prose prose-neutral mb-12 max-w-none text-neutral-700">
				<p>{location.description || 'No description available yet.'}</p>
			</div>

			{#if selectedActivityId}
				<div class="bg-surface-container-lowest shadow-ambient mb-12 rounded-[2.5rem] p-8">
					<VibeCheck locationId={location.id} activityId={selectedActivityId} onVibe={handleVibe} />
				</div>
			{/if}

			<div class="bg-surface-container-lowest shadow-ambient mb-24 rounded-[2.5rem] p-8">
				<h3 class="mb-6 font-display text-2xl font-black text-neutral-800">✨ Vibe History</h3>
				{#if vibeHistory.length === 0}
					<p class="font-medium text-neutral-500 italic">
						No vibe checks yet. Be the first to drop one! 💖
					</p>
				{:else}
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
						{#if vibeCounts.sparkle > 0}
							<div
								class="flex flex-col items-center justify-center rounded-3xl bg-[#deffaf]/30 p-6 font-bold text-neutral-800 shadow-sm transition-transform hover:scale-105"
							>
								<span class="mb-2 text-4xl">✨</span>
								<span class="text-2xl">{vibeCounts.sparkle}</span>
							</div>
						{/if}
						{#if vibeCounts.fire > 0}
							<div
								class="flex flex-col items-center justify-center rounded-3xl bg-[#ff9e6d]/20 p-6 font-bold text-neutral-800 shadow-sm transition-transform hover:scale-105"
							>
								<span class="mb-2 text-4xl">🔥</span>
								<span class="text-2xl">{vibeCounts.fire}</span>
							</div>
						{/if}
						{#if vibeCounts.chill > 0}
							<div
								class="flex flex-col items-center justify-center rounded-3xl bg-blue-100/50 p-6 font-bold text-neutral-800 shadow-sm transition-transform hover:scale-105"
							>
								<span class="mb-2 text-4xl">🧊</span>
								<span class="text-2xl">{vibeCounts.chill}</span>
							</div>
						{/if}
						{#if vibeCounts.nope > 0}
							<div
								class="flex flex-col items-center justify-center rounded-3xl bg-neutral-100 p-6 font-bold text-neutral-800 shadow-sm transition-transform hover:scale-105"
							>
								<span class="mb-2 text-4xl">👎</span>
								<span class="text-2xl">{vibeCounts.nope}</span>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	</article>
{:else}
	<div class="flex h-screen items-center justify-center">
		<p class="animate-pulse font-bold text-peach">Loading the magic... ✨</p>
	</div>
{/if}
