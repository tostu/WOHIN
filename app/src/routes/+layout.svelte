<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
	<title>WOHIN — the radiant curator</title>
</svelte:head>

{@render children()}
