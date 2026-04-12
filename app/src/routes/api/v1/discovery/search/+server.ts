import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DiscoveryService } from '$lib/server/services/discovery';

export const GET: RequestHandler = async ({ url }) => {
	const activityId = url.searchParams.get('activityId');

	if (!activityId) {
		return json({ error: 'Missing activityId' }, { status: 400 });
	}

	const results = await DiscoveryService.searchLocations({
		activityId,
		lat: parseFloat(url.searchParams.get('lat') || ''),
		lng: parseFloat(url.searchParams.get('lng') || ''),
		radius: parseInt(url.searchParams.get('radius') || '5000')
	});

	return json({ results });
};
