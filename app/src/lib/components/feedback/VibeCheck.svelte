<script lang="ts">
	import { slide } from 'svelte/transition';
	
	let { locationId, activityId, onVibe = (vibe: string) => {} } = $props();
	
	const vibes = [
		{ id: 'sparkle', emoji: '✨', label: 'Sparkle' },
		{ id: 'fire', emoji: '🔥', label: 'Fire' },
		{ id: 'chill', emoji: '🧊', label: 'Chill' },
		{ id: 'nope', emoji: '👎', label: 'Nope' }
	];

	let celebrating = $state(false);
	let currentVibe = $state<string | null>(null);

	async function dropVibe(vibe: string) {
		currentVibe = vibe;
		celebrating = true;
		
		setTimeout(() => {
			celebrating = false;
		}, 2000);

		const response = await fetch('/api/v1/feedback/vibe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locationId, activityId, vibe })
		});

		if (response.ok) {
			onVibe(vibe);
		}
	}
</script>

<div class="flex flex-col gap-4">
	<p class="text-sm font-bold text-neutral-500 uppercase tracking-widest">Drop a vibe</p>
	<div class="flex gap-3">
		{#each vibes as vibe}
			<button
				onclick={() => dropVibe(vibe.id)}
				class="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-lowest text-2xl shadow-ambient transition-all hover:scale-110 hover:bg-white active:scale-95 {currentVibe === vibe.id ? 'ring-2 ring-peach ring-offset-2' : ''}"
				title={vibe.label}
			>
				{vibe.emoji}
				
				{#if celebrating && currentVibe === vibe.id}
					<span class="absolute -top-12 animate-bounce text-4xl">🎊</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	@keyframes float {
		0% { transform: translateY(0) scale(1); opacity: 1; }
		100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
	}
</style>
