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
  coordinates?: { lat: number; lng: number };
  distance?: number;
  rating?: number;
  image?: string;
  photos?: string[];
  activities: Activity[];
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
      q?: string;
      activityId?: string;
      userLat?: number;
      userLng?: number;
    },
  ): Promise<LocationSearchResult[]> {
    const client = getSanityClient(env);
    const { q, activityId, userLat, userLng } = params;

    const filters = ['_type == "location"', 'status == "approved"'];
    const queryParams: Record<string, any> = {};

    if (activityId) {
      filters.push("references($activityId)");
      queryParams.activityId = activityId;
    }

    if (q) {
      filters.push("(name match $q || address match $q)");
      queryParams.q = `${q}*`;
    }

    const query = `*[${filters.join(" && ")}]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			coordinates,
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

    let locations: LocationSearchResult[] = await client.fetch(query, queryParams);

    if (userLat != null && userLng != null) {
      locations = locations.map(loc => {
        if (loc.coordinates) {
          const d = calculateDistance(userLat, userLng, loc.coordinates.lat, loc.coordinates.lng);
          return { ...loc, distance: d };
        }
        return loc;
      }).sort((a, b) => (a.distance || 999999) - (b.distance || 999999));
    }

    return locations;
  }

  static async getFeaturedLocations(
    env: CloudflareBindings,
    limit: number = 10,
    userLat?: number,
    userLng?: number,
  ): Promise<LocationSearchResult[]> {
    const client = getSanityClient(env);
    const query = `*[_type == "location" && status == "approved"] | order(_createdAt desc)[0...$limit]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			coordinates,
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

    let locations: LocationSearchResult[] = await client.fetch(query, { limit });

    if (userLat != null && userLng != null) {
        locations = locations.map(loc => {
            if (loc.coordinates) {
                const d = calculateDistance(userLat, userLng, loc.coordinates.lat, loc.coordinates.lng);
                return { ...loc, distance: d };
            }
            return loc;
        }).sort((a, b) => (a.distance || 999999) - (b.distance || 999999));
    }

    return locations;
  }

  static async getLocationBySlug(env: CloudflareBindings, slug: string) {
    const client = getSanityClient(env);
    const query = `*[_type == "location" && slug.current == $slug][0]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			coordinates,
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
