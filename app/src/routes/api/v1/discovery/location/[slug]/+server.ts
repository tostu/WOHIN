import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	if (!slug) {
		throw error(400, 'Missing slug');
	}

	const location = await DiscoveryService.getLocationBySlug(slug);

	if (!location) {
		throw error(404, 'Location not found');
	}

	return json(location);
};
