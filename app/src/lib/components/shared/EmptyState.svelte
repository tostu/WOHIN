<script lang="ts">
	let { title = "This vibe is still undiscovered territory! 🗺️", message = "Mind contributing something cool?" } = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-6 text-center">
	<div class="mb-4 text-6xl">✨</div>
	<h3 class="mb-2 text-2xl font-bold font-display text-neutral-800">{title}</h3>
	<p class="text-neutral-600 max-w-xs">{message}</p>
</div>
