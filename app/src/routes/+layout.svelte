<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/layout/Nav.svelte';
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { Sun } from 'lucide-svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>WOHIN — the radiant curator</title>
</svelte:head>

<!-- Sticky Header -->
<header class="glass sticky top-0 z-50 flex items-center justify-between px-6 py-4">
	<div class="flex items-center gap-3">
		<div
			class="animate-float flex h-12 w-12 items-center justify-center rounded-full bg-sun-golden shadow-heavy"
		>
			<Sun class="h-7 w-7 text-sun-ink" />
		</div>
		<div>
			<h1 class="font-display text-2xl font-black tracking-tight text-sun-ink">WOHIN</h1>
			<p class="text-[10px] font-bold tracking-[0.2em] text-sun-ink/40 uppercase">
				The Radiant Curator
			</p>
		</div>
	</div>
</header>

<main class="min-h-screen pb-32">
	<div class="animate-fade-up">
		{@render children()}
	</div>
</main>

<Nav />

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
