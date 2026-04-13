import { sanityClient } from '../sanity';

export interface Activity {
	id: string;
	name: string;
	slug: string;
	themeColor: 'matcha' | 'peach' | 'sunny';
	icon?: string;
}

export interface LocationSearchResult {
	id: string;
	name: string;
	slug: string;
	address?: string;
	distance?: number;
	rating?: number;
	image?: string;
	photos?: string[];
	activities: Activity[];
}

export class DiscoveryService {
	static async getActivities(): Promise<Activity[]> {
		return sanityClient.fetch(`*[_type == "activity"]{
			"id": _id,
			name,
			"slug": slug.current,
			themeColor,
			icon
		}`);
	}

	static async searchLocations(params: {
		activityId: string;
		lat?: number;
		lng?: number;
		radius?: number;
	}): Promise<LocationSearchResult[]> {
		const { activityId } = params;

		const query = `*[_type == "location" && references($activityId) && status == "approved"]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			"image": image.asset->url,
			"photos": photos[].asset->url,
			"activities": activities[]->{
				"id": _id,
				name,
				"slug": slug.current,
				themeColor,
				icon
			}
		}`;

		const locations = await sanityClient.fetch(query, { activityId });

		// Distance calculation logic could be added here if coordinates are provided
		// For now, returning Sanity results.
		return locations.map((loc: any) => ({
			...loc,
			distance: 0, // Placeholder
			rating: 4.5 // Placeholder until feedback system is integrated
		}));
	}

	static async getFeaturedLocations(limit: number = 10): Promise<LocationSearchResult[]> {
		const query = `*[_type == "location" && status == "approved"] | order(_createdAt desc)[0...$limit]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			"image": image.asset->url,
			"photos": photos[].asset->url,
			"activities": activities[]->{
				"id": _id,
				name,
				"slug": slug.current,
				themeColor,
				icon
			}
		}`;

		const locations = await sanityClient.fetch(query, { limit });

		return locations.map((loc: any) => ({
			...loc,
			distance: 0,
			rating: 4.8 // Placeholder
		}));
	}

	static async getLocationBySlug(slug: string) {
		const query = `*[_type == "location" && slug.current == $slug][0]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			coordinates,
			hours,
			description,
			"image": image.asset->url,
			"photos": photos[].asset->url,
			"activities": activities[]->{
				"id": _id,
				name,
				"slug": slug.current,
				themeColor,
				icon
			}
		}`;

		return sanityClient.fetch(query, { slug });
	}
}
