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
		<label for="report-desc" class="block mb-2 text-sm font-bold text-neutral-500 uppercase tracking-widest">What's wrong?</label>
		<textarea
			id="report-desc"
			bind:value={description}
			required
			placeholder="Wrong address, closed, or something else?"
			class="w-full h-32 rounded-[1.5rem] bg-surface-container-low px-6 py-4 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-peach shadow-sm resize-none"
		></textarea>
	</div>

	<button
		type="submit"
		disabled={submitting}
		class="w-full rounded-full bg-neutral-800 py-5 text-lg font-black text-white shadow-ambient transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
	>
		{submitting ? 'Reporting... 🕵️' : 'Send Correction'}
	</button>
</form>
