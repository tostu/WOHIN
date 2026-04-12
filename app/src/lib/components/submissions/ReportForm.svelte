<script lang="ts">
	let { locationId = '', onSuccess = () => {} } = $props();

	let description = $state('');
	let submitting = $state(false);

	async function submit() {
		submitting = true;

		try {
			const response = await fetch('/api/v1/submissions/report', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ locationId, description })
			});

			if (response.ok) {
				onSuccess();
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
			for="report-desc"
			class="mb-2 block text-sm font-bold tracking-widest text-neutral-500 uppercase"
			>What's wrong?</label
		>
		<textarea
			id="report-desc"
			bind:value={description}
			required
			placeholder="Wrong address, closed, or something else?"
			class="bg-surface-container-low focus:ring-peach h-32 w-full resize-none rounded-[1.5rem] px-6 py-4 text-neutral-800 placeholder-neutral-400 shadow-sm focus:ring-2 focus:outline-none"
		></textarea>
	</div>

	<button
		type="submit"
		disabled={submitting}
		class="shadow-ambient w-full rounded-full bg-neutral-800 py-5 text-lg font-black text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
	>
		{submitting ? 'Reporting... 🕵️' : 'Send Correction'}
	</button>
</form>
