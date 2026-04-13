import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FeedbackService } from '$lib/server/services/feedback';

export const GET: RequestHandler = async ({ params, platform }) => {
	const db = platform?.env?.DB;
	if (!db) {
		return json([]);
	}

	const vibes = await FeedbackService.getVibesForLocation(db, params.id);
	return json(vibes);
};
