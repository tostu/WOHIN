import type { PageServerLoad } from '../../$types';
import { DiscoveryService } from '$lib/server/services/discovery';

export const load: PageServerLoad = async () => {
	const [activities, featured] = await Promise.all([
		DiscoveryService.getActivities(),
		DiscoveryService.getFeaturedLocations(10)
	]);

	return {
		activities,
		newArrivals: featured.slice(0, 3),
		trendingSpots: featured.slice(3, 7)
	};
};
