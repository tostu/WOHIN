<script lang="ts">
	let { activities = [], onSelect = () => {} } = $props();

	let selectedActivityId = $state<string | null>(null);

	function select(id: string) {
		selectedActivityId = id;
		onSelect(id);
	}

	const colorMap: Record<string, string> = {
		matcha: 'bg-accent hover:bg-accent/80',
		peach: 'bg-secondary hover:bg-secondary/80',
		sunny: 'bg-primary hover:bg-primary/80',
		primary: 'bg-primary hover:bg-primary/80',
		secondary: 'bg-secondary hover:bg-secondary/80',
		accent: 'bg-accent hover:bg-accent/80'
	};

	type ThemeColor = keyof typeof colorMap;
</script>

<div class="no-scrollbar flex flex-wrap gap-4 overflow-x-auto px-6 py-6">
	{#each activities as activity (activity.id)}
		{@const active = selectedActivityId === activity.id}
		<button
			onclick={() => select(activity.id)}
			class="flex items-center gap-3 rounded-2xl border-2 border-ink px-6 py-3 text-sm font-black tracking-widest uppercase transition-all duration-300 active:scale-90 {active
				? colorMap[activity.themeColor as ThemeColor] + ' scale-105 -rotate-2 shadow-heavy'
				: 'bg-white text-ink hover:-translate-y-1 hover:shadow-heavy'}"
		>
			{#if activity.icon}
				<span class="text-xl leading-none">{activity.icon}</span>
			{/if}
			<span>{activity.name}</span>
		</button>
	{/each}
</div>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
