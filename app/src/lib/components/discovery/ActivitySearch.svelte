<script lang="ts">
	import type { Activity } from '$lib/server/services/discovery';

	let { activities = [], onSelect = (activityId: string) => {} } = $props();

	let selectedActivityId = $state<string | null>(null);

	function select(id: string) {
		selectedActivityId = id;
		onSelect(id);
	}

	const colorMap = {
		matcha: 'bg-sun-matcha hover:bg-sun-matcha/80',
		peach: 'bg-sun-peach hover:bg-sun-peach/80',
		sunny: 'bg-sun-golden hover:bg-sun-golden/80'
	};

	type ThemeColor = keyof typeof colorMap;
	</script>

	<div class="no-scrollbar flex flex-wrap gap-4 overflow-x-auto px-6 py-6">
	{#each activities as activity}
		{@const active = selectedActivityId === activity.id}
		<button
			onclick={() => select(activity.id)}
			class="flex items-center gap-3 rounded-2xl border-2 border-sun-ink px-6 py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 active:scale-90 {active
				? colorMap[activity.themeColor as ThemeColor] + ' scale-105 -rotate-2 shadow-heavy'
				: 'bg-white text-sun-ink hover:-translate-y-1 hover:shadow-heavy'}"
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
