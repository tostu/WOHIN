<script lang="ts">
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Home, Sparkles, Map as MapIcon, Plus, User } from 'lucide-svelte';

	let currentPath = $derived(page.url.pathname);

	const links = [
		{ href: '/home', label: 'Home', icon: Home },
		{ href: '/discover', label: 'Discover', icon: Sparkles },
		{ href: '/map', label: 'Map', icon: MapIcon },
		{ href: '/submit', label: 'Submit', icon: Plus },
		{ href: '/me', label: 'Profile', icon: User }
	];

	function isActive(href: string) {
		const localized = localizeHref(href);
		const path = currentPath.replace(/\/+$/, '') || '/';
		const target = localized.replace(/\/+$/, '') || '/';
		if (target === '/') return path === '/';
		return path === target || path.startsWith(target + '/');
	}
</script>

<nav
	class="glass safe-bottom fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-[2rem] p-1.5 shadow-extreme"
>
	{#each links as link}
		{@const Icon = link.icon}
		{@const active = isActive(link.href)}
		<a
			href={localizeHref(link.href)}
			aria-current={active ? 'page' : undefined}
			class="flex h-14 w-14 flex-col items-center justify-center rounded-2xl transition-all duration-300 {active
				? 'bg-primary text-ink shadow-heavy'
				: 'text-ink/40 hover:bg-secondary/20 hover:text-ink/60'}"
		>
			<Icon class="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
			<span class="mt-0.5 text-[9px] font-black tracking-tighter uppercase">
				{link.label}
			</span>
		</a>
	{/each}
</nav>
