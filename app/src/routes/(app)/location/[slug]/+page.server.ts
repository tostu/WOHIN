import type { PageServerLoad } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';
import { FeedbackService } from '$lib/server/services/feedback';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const location = await DiscoveryService.getLocationBySlug(slug);

	if (!location) {
		throw error(404, 'Location not found');
	}

	return {
		location,
		vibeHistory: []
	};
};
