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
				name = ''; address = ''; description = '';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<form onsubmit={submit} class="space-y-6">
	<div>
		<label for="name" class="block mb-2 text-sm font-bold text-neutral-500 uppercase tracking-widest">Spot Name</label>
		<input
			id="name"
			bind:value={name}
			required
			placeholder="e.g., The Cozy Corner"
			class="w-full rounded-[1.5rem] bg-surface-container-low px-6 py-4 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-peach shadow-sm"
		/>
	</div>
	
	<div>
		<label for="address" class="block mb-2 text-sm font-bold text-neutral-500 uppercase tracking-widest">Where is it?</label>
		<input
			id="address"
			bind:value={address}
			placeholder="Street, City"
			class="w-full rounded-[1.5rem] bg-surface-container-low px-6 py-4 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-peach shadow-sm"
		/>
	</div>
	
	<div>
		<label for="description" class="block mb-2 text-sm font-bold text-neutral-500 uppercase tracking-widest">The Vibe</label>
		<textarea
			id="description"
			bind:value={description}
			placeholder="Tell us why it's cool! ✨"
			class="w-full h-32 rounded-[1.5rem] bg-surface-container-low px-6 py-4 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-peach shadow-sm resize-none"
		></textarea>
	</div>

	<button
		type="submit"
		disabled={submitting}
		class="w-full rounded-full bg-peach py-5 text-lg font-black text-white shadow-ambient transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
	>
		{submitting ? 'Sending to the curators... 🕊️' : 'Share the Magic! ✨'}
	</button>
</form>
