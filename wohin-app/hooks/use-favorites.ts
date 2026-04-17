import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth";

export function useFavorites() {
  const { data: session } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) {
      setFavoriteIds(new Set());
      return;
    }
    api
      .get<{ locationId: string }[]>("/api/v1/favorites")
      .then((favs) => setFavoriteIds(new Set(favs.map((f) => f.locationId))))
      .catch(() => {});
  }, [session]);

  const toggle = useCallback(
    async (locationId: string) => {
      if (!session) return;

      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(locationId)) next.delete(locationId);
        else next.add(locationId);
        return next;
      });

      try {
        await api.post("/api/v1/favorites/toggle", { locationId });
      } catch {
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (next.has(locationId)) next.delete(locationId);
          else next.add(locationId);
          return next;
        });
      }
    },
    [session],
  );

  return { favoriteIds, toggle, isFavorited: (id: string) => favoriteIds.has(id) };
}
