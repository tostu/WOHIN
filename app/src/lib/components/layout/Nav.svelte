<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Search, Map as MapIcon, Plus, User } from 'lucide-svelte';

	let currentPath = $derived(page.url.pathname);

	const links = [
		{ href: '/', label: 'Discover', icon: Search },
		{ href: '/map', label: 'Map', icon: MapIcon },
		{ href: '/submit', label: 'Submit', icon: Plus },
		{ href: '/me', label: 'Profile', icon: User }
	];

	function isActive(href: string) {
		const localized = localizeHref(href);
		if (localized === '/') return currentPath === localized;
		return currentPath.startsWith(localized);
	}
</script>

<nav
	class="glass fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-[2rem] p-2 shadow-extreme"
>
	{#each links as link}
		{@const Icon = link.icon}
		{@const active = isActive(link.href)}
		<a
			href={localizeHref(link.href)}
			class="flex h-16 w-16 flex-col items-center justify-center rounded-2xl transition-all duration-300 {active
				? 'bg-sun-golden text-sun-ink shadow-heavy'
				: 'text-sun-ink/40 hover:bg-sun-peach/20 hover:text-sun-ink/60'}"
		>
			<Icon class="h-6 w-6" strokeWidth={active ? 2.5 : 2} />
			<span class="mt-1 text-[10px] font-black tracking-tighter uppercase">
				{link.label}
			</span>
		</a>
	{/each}
</nav>
