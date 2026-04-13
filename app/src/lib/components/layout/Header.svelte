<script lang="ts">
	import { Search, Bell } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		withSearch?: boolean;
		onSearch?: (q: string) => void;
	}
	let { withSearch = true, onSearch }: Props = $props();

	let open = $state(false);
	let query = $state('');
	let inputEl: HTMLInputElement | null = $state(null);

	function toggle() {
		open = !open;
		if (open) setTimeout(() => inputEl?.focus(), 50);
	}

	function submit(e: Event) {
		e.preventDefault();
		onSearch?.(query);
	}
</script>

<header class="safe-top sticky top-0 z-40 border-b border-ink/5 bg-cream/70 backdrop-blur-xl">
	<div class="flex items-center justify-between px-5 py-3">
		<div
			class="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-cream shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
		>
			<span class="h-2 w-2 animate-pulse rounded-full bg-sunny"></span>
			<span class="font-display text-sm font-black tracking-tight">wohin.</span>
		</div>

		<div class="flex gap-2">
			{#if withSearch}
				<button
					type="button"
					onclick={toggle}
					aria-label="Search"
					aria-expanded={open}
					class="flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-all hover:bg-ink/10 active:scale-90"
				>
					<Search size={20} strokeWidth={2.5} />
				</button>
			{/if}
			<button
				type="button"
				aria-label="Notifications"
				class="relative flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink transition-all hover:bg-ink/10 active:scale-90"
			>
				<Bell size={20} strokeWidth={2.5} />
				<span class="absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 border-cream bg-peach"
				></span>
			</button>
		</div>
	</div>

	{#if open && withSearch}
		<div class="px-5 pb-4" transition:fly={{ y: -10, duration: 200 }}>
			<form
				onsubmit={submit}
				class="flex items-center gap-3 rounded-2xl border-2 border-ink/10 bg-white px-4 py-3 shadow-inner"
			>
				<Search size={18} strokeWidth={2.5} class="text-ink/40" />
				<input
					bind:this={inputEl}
					bind:value={query}
					type="search"
					placeholder="Find a place, vibe, neighbourhood…"
					class="flex-1 border-none bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
					onblur={() => {
						if (!query) open = false;
					}}
				/>
			</form>
		</div>
	{/if}
</header>
