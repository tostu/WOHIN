<script lang="ts">
	interface Props {
		intensity?: 'subtle' | 'bold';
	}
	let { intensity = 'bold' }: Props = $props();

	const opacities = $derived(
		intensity === 'bold'
			? { a: 'opacity-60', b: 'opacity-50', c: 'opacity-40' }
			: { a: 'opacity-40', b: 'opacity-40', c: 'opacity-30' }
	);
</script>

<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
	<div
		class="animate-blob absolute top-[-20%] left-[-10%] h-[50vw] w-[50vw] max-h-[700px] max-w-[700px] rounded-full bg-sunny mix-blend-multiply blur-[100px] {opacities.a}"
	></div>
	<div
		class="animate-blob animation-delay-2000 absolute top-[20%] right-[-10%] h-[40vw] w-[40vw] max-h-[600px] max-w-[600px] rounded-full bg-peach mix-blend-multiply blur-[120px] {opacities.b}"
	></div>
	<div
		class="animate-blob animation-delay-4000 absolute bottom-[-10%] left-[10%] h-[60vw] w-[60vw] max-h-[800px] max-w-[800px] rounded-full bg-matcha mix-blend-multiply blur-[150px] {opacities.c}"
	></div>
</div>
