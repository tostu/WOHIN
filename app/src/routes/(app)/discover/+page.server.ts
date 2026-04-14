import type { PageServerLoad } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';

export const load: PageServerLoad = async () => {
	const featured = await DiscoveryService.getFeaturedLocations(40);
	return { featured };
};
