import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { api } from "@/lib/api";
import { Location, Activity } from "@/components/discovery/location-card";

// Configure query client and persister for offline sync
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes - keep data fresh but allow quick cache hits
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "WOHIN_OFFLINE_CACHE",
});

// Hook: Fetch activities list
export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: () => api.get<{ activities: Activity[] }>("/api/v1/discovery/activities"),
    select: (data) => data.activities,
  });
}

// Hook: Fetch featured locations (optionally with coordinates)
export function useFeaturedLocations(lat?: number, lng?: number, limit = 10) {
  return useQuery({
    queryKey: ["locations", "featured", { lat, lng, limit }],
    queryFn: () => {
      const queryParams = lat && lng 
        ? `?lat=${lat}&lng=${lng}&limit=${limit}`
        : `?limit=${limit}`;
      return api.get<{ results: Location[] }>(`/api/v1/discovery/featured${queryParams}`);
    },
    select: (data) => data.results,
  });
}

export interface CuratedList {
  id: string;
  title: string;
  slug: string;
  emoji?: string;
  description?: string;
  locations: Location[];
}

// Hook: Fetch curated lists
export function useCuratedLists() {
  return useQuery({
    queryKey: ["curatedLists"],
    queryFn: () => api.get<{ results: CuratedList[] }>("/api/v1/discovery/lists"),
    select: (data) => data.results,
  });
}

// Hook: Search locations by query string
export function useSearchLocations(query: string, lat?: number, lng?: number) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["locations", "search", { query: trimmed, lat, lng }],
    queryFn: () => {
      const queryParams = lat && lng 
        ? `&lat=${lat}&lng=${lng}`
        : "";
      return api.get<{ results: Location[] }>(
        `/api/v1/discovery/search?q=${encodeURIComponent(trimmed)}${queryParams}`
      );
    },
    select: (data) => data.results,
    enabled: !!trimmed,
  });
}

// Hook: Filter locations by activity ID
export function useActivityFilteredLocations(activityId: string | null, lat?: number, lng?: number) {
  return useQuery({
    queryKey: ["locations", "activity", { activityId, lat, lng }],
    queryFn: () => {
      const queryParams = lat && lng 
        ? `&lat=${lat}&lng=${lng}`
        : "";
      return api.get<{ results: Location[] }>(
        `/api/v1/discovery/search?activityId=${activityId}${queryParams}`
      );
    },
    select: (data) => data.results,
    enabled: !!activityId,
  });
}

// Hook: Fetch location details by slug
export function useLocationDetail(slug: string) {
  return useQuery({
    queryKey: ["location", slug],
    queryFn: () => api.get<Location>(`/api/v1/discovery/location/${slug}`),
  });
}

// Hook: Fetch vibe history/feedback for a location
export function useVibeHistory(locationId: string) {
  return useQuery({
    queryKey: ["vibeHistory", locationId],
    queryFn: () => api.get<any[]>(`/api/v1/feedback/location/${locationId}`),
    enabled: !!locationId,
  });
}

// Hook: Drop a Vibe Check (mutation)
export function useVibeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (variables: { locationId: string; activityId: string; vibe: string }) =>
      api.post<{ success: boolean }>("/api/v1/feedback/vibe", variables),
    onSuccess: (data, variables) => {
      // Invalidate history to fetch new vibes
      qc.invalidateQueries({ queryKey: ["vibeHistory", variables.locationId] });
      // Invalidate user stats vibe count
      qc.invalidateQueries({ queryKey: ["userVibes"] });
      // Invalidate featured/search lists as ratings/counts might change
      qc.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}

// Hook: Fetch user's feedback/vibe history
export function useUserVibes(enabled = true) {
  return useQuery({
    queryKey: ["userVibes"],
    queryFn: () => api.get<any[]>("/api/v1/feedback/me"),
    enabled,
  });
}

// Hook: Fetch user's favorite locations list
export function useFavoritesQuery(enabled = true) {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get<{ locationId: string }[]>("/api/v1/favorites"),
    enabled,
  });
}

// Hook: Toggle favorite state (mutation with optimistic updates)
export function useToggleFavoriteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (locationId: string) =>
      api.post<{ success: boolean }>("/api/v1/favorites/toggle", { locationId }),
    onMutate: async (locationId) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: ["favorites"] });

      // Snapshot the previous favorites
      const previousFavorites = qc.getQueryData<{ locationId: string }[]>(["favorites"]);

      // Optimistically update favorites set
      qc.setQueryData<{ locationId: string }[]>(["favorites"], (old) => {
        if (!old) return [{ locationId }];
        const exists = old.some((f) => f.locationId === locationId);
        if (exists) {
          return old.filter((f) => f.locationId !== locationId);
        } else {
          return [...old, { locationId }];
        }
      });

      return { previousFavorites };
    },
    onError: (err, locationId, context) => {
      // Roll back to the snapshot on error
      if (context?.previousFavorites) {
        qc.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    onSettled: () => {
      // Invalidate to sync with the server
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
