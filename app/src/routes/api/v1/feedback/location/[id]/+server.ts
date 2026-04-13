import { json } from '@sveltejs/kit';
import { FeedbackService } from '$lib/server/services/feedback';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const { id } = params;
	const db = platform?.env?.DB;

	if (!db) {
		console.warn('DB not found in platform context, returning empty vibe history');
		return json([]);
	}

	try {
		const vibes = await FeedbackService.getVibesForLocation(db, id);
		return json(vibes);
	} catch (error) {
		console.error('Error fetching vibes for location:', error);
		return json({ error: 'Failed to fetch vibes' }, { status: 500 });
	}
};
