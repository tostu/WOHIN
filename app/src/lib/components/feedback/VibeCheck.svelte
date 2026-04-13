<script lang="ts">
	let { locationId, activityId, onVibe = (vibe: string) => {} } = $props();

	const vibes = [
		{
			id: 'sparkle',
			emoji: '✨',
			label: 'Sparkle',
			color: 'text-yellow-400',
			bg: 'hover:bg-[#deffaf]/50'
		},
		{
			id: 'fire',
			emoji: '🔥',
			label: 'Fire',
			color: 'text-orange-500',
			bg: 'hover:bg-[#ff9e6d]/30'
		},
		{
			id: 'chill',
			emoji: '🧊',
			label: 'Chill',
			color: 'text-blue-400',
			bg: 'hover:bg-blue-100/50'
		},
		{
			id: 'nope',
			emoji: '👎',
			label: 'Nope',
			color: 'text-neutral-500',
			bg: 'hover:bg-neutral-100'
		}
	];

	let currentVibe = $state<string | null>(null);

	// Particle system
	type Particle = {
		id: number;
		emoji: string;
		x: number;
		duration: number;
		delay: number;
	};
	let particles = $state<Particle[]>([]);
	let particleIdCounter = 0;

	async function dropVibe(vibeId: string) {
		const vibeDef = vibes.find((v) => v.id === vibeId);
		if (!vibeDef) return;

		currentVibe = vibeId;

		// Spawn a burst of particles
		for (let i = 0; i < 6; i++) {
			particles = [
				...particles,
				{
					id: particleIdCounter++,
					emoji: vibeDef.emoji,
					x: Math.random() * 120 - 60, // -60px to +60px
					duration: 1.2 + Math.random() * 1.5, // 1.2s to 2.7s
					delay: Math.random() * 0.15
				}
			];
		}

		// Clean up old particles
		setTimeout(() => {
			particles = particles.slice(6);
		}, 3000);

		// Non-blocking fetch
		fetch('/api/v1/feedback/vibe', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ locationId, activityId, vibe: vibeId })
		}).catch(console.error);

		// Optimistic UI update
		onVibe(vibeId);
	}
</script>

<div class="relative flex flex-col gap-6 p-2">
	<div class="relative z-10 flex items-center justify-between">
		<h3 class="text-sm font-black tracking-[0.2em] text-neutral-500 uppercase opacity-80">
			Drop a vibe
		</h3>
		{#if currentVibe}
			<span
				class="animate-pulse rounded-full bg-white/50 px-3 py-1 text-xs font-bold text-peach shadow-sm"
				>Vibe sent! 💌</span
			>
		{/if}
	</div>

	<div class="relative z-10 flex justify-between gap-4 sm:justify-start sm:gap-6">
		{#each vibes as vibe}
			<button
				onclick={() => dropVibe(vibe.id)}
				class="group bg-surface-container hover:shadow-ambient relative flex h-16 w-16 items-center justify-center rounded-[2rem] text-3xl shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-110 sm:h-20 sm:w-20 sm:text-4xl {vibe.bg} active:scale-95 {currentVibe ===
				vibe.id
					? 'ring-offset-surface-container-lowest bg-white ring-4 ring-peach/50 ring-offset-4'
					: ''}"
				title={vibe.label}
				aria-label={`Drop a ${vibe.label} vibe`}
			>
				<span
					class="transform transition-transform duration-300 group-hover:scale-125 group-active:scale-90"
					>{vibe.emoji}</span
				>
			</button>
		{/each}
	</div>

	<!-- Particle Container -->
	<div
		class="pointer-events-none absolute right-0 bottom-full left-0 z-20 h-[350px] overflow-hidden"
		aria-hidden="true"
	>
		{#each particles as p (p.id)}
			<span
				class="absolute bottom-4 text-4xl will-change-transform sm:text-5xl"
				style="
					left: calc(50% + {p.x}px);
					animation: floatUp {p.duration}s cubic-bezier(0.25, 1, 0.5, 1) {p.delay}s forwards;
					opacity: 0;
					transform-origin: center bottom;
				"
			>
				{p.emoji}
			</span>
		{/each}
	</div>
</div>

<style>
	@keyframes floatUp {
		0% {
			transform: translateY(0) scale(0.3) rotate(0deg);
			opacity: 0;
		}
		15% {
			opacity: 1;
			transform: translateY(-20px) scale(1.1) rotate(-15deg);
		}
		50% {
			opacity: 0.8;
			transform: translateY(-120px) scale(1.3) rotate(10deg);
		}
		100% {
			transform: translateY(-300px) scale(0.8) rotate(35deg);
			opacity: 0;
		}
	}
</style>
