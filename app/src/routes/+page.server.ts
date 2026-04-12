import type { PageServerLoad } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';

export const load: PageServerLoad = async () => {
	const activities = await DiscoveryService.getActivities();

	return {
		activities
	};
};
