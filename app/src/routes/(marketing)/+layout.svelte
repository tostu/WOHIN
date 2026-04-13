<script lang="ts">
	import Background from '$lib/components/layout/Background.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();
</script>

<Background intensity="bold" />

<div class="relative z-10 min-h-screen overflow-hidden text-ink">
	{@render children()}
	<Footer />
</div>
