import type { PageServerLoad } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const location = await DiscoveryService.getLocationBySlug(slug);

	if (!location) {
		throw error(404, 'Location not found');
	}

	return {
		location
	};
};
