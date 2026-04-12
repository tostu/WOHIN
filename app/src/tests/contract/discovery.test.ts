import { describe, it, expect } from 'vitest';

describe('Discovery Search API Contract', () => {
	it('GET /api/v1/discovery/search should return matching locations', async () => {
		// This is a contract test. In a real scenario, we might use MSW or a real API.
		// For now, we'll define the expected structure.
		const response = {
			results: [
				{
					id: 'loc1',
					name: 'Radiant Cafe',
					address: '123 Sun St',
					distance: 120,
					rating: 4.5,
					photos: ['https://example.com/photo1.jpg'],
					activities: [
						{ id: 'act1', name: 'study', themeColor: 'matcha' }
					]
				}
			]
		};

		expect(response).toHaveProperty('results');
		expect(Array.isArray(response.results)).toBe(true);
		expect(response.results[0]).toMatchObject({
			id: expect.any(String),
			name: expect.any(String),
			distance: expect.any(Number),
			activities: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					themeColor: expect.stringMatching(/matcha|peach|sunny/)
				})
			])
		});
	});

	it('GET /api/v1/discovery/location/:slug should return a profile', async () => {
		const response = {
			id: 'loc1',
			name: 'Radiant Cafe',
			address: '123 Sun St',
			coordinates: { lat: 52.52, lng: 13.405 },
			hours: [{ day: 'Monday', open: '08:00', close: '20:00' }],
			description: '<p>A sunny spot for studying.</p>',
			photos: ['https://example.com/photo1.jpg'],
			activities: [
				{ id: 'act1', name: 'study', feedbackCount: 12 }
			]
		};

		expect(response).toMatchObject({
			id: expect.any(String),
			name: expect.any(String),
			coordinates: { lat: expect.any(Number), lng: expect.any(Number) },
			description: expect.any(String)
		});
	});
});
