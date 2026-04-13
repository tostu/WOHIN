<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const vibes = [
		{ name: 'Study', color: 'bg-sunny', delay: 200, rotate: '-rotate-3', emoji: '📚' },
		{ name: 'Relax', color: 'bg-matcha', delay: 400, rotate: 'rotate-2', emoji: '🍵' },
		{ name: 'Party', color: 'bg-peach', delay: 600, rotate: '-rotate-6', emoji: '🪩' }
	];
</script>

<svelte:head>
	<title>wohin — The Radiant Curator</title>
</svelte:head>

<main class="relative mx-auto max-w-6xl px-6 pt-14 pb-12 md:px-10 md:pt-20 md:pb-24">
	<!-- Wordmark only — no nav on landing -->
	<div
		in:fly={{ y: -20, duration: 800, delay: 100 }}
		class="mb-20 font-display text-2xl font-extrabold tracking-tighter uppercase md:mb-32 md:text-3xl"
	>
		wohin.
	</div>

	<!-- Hero -->
	<section class="mb-32 flex flex-col items-center gap-12 md:mb-48 md:flex-row md:gap-24">
		<div class="md:w-1/2">
			<div
				in:fade={{ duration: 1000, delay: 300 }}
				class="mb-6 inline-block rounded-2xl bg-white/50 px-4 py-2 text-sm font-semibold tracking-widest text-muted uppercase backdrop-blur-md"
			>
				Your Next Destination
			</div>
			<h1
				in:fly={{ y: 30, duration: 1000, delay: 400 }}
				class="mb-8 font-display text-6xl leading-[0.9] font-black tracking-tighter md:text-8xl"
			>
				Find your <br />
				<span class="relative mt-2 inline-block">
					<span class="relative z-10">perfect vibe.</span>
					<span
						class="absolute bottom-2 left-0 -z-10 h-4 w-full -rotate-1 transform rounded-full bg-sunny opacity-80"
					></span>
				</span>
			</h1>
			<p
				in:fly={{ y: 30, duration: 1000, delay: 500 }}
				class="mb-10 max-w-lg text-xl leading-relaxed font-light text-ink/70 md:text-2xl"
			>
				Wohin is a radically curated, delightfully social discovery engine for the places you
				actually want to be. Drop the generic reviews and find locations based on exactly what you
				want to do.
			</p>
			<div in:fly={{ y: 30, duration: 1000, delay: 600 }}>
				<a
					href="/home"
					class="group inline-flex items-center gap-4 rounded-full bg-peach px-8 py-4 text-lg font-bold text-ink shadow-[0_10px_40px_rgba(255,183,178,0.4)] transition-all duration-300 hover:bg-ink hover:text-cream"
				>
					Start Discovering
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 transition-transform group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>
			</div>
		</div>

		<!-- Floating vibe cards -->
		<div class="relative mt-12 h-[400px] w-full md:mt-0 md:w-1/2">
			{#each vibes as vibe, i (vibe.name)}
				<div
					in:fly={{ y: 50, duration: 800, delay: vibe.delay + 600 }}
					class="absolute h-48 w-48 {vibe.color} {vibe.rotate} flex cursor-default transform flex-col justify-between rounded-3xl bg-opacity-90 p-6 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover:rotate-0 hover:scale-105 md:h-64 md:w-64"
					style="top: {i * 15}%; left: {i * 20}%; z-index: {10 - i};"
				>
					<div class="text-4xl md:text-6xl">{vibe.emoji}</div>
					<div class="font-display text-2xl font-bold md:text-3xl">{vibe.name}</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Features -->
	<section
		in:fade={{ duration: 1000, delay: 1000 }}
		class="border-t-2 border-ink/5 py-24"
	>
		<h2
			class="mb-16 text-center font-display text-4xl font-extrabold tracking-tight md:text-5xl"
		>
			The Radiant Curator
		</h2>

		<div class="grid gap-12 md:grid-cols-3">
			<div
				class="group rounded-[2.5rem] bg-white/40 p-10 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/60"
			>
				<div
					class="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-sunny text-3xl shadow-lg transition-transform group-hover:rotate-12"
				>
					☕
				</div>
				<h3 class="mb-4 font-display text-2xl font-bold">Activity First</h3>
				<p class="leading-relaxed text-ink/70">
					Don't search for "coffee shops". Search for "study spots". Wohin curates places based on
					the intention behind your visit.
				</p>
			</div>

			<div
				class="group rounded-[2.5rem] bg-white/40 p-10 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/60"
			>
				<div
					class="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-matcha text-3xl shadow-lg transition-transform group-hover:-rotate-12"
				>
					✨
				</div>
				<h3 class="mb-4 font-display text-2xl font-bold">The Vibe Check</h3>
				<p class="leading-relaxed text-ink/70">
					Drop playful, animated vibe checks to let others know if a spot is truly matching the
					energy. Contribute to the pulse of the community.
				</p>
			</div>

			<div
				class="group rounded-[2.5rem] bg-white/40 p-10 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-colors duration-500 hover:bg-white/60"
			>
				<div
					class="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-peach text-3xl shadow-lg transition-transform group-hover:scale-110"
				>
					📱
				</div>
				<h3 class="mb-4 font-display text-2xl font-bold">Native Feel</h3>
				<p class="leading-relaxed text-ink/70">
					A Progressive Web App that feels right at home on your device. Fast, installable, and
					ready to go wherever you are.
				</p>
			</div>
		</div>
	</section>
</main>
