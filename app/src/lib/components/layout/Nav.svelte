<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';

	let currentPath = $derived(page.url.pathname);

	const links = [
		{ href: '/', label: 'Discover', icon: '✨' },
		{ href: '/submit', label: 'Submit', icon: '⊕' },
		{ href: '/me', label: 'Me', icon: '☺' }
	];
</script>

<nav class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-surface-container-low/80 p-2 shadow-ambient backdrop-blur-md">
	{#each links as link}
		<a
			href={localizeHref(link.href)}
			class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-surface-container-high/50 {currentPath === localizeHref(link.href) ? 'bg-peach text-white' : 'text-neutral-700'}"
		>
			<span class="text-lg leading-none">{link.icon}</span>
			<span class="hidden sm:inline">{link.label}</span>
		</a>
	{/each}
</nav>
