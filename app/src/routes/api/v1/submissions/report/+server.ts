import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SubmissionsService } from '$lib/server/services/submissions';

export const POST: RequestHandler = async ({ request }) => {
	const { locationId, description } = await request.json();

	if (!locationId || !description) {
		throw error(400, 'Missing required fields');
	}

	try {
		const result = await SubmissionsService.reportProblem({ locationId, description });
		return json(result);
	} catch (e) {
		console.error('Report failed:', e);
		throw error(500, 'Failed to submit report');
	}
};
