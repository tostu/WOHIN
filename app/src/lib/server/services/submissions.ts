import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/private';

// We need a write client for submissions
const writeClient = createClient({
	projectId: env.SANITY_PROJECT_ID || '1ffjhas2',
	dataset: env.SANITY_DATASET || 'production',
	useCdn: false,
	apiVersion: '2024-03-11',
	token: env.SANITY_WRITE_TOKEN, // Required for mutations
	ignoreBrowserTokenWarning: true
});

export class SubmissionsService {
	static async submitLocation(data: any) {
		return writeClient.create({
			_type: 'location',
			...data,
			status: 'pending'
		});
	}

	static async reportProblem(data: { locationId: string; description: string }) {
		// In a real implementation, we might have a 'report' schema
		// For now, we'll just log or create a dummy doc if schema exists
		return writeClient.create({
			_type: 'report',
			...data,
			createdAt: new Date().toISOString()
		});
	}
}
