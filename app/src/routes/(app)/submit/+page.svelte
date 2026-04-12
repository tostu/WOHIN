<script lang="ts">
	import LocationForm from '$lib/components/submissions/LocationForm.svelte';
	
	let submitted = $state(false);

	function handleSuccess() {
		submitted = true;
	}
</script>

<div class="flex min-h-screen flex-col bg-surface p-6 pt-12">
	<header class="mb-12">
		<h1 class="text-6xl font-black font-display text-neutral-800 leading-[0.9] mb-4">
			Share a <br /> new <br /> <span class="text-peach italic">discovery.</span>
		</h1>
		<p class="text-lg text-neutral-500 font-medium max-w-[280px]">Help the community grow by adding your favorite spots.</p>
	</header>

	{#if submitted}
		<div class="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
			<div class="mb-6 text-8xl">🕊️</div>
			<h2 class="mb-4 text-3xl font-black font-display text-neutral-800">Sent to the curators!</h2>
			<p class="mb-10 text-neutral-500 max-w-xs">We'll review your spot and add it to the map soon. Thanks for being awesome! ✨</p>
			<button 
				onclick={() => submitted = false}
				class="rounded-full bg-surface-container-high px-8 py-3 font-bold text-neutral-700"
			>
				Submit another
			</button>
		</div>
	{:else}
		<section class="rounded-[3rem] bg-surface-container-lowest p-8 shadow-ambient mb-20">
			<LocationForm onSuccess={handleSuccess} />
		</section>
	{/if}
</div>
