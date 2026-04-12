<script lang="ts">
	import LocationForm from '$lib/components/submissions/LocationForm.svelte';

	let submitted = $state(false);

	function handleSuccess() {
		submitted = true;
	}
</script>

<div class="flex min-h-screen flex-col px-6 pt-16">
	<header class="relative mb-16">
		<div class="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-sun-peach/20 blur-3xl"></div>

		<h1 class="text-massive relative z-10 mb-6 text-sun-ink">
			Share a <br />
			<span class="text-sun-matcha italic drop-shadow-sm">new</span> <br />
			discovery.
		</h1>
		<p class="max-w-[320px] text-xl leading-tight font-bold text-sun-ink/60">
			Help the community grow by adding your favorite radiant spots.
		</p>
	</header>

	{#if submitted}
		<div class="animate-fade-up flex flex-col items-center justify-center py-24 text-center">
			<div class="animate-float mb-8 text-9xl">🕊️</div>
			<h2 class="mb-4 text-4xl font-black text-sun-ink">Sent to the curators!</h2>
			<p class="mb-10 max-w-xs font-medium text-sun-ink/60">
				We'll review your spot and add it to the radiant map soon. Thanks for being awesome! ✨
			</p>
			<button
				onclick={() => (submitted = false)}
				class="rounded-2xl border-2 border-sun-ink bg-white px-8 py-4 font-black tracking-widest text-sun-ink uppercase shadow-heavy transition-all hover:-translate-y-1 active:scale-95"
			>
				Submit another
			</button>
		</div>
	{:else}
		<section
			class="card-asymmetric relative z-10 mb-32 border-2 border-sun-ink/5 bg-white shadow-extreme"
		>
			<LocationForm onSuccess={handleSuccess} />
		</section>
	{/if}
</div>
