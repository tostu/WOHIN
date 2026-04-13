<script lang="ts">
	import Background from '$lib/components/layout/Background.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import Nav from '$lib/components/layout/Nav.svelte';

	let { children } = $props();
</script>

<Background intensity="subtle" />

<div class="relative z-10 min-h-screen text-ink">
	<div
		class="relative mx-auto flex min-h-screen max-w-2xl flex-col bg-white/40 backdrop-blur-3xl md:border-x md:border-ink/5 md:shadow-2xl"
	>
		<Header />

		<main class="flex-1 overflow-x-hidden pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
			<div class="animate-fade-up">
				{@render children()}
			</div>
		</main>
	</div>

	<Nav />
</div>
