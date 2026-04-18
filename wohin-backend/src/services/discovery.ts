import { getSanityClient } from "./sanity";
import { FeedbackService } from "./feedback";

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
  hours?: string;
  coordinates?: { lat: number; lng: number };
  distance?: number;
  rating?: number;
  image?: string;
  photos?: string[];
  activities: Activity[];
  vibeCounts?: Record<string, number>;
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
    db: any,
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
			hours,
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

    // Enrich with Vibe Feedback
    try {
      if (locations.length > 0) {
        const summaries = await FeedbackService.getVibeSummaryForLocations(db, locations.map(l => l.id));
        locations = locations.map(loc => ({
          ...loc,
          rating: summaries[loc.id]?.rating || 0,
          vibeCounts: summaries[loc.id]?.counts
        }));
      }
    } catch (e) {
      console.error("Enrichment failed:", e);
      // Continue without enrichment
    }

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
    db: any,
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
			hours,
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

    // Enrich with Vibe Feedback
    try {
      if (locations.length > 0) {
        const summaries = await FeedbackService.getVibeSummaryForLocations(db, locations.map(l => l.id));
        locations = locations.map(loc => ({
          ...loc,
          rating: summaries[loc.id]?.rating || 0,
          vibeCounts: summaries[loc.id]?.counts
        }));
      }
    } catch (e) {
      console.error("Enrichment failed:", e);
    }

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

  static async getLocationBySlug(env: CloudflareBindings, db: any, slug: string) {
    const client = getSanityClient(env);
    const query = `*[_type == "location" && slug.current == $slug][0]{
			"id": _id,
			name,
			"slug": slug.current,
			address,
			hours,
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

    const location = await client.fetch(query, { slug });
    
    if (location) {
      try {
        const summaries = await FeedbackService.getVibeSummaryForLocations(db, [location.id]);
        location.rating = summaries[location.id]?.rating || 0;
        location.vibeCounts = summaries[location.id]?.counts;
      } catch (e) {
        console.error("Enrichment failed for slug:", slug, e);
      }
    }

    return location;
  }
}
