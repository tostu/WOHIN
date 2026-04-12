import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SubmissionsService } from '$lib/server/services/submissions';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();

	if (!data.name) {
		throw error(400, 'Missing required fields');
	}

	try {
		const result = await SubmissionsService.submitLocation(data);
		return json(result);
	} catch (e) {
		console.error('Submission failed:', e);
		throw error(500, 'Failed to submit location');
	}
};
