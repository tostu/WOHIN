<script lang="ts">
	let { title = "Looks like the Wi-Fi is taking a quick nap 💤", message = "Don't worry, even the internet needs its beauty sleep!" } = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 px-6 text-center">
	<div class="mb-4 text-6xl">🌪️</div>
	<h3 class="mb-2 text-2xl font-bold font-display text-neutral-800">{title}</h3>
	<p class="text-neutral-600 max-w-xs">{message}</p>
	<button
		onclick={() => window.location.reload()}
		class="mt-8 rounded-full bg-peach px-8 py-3 font-bold text-white shadow-ambient transition-transform hover:scale-105 active:scale-95"
	>
		Gently wake it up
	</button>
</div>
