import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { FeedbackService } from '$lib/server/services/feedback';

export const POST: RequestHandler = async ({ request, locals, platform }) => {
	const session = locals.session;
	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const db = platform?.env?.DB;
	if (!db) {
		throw error(500, 'Database not found');
	}

	const { locationId, activityId, vibe } = await request.json();

	if (!locationId || !activityId || !vibe) {
		throw error(400, 'Missing required fields');
	}

	const result = await FeedbackService.submitVibe(db, {
		userId: session.userId,
		locationId,
		activityId,
		vibe
	});

	return json(result[0]);
};
