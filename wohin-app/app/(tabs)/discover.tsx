import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { api } from "@/lib/api";
import { LocationCard, Location } from "@/components/discovery/location-card";
import { LocationCardSkeleton } from "@/components/discovery/location-card-skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { shareLocation } from "@/lib/share";
import { useAppTheme } from "@/hooks/use-app-theme";

type ThemeColor = "matcha" | "peach" | "sunny";

interface Vibe {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  themeColor: ThemeColor;
  keywords: string[];
  area: string;
  bg: [string, string]; // simplified gradient colors
  ink: "light" | "dark";
}

const vibes: Vibe[] = [
  {
    id: "cozy",
    name: "Cozy",
    tagline: "warm corners, slow sips",
    emoji: "☕",
    themeColor: "peach",
    keywords: ["coffee", "cafe", "café", "book", "tea"],
    area: "cozy",
    bg: ["#ffb7b2", "#ff9e99"],
    ink: "dark",
  },
  {
    id: "wild",
    name: "Wild",
    tagline: "let the night win",
    emoji: "🔥",
    themeColor: "sunny",
    keywords: ["bar", "club", "party", "late", "dance"],
    area: "wild",
    bg: ["#2c2b29", "#ff6b5a"],
    ink: "light",
  },
  {
    id: "romantic",
    name: "Romantic",
    tagline: "candlelit, lingering",
    emoji: "🌹",
    themeColor: "peach",
    keywords: ["wine", "dinner", "date", "intimate", "bistro"],
    area: "romantic",
    bg: ["#ff8479", "#ffb7b2"],
    ink: "dark",
  },
  {
    id: "heady",
    name: "Heady",
    tagline: "think, stare, feel",
    emoji: "🎨",
    themeColor: "matcha",
    keywords: ["art", "gallery", "film", "museum", "bookshop"],
    area: "heady",
    bg: ["#a8e6cf", "#4a8a72"],
    ink: "dark",
  },
  {
    id: "slow",
    name: "Slow",
    tagline: "no rush, no map",
    emoji: "🌿",
    themeColor: "matcha",
    keywords: ["park", "garden", "walk", "canal", "river"],
    area: "slow",
    bg: ["#a8e6cf", "#c8f0da"],
    ink: "dark",
  },
  {
    id: "loud",
    name: "Loud",
    tagline: "bass in your teeth",
    emoji: "🎧",
    themeColor: "sunny",
    keywords: ["live", "music", "gig", "venue", "concert"],
    area: "loud",
    bg: ["#ffd97d", "#ff8f3c"],
    ink: "dark",
  },
  {
    id: "green",
    name: "Green",
    tagline: "trees, sky, breathe",
    emoji: "🌳",
    themeColor: "matcha",
    keywords: ["nature", "outdoor", "forest", "lake", "park"],
    area: "green",
    bg: ["#4a8a72", "#a8e6cf"],
    ink: "light",
  },
  {
    id: "hidden",
    name: "Hidden",
    tagline: "only the locals know",
    emoji: "🗝️",
    themeColor: "peach",
    keywords: ["secret", "local", "hidden", "tucked", "speakeasy"],
    area: "hidden",
    bg: ["#1a1a1a", "#ffb7b2"],
    ink: "light",
  },
];

export default function DiscoverScreen() {
  const [activeVibe, setActiveVibe] = useState<Vibe | null>(null);
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [featured, setFeatured] = useState<Location[]>([]);
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const theme = useAppTheme();

  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const res = await api.get<{ results: Location[] }>("/api/v1/discovery/featured?limit=40");
      setFeatured(res.results);
    } catch (e) {
      console.error("Failed to load featured spots:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  const openVibe = (vibe: Vibe) => {
    setActiveVibe(vibe);
    setLoading(true);

    // Simple client-side filtering like in SvelteKit
    const matches = featured.filter((loc) => {
      const byColor = loc.activities?.some(
        (a) => a.themeColor === vibe.themeColor,
      );
      const hay = (loc.name + " " + (loc.address ?? "")).toLowerCase();
      const byKeyword = vibe.keywords.some((k) => hay.includes(k));
      return byKeyword || byColor;
    });

    setResults(matches);
    setLoading(false);
  };
return (
  <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
    <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          tintColor={theme.accent.peach}
          colors={[theme.accent.peach]}
        />
      }
    >
        <View style={styles.header}>
          <Text style={[styles.subTitle, { color: theme.muted }]}>BERLIN · PICK YOUR MOOD</Text>
          <Text style={[styles.title, { color: theme.ink }]}>
            What's the <Text style={styles.italic}>vibe</Text>?
          </Text>
          <Text style={[styles.description, { color: theme.muted }]}>
            One tap. We'll handle the rest.
          </Text>
        </View>

        <View style={styles.grid}>
          {vibes.map((vibe) => (
            <TouchableOpacity
              key={vibe.id}
              style={[styles.tile, { backgroundColor: vibe.bg[0] }]}
              onPress={() => openVibe(vibe)}
            >
              <View style={styles.tileContent}>
                <View style={styles.tileTop}>
                  <View style={styles.emojiCircle}>
                    <Text style={styles.emoji}>{vibe.emoji}</Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      styles.tileName,
                      { color: vibe.ink === "light" ? "#fefcf4" : "#2c2b29" },
                    ]}
                  >
                    {vibe.name}
                  </Text>
                  <Text
                    style={[
                      styles.tileTagline,
                      {
                        color: vibe.ink === "light" ? "rgba(254, 252, 244, 0.5)" : "rgba(44, 43, 41, 0.5)",
                      },
                    ]}
                  >
                    {vibe.tagline}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal
        visible={activeVibe !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveVibe(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalIndicator, { backgroundColor: theme.border }]} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalSubTitle, { color: theme.muted }]}>
                  VIBE · {results.length} spot{results.length === 1 ? "" : "s"}
                </Text>
                <Text style={[styles.modalTitle, { color: theme.ink }]}>
                  <Text style={{ fontSize: 24 }}>{activeVibe?.emoji}</Text>{" "}
                  {activeVibe?.name}
                </Text>
                <Text style={[styles.modalTagline, { color: theme.muted }]}>{activeVibe?.tagline}</Text>
              </View>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.ink }]}
                onPress={() => setActiveVibe(null)}
              >
                <X size={24} color={theme.background} />
              </TouchableOpacity>
            </View>

            {loading ? (
              <ScrollView contentContainerStyle={styles.resultsScroll}>
                <LocationCardSkeleton />
                <LocationCardSkeleton />
                <LocationCardSkeleton />
              </ScrollView>
            ) : (
              <ScrollView contentContainerStyle={styles.resultsScroll}>
                {results.length > 0 ? (
                  results.map((loc) => (
                    <LocationCard key={loc.id} location={loc} isFavorited={isFavorited(loc.id)} onFavorite={toggleFavorite} onShare={shareLocation} />
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={[styles.emptyText, { color: theme.muted }]}>
                      No spots found for this vibe yet! ✨
                    </Text>
                  </View>
                )}
                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  subTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
  },
  italic: {
    fontStyle: "italic",
  },
  description: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  grid: {
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    width: "46%",
    height: 160,
    margin: "2%",
    borderRadius: 28,
    padding: 16,
    overflow: "hidden",
  },
  tileContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  tileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  emojiCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 20,
  },
  tileName: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  tileTagline: {
    fontSize: 10,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: "88%",
    paddingTop: 12,
  },
  modalIndicator: {
    width: 40,
    height: 6,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  modalSubTitle: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  modalTagline: {
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsScroll: {
    paddingTop: 10,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
