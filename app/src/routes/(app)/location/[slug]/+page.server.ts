import type { PageServerLoad } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';
import { FeedbackService } from '$lib/server/services/feedback';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform }) => {
	const { slug } = params;
	const location = await DiscoveryService.getLocationBySlug(slug);

	if (!location) {
		throw error(404, 'Location not found');
	}

	const db = platform?.env?.DB;
	let vibeHistory: any[] = [];
	if (db) {
		try {
			vibeHistory = await FeedbackService.getVibesForLocation(db, location.id);
		} catch (e) {
			console.error('Failed to fetch vibe history:', e);
		}
	}

	return {
		location,
		vibeHistory
	};
};
