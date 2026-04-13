<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
</script>

<footer class="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
	<div class="flex flex-col items-start gap-6 border-t border-ink/10 pt-10 md:flex-row md:items-center md:justify-between">
		<div>
			<p class="font-display text-2xl font-black tracking-tight text-ink">wohin.</p>
			<p class="mt-1 text-xs font-semibold tracking-widest text-muted uppercase">
				The Radiant Curator
			</p>
		</div>

		<nav class="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest text-muted uppercase">
			<a href="/home" class="transition-colors hover:text-ink">Discover</a>
			<a href="/submit" class="transition-colors hover:text-ink">Submit</a>
			<a href="/map" class="transition-colors hover:text-ink">Map</a>
		</nav>

		<div class="flex items-center gap-3 text-xs font-semibold text-muted">
			{#each locales as locale (locale)}
				<a
					href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
					class="rounded-full border border-ink/10 px-3 py-1 uppercase tracking-wider transition-colors hover:border-ink hover:text-ink"
				>
					{locale}
				</a>
			{/each}
		</div>
	</div>

	<p class="mt-8 text-xs font-medium text-muted">
		© {new Date().getFullYear()} Wohin. Sun-drenched social edition.
	</p>
</footer>
