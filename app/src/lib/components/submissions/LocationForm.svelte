<script lang="ts">
	let { onSuccess = () => {} } = $props();

	let name = $state('');
	let address = $state('');
	let description = $state('');
	let submitting = $state(false);

	async function submit() {
		submitting = true;

		try {
			const response = await fetch('/api/v1/submissions/location', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, address, description })
			});

			if (response.ok) {
				onSuccess();
				name = '';
				address = '';
				description = '';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={submit} class="space-y-6">
	<div>
		<label
			for="name"
			class="mb-2 block text-sm font-bold tracking-widest text-neutral-500 uppercase"
			>Spot Name</label
		>
		<input
			id="name"
			bind:value={name}
			required
			placeholder="e.g., The Cozy Corner"
			class="bg-surface-container-low w-full rounded-[1.5rem] px-6 py-4 text-neutral-800 placeholder-neutral-400 shadow-sm focus:ring-2 focus:ring-peach focus:outline-none"
		/>
	</div>

	<div>
		<label
			for="address"
			class="mb-2 block text-sm font-bold tracking-widest text-neutral-500 uppercase"
			>Where is it?</label
		>
		<input
			id="address"
			bind:value={address}
			placeholder="Street, City"
			class="bg-surface-container-low w-full rounded-[1.5rem] px-6 py-4 text-neutral-800 placeholder-neutral-400 shadow-sm focus:ring-2 focus:ring-peach focus:outline-none"
		/>
	</div>

	<div>
		<label
			for="description"
			class="mb-2 block text-sm font-bold tracking-widest text-neutral-500 uppercase"
			>The Vibe</label
		>
		<textarea
			id="description"
			bind:value={description}
			placeholder="Tell us why it's cool! ✨"
			class="bg-surface-container-low h-32 w-full resize-none rounded-[1.5rem] px-6 py-4 text-neutral-800 placeholder-neutral-400 shadow-sm focus:ring-2 focus:ring-peach focus:outline-none"
		></textarea>
	</div>

	<button
		type="submit"
		disabled={submitting}
		class="shadow-ambient w-full rounded-full bg-peach py-5 text-lg font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
	>
		{submitting ? 'Sending to the curators... 🕊️' : 'Share the Magic! ✨'}
	</button>
</form>
