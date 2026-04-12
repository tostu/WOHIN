<script lang="ts">
	let {
		title = 'This vibe is still undiscovered territory! 🗺️',
		message = 'Mind contributing something cool?'
	} = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
	<div class="mb-4 text-6xl">✨</div>
	<h3 class="mb-2 font-display text-2xl font-bold text-neutral-800">{title}</h3>
	<p class="max-w-xs text-neutral-600">{message}</p>
</div>
