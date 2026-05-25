import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { LocationCard } from "@/components/discovery/location-card";
import { LocationCardSkeleton } from "@/components/discovery/location-card-skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { shareLocation } from "@/lib/share";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useFeaturedLocations, useCuratedLists, CuratedList } from "@/hooks/use-queries";

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
  const [activeList, setActiveList] = useState<CuratedList | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const theme = useAppTheme();

  // Fetch 40 featured spots via TanStack Query hook
  const {
    data: featuredLocations = [],
    isLoading: isLoadingFeatured,
    refetch: refetchFeatured,
  } = useFeaturedLocations(undefined, undefined, 40);

  // Fetch curated lists via TanStack Query hook
  const {
    data: curatedLists = [],
    isLoading: isLoadingLists,
    refetch: refetchLists,
  } = useCuratedLists();

  const isLoading = isLoadingFeatured || isLoadingLists;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchLists()]);
    setRefreshing(false);
  }, [refetchFeatured, refetchLists]);

  const openVibe = (vibe: Vibe) => {
    setActiveVibe(vibe);
    setActiveList(null);
  };

  const openCuratedList = (list: CuratedList) => {
    setActiveList(list);
    setActiveVibe(null);
  };

  const closeModal = () => {
    setActiveVibe(null);
    setActiveList(null);
  };

  // Derive results client-side based on the current active vibe or active curated list
  const results = activeVibe
    ? featuredLocations.filter((loc) => {
        const byColor = loc.activities?.some(
          (a) => a.themeColor === activeVibe.themeColor,
        );
        const hay = (loc.name + " " + (loc.address ?? "")).toLowerCase();
        const byKeyword = activeVibe.keywords.some((k) => hay.includes(k));
        return byKeyword || byColor;
      })
    : activeList
    ? activeList.locations || []
    : [];
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
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
        <View className="p-5">
          <Text className="text-[10px] font-black tracking-[2px] mb-1" style={{ color: theme.muted }}>BERLIN · PICK YOUR MOOD</Text>
          <Text className="text-4xl font-black tracking-tighter" style={{ color: theme.ink }}>
            {"What's the "}<Text className="italic">vibe</Text>?
          </Text>
          <Text className="text-sm font-semibold mt-1" style={{ color: theme.muted }}>
            {"One tap. We'll handle the rest."}
          </Text>
        </View>

        {curatedLists.length > 0 && (
          <View className="pt-2 pb-5">
            <Text className="text-lg font-black px-5 mb-3 tracking-tight" style={{ color: theme.ink }}>Curated Guides 🗺️</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {curatedLists.map((list) => (
                <TouchableOpacity
                  key={list.id}
                  className="w-[280px] h-[110px] rounded-[24px] p-4 mr-4 flex-row items-center border-2"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border }}
                  onPress={() => openCuratedList(list)}
                >
                  <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: theme.accent.peach + "20" }}>
                    <Text className="text-2xl">{list.emoji || "📍"}</Text>
                  </View>
                  <View className="flex-1 justify-center">
                    <Text className="text-base font-black mb-1" style={{ color: theme.ink }} numberOfLines={1}>{list.title}</Text>
                    <Text className="text-xs font-medium leading-4" style={{ color: theme.muted }} numberOfLines={2}>{list.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View className="p-3 flex-row flex-wrap">
          {vibes.map((vibe) => (
            <TouchableOpacity
              key={vibe.id}
              className="w-[46%] h-[160px] m-[2%] rounded-[28px] p-4 overflow-hidden"
              style={{ backgroundColor: vibe.bg[0] }}
              onPress={() => openVibe(vibe)}
            >
              <View className="flex-1 justify-between">
                <View className="flex-row justify-between">
                  <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}>
                    <Text className="text-xl">{vibe.emoji}</Text>
                  </View>
                </View>
                <View>
                  <Text
                    className="text-2xl font-black tracking-[-0.5px]"
                    style={{ color: vibe.ink === "light" ? "#fefcf4" : "#2c2b29" }}
                  >
                    {vibe.name}
                  </Text>
                  <Text
                    className="text-[10px] font-bold"
                    style={{
                      color: vibe.ink === "light" ? "rgba(254, 252, 244, 0.5)" : "rgba(44, 43, 41, 0.5)",
                    }}
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
        visible={activeVibe !== null || activeList !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: theme.overlay }}>
          <View className="rounded-t-[40px] h-[88%] pt-3" style={{ backgroundColor: theme.background }}>
            <View className="w-10 h-1.5 rounded-[3px] self-center mb-5" style={{ backgroundColor: theme.border }} />

            <View className="flex-row justify-between px-6 mb-6">
              <View className="flex-1 mr-4">
                <Text className="text-[10px] font-black tracking-[2px] mb-1" style={{ color: theme.muted }}>
                  {activeVibe ? "VIBE" : "GUIDE"} · {results.length} spot{results.length === 1 ? "" : "s"}
                </Text>
                <Text className="text-[32px] font-black tracking-tighter" style={{ color: theme.ink }} numberOfLines={1}>
                  <Text className="text-2xl">{activeVibe ? activeVibe.emoji : activeList?.emoji}</Text>{" "}
                  {activeVibe ? activeVibe.name : activeList?.title}
                </Text>
                <Text className="text-xs font-semibold" style={{ color: theme.muted }} numberOfLines={2}>
                  {activeVibe ? activeVibe.tagline : activeList?.description}
                </Text>
              </View>
              <TouchableOpacity
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: theme.ink }}
                onPress={closeModal}
              >
                <X size={24} color={theme.background} />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ScrollView className="pt-2">
                <LocationCardSkeleton />
                <LocationCardSkeleton />
                <LocationCardSkeleton />
              </ScrollView>
            ) : (
              <ScrollView className="pt-2">
                {results.length > 0 ? (
                  results.map((loc) => (
                    <LocationCard key={loc.id} location={loc} isFavorited={isFavorited(loc.id)} onFavorite={toggleFavorite} onShare={shareLocation} />
                  ))
                ) : (
                  <View className="p-10 items-center">
                    <Text className="text-base font-semibold text-center" style={{ color: theme.muted }}>
                      No spots found here yet! ✨
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

