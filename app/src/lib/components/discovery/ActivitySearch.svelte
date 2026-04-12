<script lang="ts">
	import type { Activity } from '$lib/server/services/discovery';
	
	let { activities = [], onSelect = (activityId: string) => {} } = $props();
	
	let selectedActivityId = $state<string | null>(null);

	function select(id: string) {
		selectedActivityId = id;
		onSelect(id);
	}
</script>

<div class="flex flex-wrap gap-2 px-6 py-4 overflow-x-auto no-scrollbar">
	{#each activities as activity}
		<button
			onclick={() => select(activity.id)}
			class="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 shadow-ambient active:scale-95 {selectedActivityId === activity.id ? 'bg-peach text-white' : 'bg-surface-container-lowest text-neutral-700 hover:bg-surface-container-low'}"
		>
			{#if activity.icon}
				<span class="text-lg leading-none">{activity.icon}</span>
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
