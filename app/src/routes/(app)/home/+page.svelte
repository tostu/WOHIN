<script lang="ts">
	import LocationList from '$lib/components/discovery/LocationList.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import type { LocationSearchResult } from '$lib/server/services/discovery';
	import { Sparkles, Search, Bell, MapPin, Compass, Heart, User } from 'lucide-svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { fly, fade } from 'svelte/transition';

	let { data } = $props();

	let selectedActivityId = $state<string | null>(null);
	let selectedActivityName = $state<string>('');
	let locations = $state<LocationSearchResult[]>([]);
	let loading = $state(false);
	let activeTab = $state<'discover' | 'map' | 'saved' | 'profile'>('discover');
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

	function getActivityGradient(theme?: string) {
		switch (theme) {
			case 'matcha':
				return 'pill-matcha';
			case 'peach':
				return 'pill-peach';
			case 'sunny':
				return 'pill-sunny';
			default:
				return 'pill-peach';
		}
	}
</script>

<div class="app-shell">
	<!-- Top Bar -->
	<header class="top-bar">
		<div class="top-bar-row">
			<!-- Brand -->
			<div class="brand-mark">
				<span class="brand-dot"></span>
				<span class="brand-wordmark">wohin</span>
			</div>

			<!-- Actions -->
			<div class="top-actions">
				<button class="icon-btn" onclick={openSearch} aria-label="Search">
					<Search size={19} strokeWidth={2.5} />
				</button>
				<button class="icon-btn notif-btn" aria-label="Notifications">
					<Bell size={19} strokeWidth={2.5} />
					<span class="notif-pip"></span>
				</button>
			</div>
		</div>

		<!-- Expandable Search -->
		{#if searchOpen}
			<div class="search-tray" transition:fly={{ y: -8, duration: 180 }}>
				<div class="search-field">
					<Search size={15} strokeWidth={2} class="text-ink/30" />
					<input
						bind:this={searchEl}
						type="search"
						placeholder="Find a place, vibe, neighbourhood…"
						class="search-input"
						onblur={() => (searchOpen = false)}
					/>
				</div>
			</div>
		{/if}
	</header>

	<!-- Scrollable Body -->
	<main class="scroll-body">
		<!-- Greeting -->
		<section class="greeting px-5 pt-7 pb-1">
			<p class="eyebrow">Berlin · Today</p>
			<h1 class="headline">
				Whatcha <em>wanna</em><br />do?
			</h1>
		</section>

		<!-- Activity Pills -->
		<section class="pt-5 pb-1">
			<p class="eyebrow px-5 mb-3">Catch a vibe</p>
			<div class="pills-track">
				{#each data.activities as activity, i (activity.id)}
					<button
						class="pill {getActivityGradient(activity.themeColor)} {selectedActivityId === activity.id ? 'pill-active' : ''}"
						style="animation-delay: {i * 55}ms"
						onclick={() => handleActivitySelect(activity.id, activity.name)}
					>
						{#if activity.icon}<span class="pill-icon">{activity.icon}</span>{/if}
						<span class="pill-text">{activity.name}</span>
					</button>
				{/each}
			</div>
		</section>

		<!-- Content States -->
		{#if loading}
			<!-- Skeleton -->
			<div class="px-5 pt-8 space-y-3" in:fade>
				<div class="skeleton h-[200px] rounded-3xl"></div>
				<div class="flex gap-3">
					<div class="skeleton h-[120px] rounded-2xl flex-1"></div>
					<div class="skeleton h-[120px] rounded-2xl flex-1" style="opacity:.7"></div>
				</div>
				<div class="skeleton h-[80px] rounded-2xl"></div>
				<div class="skeleton h-[80px] rounded-2xl" style="opacity:.6"></div>
			</div>
		{:else if selectedActivityId && locations.length > 0}
			<!-- Search Results -->
			<section class="pt-6 pb-2" in:fly={{ y: 12, duration: 280 }}>
				<div class="flex items-center gap-2.5 px-5 mb-5">
					<h2 class="section-title">{selectedActivityName}</h2>
					<span class="count-chip">{locations.length}</span>
				</div>
				<div class="px-5">
					<LocationList {locations} />
				</div>
			</section>
		{:else if selectedActivityId && !loading}
			<div class="px-5 pt-6" in:fade>
				<EmptyState />
			</div>
		{:else}
			<!-- Discovery Feed -->

			{#if data.trendingSpots.length > 0}
				<section class="pt-7">
					<div class="section-header px-5 mb-4">
						<h2 class="section-title">Trending</h2>
						<button class="text-link">See all</button>
					</div>

					<!-- Feature card -->
					{#if data.trendingSpots[0]}
						{@const spot = data.trendingSpots[0]}
						<div class="px-5 mb-3">
							<a
								href={localizeHref(`/location/${spot.slug}`)}
								class="feature-card"
								in:fly={{ y: 16, duration: 400 }}
							>
								{#if spot.image || (spot.photos && spot.photos[0])}
									<img
										src={spot.image || spot.photos![0]}
										alt={spot.name}
										class="feature-card-img"
									/>
								{:else}
									<div class="feature-card-fallback">
										<Sparkles size={36} strokeWidth={1.5} />
									</div>
								{/if}
								<div class="feature-card-scrim"></div>
								<div class="feature-card-body">
									{#if spot.activities?.[0]}
										<span class="glass-chip"
											>{spot.activities[0].icon}
											{spot.activities[0].name}</span
										>
									{/if}
									<h3 class="feature-card-name">{spot.name}</h3>
									<p class="feature-card-addr">
										{spot.address?.split(',').slice(0, 2).join(',') || 'Berlin'}
									</p>
								</div>
								<div class="trend-badge">🔥</div>
							</a>
						</div>
					{/if}

					<!-- Mini cards horizontal -->
					<div class="h-scroll-row">
						{#each data.trendingSpots.slice(1) as spot, i (spot.id)}
							<a
								href={localizeHref(`/location/${spot.slug}`)}
								class="mini-card"
								in:fly={{ x: 20, delay: i * 70, duration: 360 }}
							>
								<div class="mini-card-img-wrap">
									{#if spot.image || (spot.photos && spot.photos[0])}
										<img
											src={spot.image || spot.photos![0]}
											alt={spot.name}
											class="mini-card-img"
										/>
									{:else}
										<div class="mini-card-fallback">
											{spot.activities[0]?.icon || '📍'}
										</div>
									{/if}
								</div>
								<div class="mini-card-body">
									{#if spot.activities[0]?.icon}
										<span class="mini-icon">{spot.activities[0].icon}</span>
									{/if}
									<p class="mini-name">{spot.name}</p>
									<p class="mini-addr">{spot.address?.split(',')[0] || 'Berlin'}</p>
								</div>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if data.newArrivals.length > 0}
				<section class="pt-8 pb-2">
					<div class="section-header px-5 mb-4">
						<h2 class="section-title">Just Landed</h2>
						<span class="fresh-tag">New ✨</span>
					</div>
					<div class="flex flex-col gap-2.5 px-5">
						{#each data.newArrivals as arrival, i (arrival.id)}
							<a
								href={localizeHref(`/location/${arrival.slug}`)}
								class="row-card"
								in:fly={{ x: -16, delay: i * 80, duration: 360 }}
							>
								<div class="row-thumb">
									{#if arrival.image || (arrival.photos && arrival.photos[0])}
										<img
											src={arrival.image || arrival.photos![0]}
											alt={arrival.name}
											class="row-thumb-img"
										/>
									{:else}
										<span class="row-thumb-icon"
											>{arrival.activities[0]?.icon || '📍'}</span
										>
									{/if}
								</div>
								<div class="row-info">
									<p class="row-name">{arrival.name}</p>
									<p class="row-meta">
										{arrival.activities[0]?.name || ''}{arrival.activities[0]
											? ' · '
											: ''}{arrival.address?.split(',')[0] || 'Berlin'}
									</p>
								</div>
								<span class="row-new-dot"></span>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<div class="h-8"></div>
		{/if}

		<!-- Nav clearance -->
		<div class="h-28"></div>
	</main>
</div>

<style>
	/* ── App Shell ── */
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100dvh;
		background: var(--color-surface);
		max-width: 430px;
		margin-inline: auto;
		position: relative;
	}

	/* ── Top Bar ── */
	.top-bar {
		position: sticky;
		top: 0;
		z-index: 40;
		background: color-mix(in srgb, var(--color-surface) 90%, transparent);
		backdrop-filter: blur(24px) saturate(180%);
		-webkit-backdrop-filter: blur(24px) saturate(180%);
		border-bottom: 1px solid rgba(49, 46, 129, 0.06);
		padding-top: env(safe-area-inset-top, 0px);
	}

	.top-bar-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 13px 18px;
	}

	/* Brand */
	.brand-mark {
		display: flex;
		align-items: center;
		gap: 7px;
		background: var(--color-ink);
		color: #fff;
		padding: 6px 14px 6px 10px;
		border-radius: 999px;
	}

	.brand-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-primary);
		animation: pulse-soft 2.5s ease-in-out infinite;
	}

	.brand-wordmark {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 900;
		letter-spacing: -0.02em;
	}

	/* Icon buttons */
	.top-actions {
		display: flex;
		gap: 7px;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: rgba(49, 46, 129, 0.07);
		color: var(--color-ink);
		position: relative;
		transition:
			background 0.15s,
			transform 0.1s;
	}

	.icon-btn:active {
		transform: scale(0.9);
		background: rgba(49, 46, 129, 0.14);
	}

	.notif-btn .notif-pip {
		position: absolute;
		top: 7px;
		right: 7px;
		width: 7px;
		height: 7px;
		background: var(--color-primary);
		border-radius: 50%;
		border: 1.5px solid var(--color-surface);
	}

	/* Search tray */
	.search-tray {
		padding: 0 18px 13px;
	}

	.search-field {
		display: flex;
		align-items: center;
		gap: 9px;
		background: #fff;
		border: 1.5px solid rgba(49, 46, 129, 0.11);
		border-radius: 13px;
		padding: 10px 14px;
	}

	.search-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-family: var(--font-body);
		font-size: 14px;
		color: var(--color-ink);
		min-width: 0;
	}

	.search-input::placeholder {
		color: rgba(49, 46, 129, 0.32);
	}

	/* ── Scroll Body ── */
	.scroll-body {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior-y: contain;
	}

	/* ── Greeting ── */
	.eyebrow {
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(49, 46, 129, 0.38);
		margin-bottom: 5px;
	}

	.headline {
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 10vw, 3.2rem);
		font-weight: 900;
		line-height: 1.03;
		letter-spacing: -0.035em;
		color: var(--color-ink);
	}

	.headline em {
		font-style: italic;
		color: var(--color-primary);
	}

	/* ── Pills ── */
	.pills-track {
		display: flex;
		gap: 9px;
		overflow-x: auto;
		padding: 4px 20px 8px;
		scrollbar-width: none;
	}
	.pills-track::-webkit-scrollbar {
		display: none;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 9px 15px;
		border-radius: 999px;
		border: 1.5px solid rgba(49, 46, 129, 0.1);
		background: #fff;
		flex-shrink: 0;
		transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
		animation: pill-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	@keyframes pill-appear {
		from {
			opacity: 0;
			transform: scale(0.82) translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.pill:active {
		transform: scale(0.94);
	}

	.pill-active {
		border-color: transparent;
		box-shadow: 0 4px 18px rgba(244, 114, 182, 0.28);
		transform: scale(1.06);
	}

	.pill-matcha.pill-active {
		background: var(--color-accent);
	}
	.pill-peach.pill-active {
		background: var(--color-secondary);
	}
	.pill-sunny.pill-active {
		background: var(--color-primary);
	}

	.pill-icon {
		font-size: 17px;
		line-height: 1;
	}
	.pill-text {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		white-space: nowrap;
	}

	/* ── Skeleton ── */
	.skeleton {
		background: linear-gradient(
			90deg,
			rgba(49, 46, 129, 0.06) 25%,
			rgba(49, 46, 129, 0.11) 50%,
			rgba(49, 46, 129, 0.06) 75%
		);
		background-size: 200% 100%;
		animation: shimmer 1.6s ease-in-out infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* ── Section ── */
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 21px;
		font-weight: 900;
		letter-spacing: -0.025em;
		color: var(--color-ink);
	}

	.text-link {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-primary);
	}

	.count-chip {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 26px;
		height: 26px;
		padding: 0 7px;
		border-radius: 999px;
		background: var(--color-primary);
		color: var(--color-ink);
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 800;
	}

	/* ── Feature Card ── */
	.feature-card {
		display: block;
		position: relative;
		height: 216px;
		border-radius: 22px;
		overflow: hidden;
		text-decoration: none;
		box-shadow: 0 8px 28px rgba(49, 46, 129, 0.13);
		transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.feature-card:active {
		transform: scale(0.97);
	}

	.feature-card-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.45s ease;
	}

	.feature-card:hover .feature-card-img {
		transform: scale(1.04);
	}

	.feature-card-fallback {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
	}

	.feature-card-scrim {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(31, 28, 90, 0.88) 0%, transparent 52%);
	}

	.feature-card-body {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 14px 16px;
	}

	.glass-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: rgba(255, 255, 255, 0.17);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.95);
		font-family: var(--font-body);
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		padding: 4px 9px;
		border-radius: 999px;
		margin-bottom: 6px;
	}

	.feature-card-name {
		font-family: var(--font-display);
		font-size: 22px;
		font-weight: 900;
		color: #fff;
		letter-spacing: -0.025em;
		line-height: 1.08;
	}

	.feature-card-addr {
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.55);
		margin-top: 3px;
	}

	.trend-badge {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 34px;
		height: 34px;
		background: rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
	}

	/* ── Horizontal Scroll ── */
	.h-scroll-row {
		display: flex;
		gap: 11px;
		overflow-x: auto;
		padding: 4px 20px 8px;
		scrollbar-width: none;
	}
	.h-scroll-row::-webkit-scrollbar {
		display: none;
	}

	.mini-card {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 138px;
		border-radius: 18px;
		overflow: hidden;
		background: #fff;
		text-decoration: none;
		box-shadow: 0 3px 14px rgba(49, 46, 129, 0.08);
		transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.mini-card:active {
		transform: scale(0.94);
	}

	.mini-card-img-wrap {
		height: 96px;
		overflow: hidden;
		position: relative;
	}

	.mini-card-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.mini-card-fallback {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30px;
	}

	.mini-card-body {
		padding: 9px 11px 11px;
	}

	.mini-icon {
		font-size: 13px;
		display: block;
		margin-bottom: 2px;
	}

	.mini-name {
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
		letter-spacing: -0.01em;
		margin: 0 0 2px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mini-addr {
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 500;
		color: rgba(49, 46, 129, 0.4);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* ── Row Cards (New Arrivals) ── */
	.row-card {
		display: flex;
		align-items: center;
		gap: 13px;
		background: #fff;
		border-radius: 18px;
		padding: 11px 14px;
		text-decoration: none;
		box-shadow: 0 2px 10px rgba(49, 46, 129, 0.06);
		transition: transform 0.15s;
	}

	.row-card:active {
		transform: scale(0.97);
	}

	.row-thumb {
		width: 50px;
		height: 50px;
		border-radius: 13px;
		overflow: hidden;
		flex-shrink: 0;
		background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.row-thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.row-thumb-icon {
		font-size: 22px;
	}

	.row-info {
		flex: 1;
		min-width: 0;
	}

	.row-name {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 800;
		color: var(--color-ink);
		letter-spacing: -0.01em;
		margin: 0 0 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.row-meta {
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 500;
		color: rgba(49, 46, 129, 0.42);
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.row-new-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-primary);
		flex-shrink: 0;
	}

	.fresh-tag {
		font-family: var(--font-body);
		font-size: 11px;
		font-weight: 800;
		background: var(--color-accent);
		color: var(--color-ink);
		padding: 4px 10px;
		border-radius: 999px;
	}
</style>
