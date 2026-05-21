import { useCallback, useMemo } from "react";
import { useSession } from "@/lib/auth";
import { useFavoritesQuery, useToggleFavoriteMutation } from "@/hooks/use-queries";

export function useFavorites() {
  const { data: session } = useSession();
  const { data: favorites = [] } = useFavoritesQuery(!!session);
  const toggleMutation = useToggleFavoriteMutation();

  const favoriteIds = useMemo(() => {
    return new Set(favorites.map((f) => f.locationId));
  }, [favorites]);

  const toggle = useCallback(
    async (locationId: string) => {
      if (!session) return;
      try {
        await toggleMutation.mutateAsync(locationId);
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      }
    },
    [session, toggleMutation],
  );

  return {
    favoriteIds,
    toggle,
    isFavorited: useCallback((id: string) => favoriteIds.has(id), [favoriteIds]),
  };
}
