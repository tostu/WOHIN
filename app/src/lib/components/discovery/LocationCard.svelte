<script lang="ts">
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { MapPin, Heart, Share2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let { location }: { location: LocationSearchResult } = $props();

	let showEmojis = $state(false);
	let feedbacks = $state<{ id: number; emoji: string }[]>([]);
	let nextFeedbackId = 0;

	const emojiOptions = ['✨', '🔥', '🌿', '🍵', '🌞', '💖'];

	const themeMap: Record<string, string> = {
		matcha: 'accent',
		peach: 'secondary',
		sunny: 'primary'
	};

	function handleFeedback(emoji: string) {
		const id = nextFeedbackId++;
		feedbacks = [...feedbacks, { id, emoji }];
		showEmojis = false;

		// Auto-remove after animation
		setTimeout(() => {
			feedbacks = feedbacks.filter((f) => f.id !== id);
		}, 2000);
	}
</script>

<div class="animate-fade-up relative mb-8">
	<!-- Main Card Body -->
	<a
		href={localizeHref(`/location/${location.slug}`)}
		class="group card-asymmetric relative block overflow-hidden bg-white shadow-extreme transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-[0.98]"
	>
		<div class="flex flex-col gap-6 md:flex-row">
			<!-- Image Section: Breaking boundaries -->
			<div
				class="relative -m-4 aspect-[4/3] overflow-hidden rounded-[2rem] shadow-heavy md:w-48 md:shrink-0"
			>
				{#if location.image || (location.photos && location.photos[0])}
					<img
						src={location.image || location.photos![0]}
						alt={location.name}
						class="h-full w-full object-cover transition-all duration-700 will-change-transform group-hover:scale-110"
					/>
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-secondary/20">
						<MapPin class="h-12 w-12 text-ink/20" />
					</div>
				{/if}

				<!-- Vibe Tag Overlay -->
				{#if location.activities[0]}
					<div
						class="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-1.5 text-[10px] font-black tracking-widest text-ink uppercase shadow-heavy backdrop-blur-md"
						style="background-color: var(--color-{themeMap[location.activities[0].themeColor] ||
							location.activities[0].themeColor ||
							'secondary'})"
					>
						{location.activities[0].name}
					</div>
				{/if}
			</div>

			<!-- Content Section -->
			<div class="flex flex-1 flex-col justify-center py-2">
				<div class="mb-2 flex items-start justify-between">
					<h3 class="font-display text-2xl leading-tight font-black text-ink">
						{location.name}
					</h3>
					<div
						class="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-1 text-[10px] font-black text-ink"
					>
						⭐ {location.rating || '4.5'}
					</div>
				</div>

				<p class="mb-4 flex items-center gap-1 text-sm font-medium text-ink/40">
					<MapPin class="h-3 w-3" />
					{location.address || 'Berlin, Germany'}
				</p>

				<div class="flex items-center justify-between">
					<!-- Mini Feedback Stack -->
					<div class="flex -space-x-2">
						{#each ['✨', '🍵', '🌿'] as emoji, i (emoji)}
							<div
								class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-secondary/20 text-sm shadow-sm"
								style="z-index: {10 - i}"
							>
								{emoji}
							</div>
						{/each}
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary/40 text-[10px] font-black text-ink"
						>
							+12
						</div>
					</div>

					<div class="flex gap-2">
						<button
							class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-ink transition-colors hover:bg-secondary/40"
							onclick={(e) => {
								e.preventDefault();
								showEmojis = !showEmojis;
							}}
						>
							<Heart class="h-5 w-5 {showEmojis ? 'fill-ink' : ''}" />
						</button>
						<button
							class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20 text-ink transition-colors hover:bg-secondary/40"
						>
							<Share2 class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</a>

	<!-- Emoji Picker Overlay -->
	{#if showEmojis}
		<div
			class="glass absolute right-12 -bottom-4 z-20 flex gap-2 rounded-2xl p-2 shadow-extreme"
			transition:fly={{ y: 10, duration: 200 }}
		>
			{#each emojiOptions as emoji (emoji)}
				<button
					class="flex h-10 w-10 items-center justify-center text-xl transition-transform hover:scale-150 active:scale-90"
					onclick={() => handleFeedback(emoji)}
				>
					{emoji}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Floating Feedback Animation -->
	<div class="pointer-events-none absolute inset-0 z-30 overflow-hidden">
		{#each feedbacks as f (f.id)}
			<div
				class="absolute bottom-10 left-1/2 text-4xl"
				in:fly={{ y: 0, x: Math.random() * 100 - 50, duration: 1000 }}
				out:fly={{ y: -200, x: Math.random() * 200 - 100, duration: 2000 }}
			>
				{f.emoji}
			</div>
		{/each}
	</div>
</div>
