<script lang="ts">
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { Sparkles, Search, Bell } from 'lucide-svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();

	let selectedActivityId = $state<string | null>(null);
	let selectedActivityName = $state<string>('');
	let locations = $state<LocationSearchResult[]>([]);
	let loading = $state(false);
	let searchOpen = $state(false);
	let searchEl = $state<HTMLInputElement | null>(null);

	async function handleActivitySelect(activityId: string, activityName: string) {
		if (selectedActivityId === activityId) {
			selectedActivityId = null;
			selectedActivityName = '';
			locations = [];
			return;
		}

		selectedActivityId = activityId;
		selectedActivityName = activityName;
		loading = true;

		try {
			const response = await fetch(`/api/v1/discovery/search?activityId=${activityId}`);
			const resData = await response.json();
			locations = resData.results || [];
		} catch (e) {
			console.error('Search failed:', e);
			locations = [];
		} finally {
			loading = false;
		}
	}

	function openSearch() {
		searchOpen = true;
		setTimeout(() => searchEl?.focus(), 50);
	}

	function getActivityColor(theme?: string) {
		switch (theme) {
			case 'matcha':
				return 'bg-[#A8E6CF]';
			case 'peach':
				return 'bg-[#FFB7B2]';
			case 'sunny':
				return 'bg-[#FFD97D]';
			default:
				return 'bg-[#FFD97D]';
		}
	}
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;0,800;1,400&display=swap" rel="stylesheet">
</svelte:head>

<!-- Abstract tonal background blobs -->
<div class="fixed top-[-10%] left-[-20%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[#FFD97D] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 z-0 animate-blob pointer-events-none"></div>
<div class="fixed top-[30%] right-[-20%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[#FFB7B2] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 z-0 animate-blob animation-delay-2000 pointer-events-none"></div>
<div class="fixed bottom-[-10%] left-[10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[#A8E6CF] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 z-0 animate-blob animation-delay-4000 pointer-events-none"></div>

<div class="min-h-screen bg-[#fefcf4]/80 text-[#2c2b29] font-['Be_Vietnam_Pro',sans-serif] relative z-10 selection:bg-[#FFD97D] selection:text-black">
	<div class="max-w-2xl mx-auto min-h-screen bg-white/40 backdrop-blur-3xl md:border-x md:border-[#2c2b29]/5 shadow-2xl relative flex flex-col">
		
		<!-- Top Bar -->
		<header class="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-[#2c2b29]/5 pt-[env(safe-area-inset-top,0px)]">
			<div class="flex items-center justify-between px-6 py-4">
				<!-- Brand -->
				<div class="flex items-center gap-2 bg-[#2c2b29] text-[#fefcf4] px-4 py-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
					<span class="w-2 h-2 rounded-full bg-[#FFD97D] animate-pulse"></span>
					<span class="font-['Plus_Jakarta_Sans',sans-serif] font-black text-sm tracking-tight">wohin.</span>
				</div>

				<!-- Actions -->
				<div class="flex gap-3">
					<button class="w-10 h-10 rounded-full bg-[#2c2b29]/5 flex items-center justify-center text-[#2c2b29] hover:bg-[#2c2b29]/10 hover:scale-95 transition-all" onclick={openSearch} aria-label="Search">
						<Search size={20} strokeWidth={2.5} />
					</button>
					<button class="w-10 h-10 rounded-full bg-[#2c2b29]/5 flex items-center justify-center text-[#2c2b29] hover:bg-[#2c2b29]/10 hover:scale-95 transition-all relative" aria-label="Notifications">
						<Bell size={20} strokeWidth={2.5} />
						<span class="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FFB7B2] rounded-full border-2 border-[#fefcf4]"></span>
					</button>
				</div>
			</div>

			<!-- Expandable Search -->
			{#if searchOpen}
				<div class="px-6 pb-4" transition:fly={{ y: -10, duration: 200 }}>
					<div class="flex items-center gap-3 bg-white border-2 border-[#2c2b29]/10 rounded-2xl px-4 py-3 shadow-inner">
						<Search size={18} strokeWidth={2.5} class="text-[#2c2b29]/40" />
						<input
							bind:this={searchEl}
							type="search"
							placeholder="Find a place, vibe, neighbourhood…"
							class="flex-1 bg-transparent border-none outline-none font-['Be_Vietnam_Pro',sans-serif] text-sm text-[#2c2b29] placeholder:text-[#2c2b29]/40"
							onblur={() => (searchOpen = false)}
						/>
					</div>
				</div>
			{/if}
		</header>

		<!-- Scrollable Body -->
		<main class="flex-1 overflow-y-auto overflow-x-hidden pb-28">
			<!-- Greeting -->
			<section class="px-6 pt-10 pb-4">
				<p class="text-xs font-bold tracking-widest uppercase text-[#8b8a87] mb-2">Berlin · Today</p>
				<h1 class="text-5xl md:text-6xl font-black leading-[1.05] tracking-tighter text-[#2c2b29] font-['Plus_Jakarta_Sans',sans-serif]">
					Whatcha <br/>
					<span class="relative inline-block">
						<span class="relative z-10 italic">wanna</span>
						<span class="absolute bottom-1 left-0 w-full h-3 bg-[#FFD97D] -z-10 rounded-full opacity-80 transform rotate-1"></span>
					</span>
					do?
				</h1>
			</section>

			<!-- Activity Pills -->
			<section class="pt-4 pb-6">
				<p class="text-xs font-bold tracking-widest uppercase text-[#8b8a87] px-6 mb-4">Catch a vibe</p>
				<div class="flex gap-3 overflow-x-auto px-6 pb-4 -mx-6 scrollbar-hide snap-x" style="scrollbar-width: none;">
					{#each data.activities as activity, i (activity.id)}
						<button
							class="snap-start flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all duration-300 transform active:scale-95 {selectedActivityId === activity.id ? `${getActivityColor(activity.themeColor)} border-transparent shadow-[0_8px_20px_rgba(0,0,0,0.1)] scale-105` : 'bg-white border-[#2c2b29]/10 hover:border-[#2c2b29]/30'}"
							style="animation: slideUp 0.4s ease-out {i * 0.05}s both;"
							onclick={() => handleActivitySelect(activity.id, activity.name)}
						>
							{#if activity.icon}<span class="text-lg">{activity.icon}</span>{/if}
							<span class="font-bold text-sm tracking-wide">{activity.name}</span>
						</button>
					{/each}
				</div>
			</section>

			<!-- Content States -->
			{#if loading}
				<!-- Skeleton -->
				<div class="px-6 pt-6 space-y-4" in:fade>
					<div class="h-[220px] rounded-[2rem] bg-gradient-to-r from-[#2c2b29]/5 via-[#2c2b29]/10 to-[#2c2b29]/5 animate-pulse bg-[length:200%_100%]"></div>
					<div class="flex gap-4">
						<div class="h-[140px] rounded-3xl bg-[#2c2b29]/5 flex-1 animate-pulse delay-100"></div>
						<div class="h-[140px] rounded-3xl bg-[#2c2b29]/5 flex-1 animate-pulse delay-200"></div>
					</div>
				</div>
			{:else if selectedActivityId && locations.length > 0}
				<!-- Search Results -->
				<section class="pt-6 pb-4" in:fly={{ y: 20, duration: 400 }}>
					<div class="flex items-center gap-3 px-6 mb-6">
						<h2 class="text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">{selectedActivityName}</h2>
						<span class="bg-[#2c2b29] text-[#fefcf4] px-3 py-1 rounded-full text-xs font-bold">{locations.length}</span>
					</div>
					<div class="px-6">
						<LocationList {locations} />
					</div>
				</section>
			{:else if selectedActivityId && !loading}
				<div class="px-6 pt-8" in:fade>
					<EmptyState />
				</div>
			{:else}
				<!-- Discovery Feed -->

				{#if data.trendingSpots.length > 0}
					<section class="pt-8">
						<div class="flex items-center justify-between px-6 mb-6">
							<h2 class="text-2xl md:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Trending</h2>
							<button class="text-sm font-bold text-[#8b8a87] hover:text-[#2c2b29] transition-colors">See all</button>
						</div>

						<!-- Feature card -->
						{#if data.trendingSpots[0]}
							{@const spot = data.trendingSpots[0]}
							<div class="px-6 mb-6">
								<a
									href={localizeHref(`/location/${spot.slug}`)}
									class="group block relative h-[280px] rounded-[2.5rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
									in:fly={{ y: 20, duration: 500 }}
								>
									{#if spot.image || (spot.photos && spot.photos[0])}
										<img
											src={spot.image || spot.photos![0]}
											alt={spot.name}
											class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
										/>
									{:else}
										<div class="absolute inset-0 bg-gradient-to-br from-[#FFB7B2] to-[#FFD97D] flex items-center justify-center">
											<Sparkles size={48} strokeWidth={1.5} class="text-white/50" />
										</div>
									{/if}
									<div class="absolute inset-0 bg-gradient-to-t from-[#2c2b29]/90 via-[#2c2b29]/40 to-transparent"></div>
									
									<div class="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-xl shadow-lg border border-white/30">
										🔥
									</div>

									<div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
										{#if spot.activities?.[0]}
											<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-wider uppercase mb-3">
												{spot.activities[0].icon} {spot.activities[0].name}
											</span>
										{/if}
										<h3 class="text-3xl font-black text-white leading-none tracking-tight font-['Plus_Jakarta_Sans',sans-serif] mb-2">{spot.name}</h3>
										<p class="text-white/70 text-sm font-medium">
											{spot.address?.split(',').slice(0, 2).join(',') || 'Berlin'}
										</p>
									</div>
								</a>
							</div>
						{/if}

						<!-- Mini cards horizontal -->
						<div class="flex gap-4 overflow-x-auto px-6 pb-8 -mx-6 scrollbar-hide snap-x" style="scrollbar-width: none;">
							{#each data.trendingSpots.slice(1) as spot, i (spot.id)}
								<a
									href={localizeHref(`/location/${spot.slug}`)}
									class="snap-start flex-shrink-0 w-[160px] md:w-[180px] bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] active:scale-95"
									in:fly={{ x: 20, delay: i * 100, duration: 400 }}
								>
									<div class="h-[120px] relative overflow-hidden">
										{#if spot.image || (spot.photos && spot.photos[0])}
											<img
												src={spot.image || spot.photos![0]}
												alt={spot.name}
												class="w-full h-full object-cover"
											/>
										{:else}
											<div class="w-full h-full bg-gradient-to-br from-[#A8E6CF] to-[#FFD97D] flex items-center justify-center text-4xl">
												{spot.activities[0]?.icon || '📍'}
											</div>
										{/if}
									</div>
									<div class="p-4">
										{#if spot.activities[0]?.icon}
											<span class="block text-xl mb-2">{spot.activities[0].icon}</span>
										{/if}
										<p class="font-black text-[15px] leading-tight text-[#2c2b29] font-['Plus_Jakarta_Sans',sans-serif] mb-1 truncate">{spot.name}</p>
										<p class="text-[#8b8a87] text-xs font-medium truncate">{spot.address?.split(',')[0] || 'Berlin'}</p>
									</div>
								</a>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.newArrivals.length > 0}
					<section class="pt-6 pb-6">
						<div class="flex items-center gap-3 px-6 mb-6">
							<h2 class="text-2xl md:text-3xl font-black tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Just Landed</h2>
							<span class="bg-[#A8E6CF] text-[#2c2b29] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">New ✨</span>
						</div>
						<div class="flex flex-col gap-4 px-6">
							{#each data.newArrivals as arrival, i (arrival.id)}
								<a
									href={localizeHref(`/location/${arrival.slug}`)}
									class="group flex items-center gap-4 bg-white/60 backdrop-blur-lg border border-white p-3 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-95"
									in:fly={{ x: -20, delay: i * 100, duration: 400 }}
								>
									<div class="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#FFB7B2] to-[#FFD97D] flex items-center justify-center">
										{#if arrival.image || (arrival.photos && arrival.photos[0])}
											<img
												src={arrival.image || arrival.photos![0]}
												alt={arrival.name}
												class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
											/>
										{:else}
											<span class="text-2xl">{arrival.activities[0]?.icon || '📍'}</span>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<p class="font-black text-[16px] text-[#2c2b29] font-['Plus_Jakarta_Sans',sans-serif] truncate mb-1">{arrival.name}</p>
										<p class="text-[#8b8a87] text-xs font-medium truncate">
											{arrival.activities[0]?.name || ''}{arrival.activities[0] ? ' · ' : ''}{arrival.address?.split(',')[0] || 'Berlin'}
										</p>
									</div>
									<div class="w-10 h-10 rounded-full bg-[#fefcf4] flex items-center justify-center text-[#2c2b29] shadow-sm mr-1 group-hover:bg-[#FFD97D] transition-colors">
										<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
										</svg>
									</div>
								</a>
							{/each}
						</div>
					</section>
				{/if}
			{/if}
		</main>
	</div>
</div>

<style>
	:global(body) {
		background-color: #fefcf4;
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	@keyframes blob {
		0% { transform: translate(0px, 0px) scale(1); }
		33% { transform: translate(30px, -50px) scale(1.1); }
		66% { transform: translate(-20px, 20px) scale(0.9); }
		100% { transform: translate(0px, 0px) scale(1); }
	}

	.animate-blob {
		animation: blob 15s infinite alternate;
	}

	.animation-delay-2000 {
		animation-delay: 2s;
	}

	.animation-delay-4000 {
		animation-delay: 4s;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
