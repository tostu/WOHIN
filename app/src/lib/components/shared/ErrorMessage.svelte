<script lang="ts">
	let {
		title = 'Looks like the Wi-Fi is taking a quick nap 💤',
		message = "Don't worry, even the internet needs its beauty sleep!"
	} = $props();
</script>

<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
	<div class="mb-4 text-6xl">🌪️</div>
	<h3 class="mb-2 font-display text-2xl font-bold text-neutral-800">{title}</h3>
	<p class="max-w-xs text-neutral-600">{message}</p>
	<button
		onclick={() => window.location.reload()}
		class="shadow-ambient mt-8 rounded-full bg-peach px-8 py-3 font-bold text-white transition-transform hover:scale-105 active:scale-95"
	>
		Gently wake it up
	</button>
</div>
