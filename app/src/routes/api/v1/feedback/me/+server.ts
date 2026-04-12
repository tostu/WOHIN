import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FeedbackService } from '$lib/server/services/feedback';

export const GET: RequestHandler = async ({ locals, platform }) => {
	const session = locals.session;
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const db = platform?.env?.DB;
	if (!db) {
		throw error(500, 'Database not found');
	}

	const vibes = await FeedbackService.getMyVibes(db, session.userId);

	return json(vibes);
};
