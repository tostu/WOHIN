import { getSanityClient } from "./sanity";

export interface Activity {
  id: string;
  name: string;
  slug: string;
  themeColor: "matcha" | "peach" | "sunny";
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
  static async getActivities(env: CloudflareBindings): Promise<Activity[]> {
    const client = getSanityClient(env);
    return client.fetch(`*[_type == "activity"]{
			"id": _id,
			name,
			"slug": slug.current,
			themeColor,
			icon
		}`);
  }

  static async searchLocations(
    env: CloudflareBindings,
    params: {
      activityId: string;
      lat?: number;
      lng?: number;
      radius?: number;
    },
  ): Promise<LocationSearchResult[]> {
    const client = getSanityClient(env);
    const { activityId } = params;

    const query = `*[_type == "location" && references($activityId) && status == "approved"]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			"image": image.asset->url + "?w=800&q=80&auto=format",
			"photos": photos[].asset->url + "?w=800&q=80&auto=format",
			"activities": activities[]->{
				"id": _id,
				name,
				"slug": slug.current,
				themeColor,
				icon
			}
		}`;

    const locations = await client.fetch(query, { activityId });

    return locations.map((loc: any) => ({
      ...loc,
      distance: 0,
      rating: 4.5,
    }));
  }

  static async getFeaturedLocations(
    env: CloudflareBindings,
    limit: number = 10,
  ): Promise<LocationSearchResult[]> {
    const client = getSanityClient(env);
    const query = `*[_type == "location" && status == "approved"] | order(_createdAt desc)[0...$limit]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			"image": image.asset->url + "?w=800&q=80&auto=format",
			"photos": photos[].asset->url + "?w=800&q=80&auto=format",
			"activities": activities[]->{
				"id": _id,
				name,
				"slug": slug.current,
				themeColor,
				icon
			}
		}`;

    const locations = await client.fetch(query, { limit });

    return locations.map((loc: any) => ({
      ...loc,
      distance: 0,
      rating: 4.8,
    }));
  }

  static async getLocationBySlug(env: CloudflareBindings, slug: string) {
    const client = getSanityClient(env);
    const query = `*[_type == "location" && slug.current == $slug][0]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			coordinates,
			hours,
			description,
			"image": image.asset->url + "?w=1200&q=85&auto=format",
			"photos": photos[].asset->url + "?w=1200&q=85&auto=format",
			"activities": activities[]->{
				"id": _id,
				name,
				"slug": slug.current,
				themeColor,
				icon
			}
		}`;

    return client.fetch(query, { slug });
  }
}
