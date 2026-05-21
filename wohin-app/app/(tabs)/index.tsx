import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";
import { api } from "@/lib/api";
import {
  LocationCard,
  Location,
  Activity,
  FeedbackStack,
} from "@/components/discovery/location-card";
import { LocationCardSkeleton } from "@/components/discovery/location-card-skeleton";
import { useAppTheme } from "@/hooks/use-app-theme";
import { Link } from "expo-router";
import { useFavorites } from "@/hooks/use-favorites";
import { shareLocation } from "@/lib/share";
import { useLocation } from "@/hooks/use-location";

export default function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newArrivals, setNewArrivals] = useState<Location[]>([]);
  const [trendingSpots, setTrendingSpots] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [filtering, setFiltering] = useState(false);
  
  const theme = useAppTheme();
  const { isFavorited, toggle: toggleFavorite } = useFavorites();
  const { location: userLocation } = useLocation();

  const loadData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const queryParams = userLocation 
        ? `?lat=${userLocation.latitude}&lng=${userLocation.longitude}`
        : "";

      const [activitiesRes, featuredRes] = await Promise.all([
        api.get<{ activities: Activity[] }>("/api/v1/discovery/activities"),
        api.get<{ results: Location[] }>(
          `/api/v1/discovery/featured${queryParams}${userLocation ? "&" : "?"}limit=10`,
        ),
      ]);

      setActivities(activitiesRes.activities);
      setNewArrivals(featuredRes.results.slice(0, 3));
      setTrendingSpots(featuredRes.results.slice(3, 7));
      
      // Reset filtering state on full load/refresh
      setSelectedActivityId(null);
      setSearchResults(null);
      setSearchQuery("");
    } catch (e) {
      console.error("Failed to load home data:", e);
      setError("Unable to reach the magic. Check your connection!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userLocation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  const handleActivityPress = async (activityId: string | null) => {
    setSelectedActivityId(activityId);
    setSearchQuery("");
    setSearchResults(null);
    
    if (activityId === null) {
      setFilteredLocations([]);
      return;
    }

    setFiltering(true);
    try {
      const queryParams = userLocation 
        ? `&lat=${userLocation.latitude}&lng=${userLocation.longitude}`
        : "";
      const res = await api.get<{ results: Location[] }>(
        `/api/v1/discovery/search?activityId=${activityId}${queryParams}`,
      );
      setFilteredLocations(res.results);
    } catch (e) {
      console.error("Failed to filter by activity:", e);
      setFilteredLocations([]);
    } finally {
      setFiltering(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setSelectedActivityId(null); // Clear activity filter when searching
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const queryParams = userLocation 
        ? `&lat=${userLocation.latitude}&lng=${userLocation.longitude}`
        : "";
      const res = await api.get<{ results: Location[] }>(
        `/api/v1/discovery/search?q=${encodeURIComponent(query.trim())}${queryParams}`,
      );
      setSearchResults(res.results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [userLocation]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const getActivityColor = (themeName?: string) => {
    switch (themeName) {
      case "matcha":
        return theme.accent.matcha;
      case "peach":
        return theme.accent.peach;
      case "sunny":
        return theme.accent.sunny;
      default:
        return theme.accent.sunny;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
        <View style={styles.header}>
          <Text style={[styles.subTitle, { color: theme.muted }]}>BERLIN · TODAY</Text>
          <Text style={[styles.title, { color: theme.ink }]}>
            Whatcha <Text style={styles.italic}>wanna</Text> do?
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
          <LocationCardSkeleton />
          <LocationCardSkeleton />
          <LocationCardSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error && !activities.length) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚡</Text>
          <Text style={[styles.errorTitle, { color: theme.ink }]}>Signal Lost</Text>
          <Text style={[styles.errorText, { color: theme.muted }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.accent.peach }]} 
            onPress={() => loadData()}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.subTitle, { color: theme.muted }]}>BERLIN · TODAY</Text>
          <Text style={[styles.title, { color: theme.ink }]}>
            Whatcha <Text style={styles.italic}>wanna</Text> do?
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
            <Search size={18} color={theme.muted} />
            <TextInput
              style={[styles.searchInput, { color: theme.ink }]}
              placeholder="Search spots..."
              placeholderTextColor={theme.muted}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={18} color={theme.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search or Filter Results */}
        {(searchResults !== null || selectedActivityId !== null) ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>
                {searching || filtering
                  ? "Loading..."
                  : selectedActivityId 
                    ? `${filteredLocations.length} result${filteredLocations.length !== 1 ? "s" : ""} for ${activities.find(a => a.id === selectedActivityId)?.name}`
                    : `${searchResults!.length} result${searchResults!.length !== 1 ? "s" : ""}`}
              </Text>
            </View>
            {searching || filtering ? (
              <View style={{ marginTop: 20 }}>
                <LocationCardSkeleton />
                <LocationCardSkeleton />
              </View>
            ) : (selectedActivityId ? filteredLocations : searchResults!).length > 0 ? (
              (selectedActivityId ? filteredLocations : searchResults!).map((location) => (
                <LocationCard key={location.id} location={location} isFavorited={isFavorited(location.id)} onFavorite={toggleFavorite} onShare={shareLocation} />
              ))
            ) : (
              <Text style={[styles.emptySearch, { color: theme.muted }]}>
                No spots found. Try a different mood! ✨
              </Text>
            )}
            <View style={{ height: 100 }} />
          </View>
        ) : (
          <>

        {/* Activity Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesContainer}
        >
          <TouchableOpacity
            style={[
              styles.activityPill,
              { 
                backgroundColor: selectedActivityId === null ? theme.accent.peach : theme.surface, 
                borderColor: selectedActivityId === null ? theme.accent.peach : theme.border 
              },
            ]}
            onPress={() => handleActivityPress(null)}
          >
            <Text style={[styles.activityName, { color: selectedActivityId === null ? "#fff" : theme.ink }]}>All</Text>
          </TouchableOpacity>

          {activities.map((activity) => {
            const isSelected = selectedActivityId === activity.id;
            const activeColor = getActivityColor(activity.themeColor);
            return (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityPill,
                  { 
                    backgroundColor: isSelected ? activeColor : theme.surface, 
                    borderColor: isSelected ? activeColor : theme.border 
                  },
                ]}
                onPress={() => handleActivityPress(activity.id)}
              >
                {activity.icon && (
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                )}
                <Text style={[styles.activityName, { color: isSelected ? "#fff" : theme.ink }]}>{activity.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.ink }]}>Trending</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: theme.muted }]}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
          >
            {trendingSpots.map((spot) => {
              const primaryActivity = spot.activities[0];
              const accentColor = primaryActivity ? getActivityColor(primaryActivity.themeColor) : theme.accent.peach;
              
              return (
                <Link key={spot.id} href={`/location/${spot.slug}`} asChild>
                  <TouchableOpacity 
                    activeOpacity={0.9} 
                    style={[
                      styles.trendingCard, 
                      { 
                        backgroundColor: theme.surface, 
                        shadowColor: theme.shadow,
                        borderColor: theme.border
                      }
                    ]}
                  >
                    <View style={styles.trendingImageContainer}>
                      {spot.image || (spot.photos && spot.photos[0]) ? (
                        <Image
                          source={spot.image || spot.photos?.[0]}
                          style={styles.trendingImage}
                          contentFit="cover"
                          transition={200}
                        />
                      ) : (
                        <View
                          style={[
                            styles.trendingImagePlaceholder,
                            {
                              backgroundColor: accentColor + "20",
                            },
                          ]}
                        >
                          <Text style={{ fontSize: 32 }}>
                            {primaryActivity?.icon || "📍"}
                          </Text>
                        </View>
                      )}
                      
                      {primaryActivity && (
                        <View style={[styles.vibeTag, { backgroundColor: accentColor }]}>
                          <Text style={[styles.vibeTagText, { color: theme.ink }]}>
                            {primaryActivity.name.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.trendingContent}>
                      <Text style={[styles.trendingName, { color: theme.ink }]} numberOfLines={1}>
                        {spot.name}
                      </Text>
                      <View style={styles.trendingMeta}>
                        <Text style={[styles.trendingAddress, { color: theme.muted }]} numberOfLines={1}>
                          {spot.address?.split(",")[0] || "Berlin"}
                        </Text>
                      </View>
                      
                      <View style={styles.trendingFooter}>
                        <FeedbackStack vibeCounts={spot.vibeCounts} />
                        {spot.rating != null && spot.rating > 0 && (
                          <View style={[styles.trendingRatingBadge, { backgroundColor: theme.accent.sunny + '30' }]}>
                            <Text style={[styles.trendingRatingText, { color: theme.ink }]}>⭐ {spot.rating.toFixed(1)}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </ScrollView>
        </View>

        {/* Just Landed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>Just Landed</Text>
              <View style={[styles.newBadge, { backgroundColor: theme.accent.matcha }]}>
                <Text style={[styles.newBadgeText, { color: theme.ink }]}>NEW ✨</Text>
              </View>
            </View>
          </View>

          {newArrivals.map((location) => (
            <LocationCard key={location.id} location={location} isFavorited={isFavorited(location.id)} onFavorite={toggleFavorite} onShare={shareLocation} />
          ))}
        </View>

        <View style={{ height: 100 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
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
  activitiesContainer: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  activityPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    gap: 8,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "900",
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "700",
  },
  trendingScroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  trendingCard: {
    width: 200,
    height: 280,
    borderRadius: 32,
    padding: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    flexShrink: 0,
  },
  trendingImageContainer: {
    height: 140,
    width: 174,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  trendingImage: {
    width: "100%",
    height: "100%",
  },
  trendingImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  vibeTag: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  vibeTagText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
  },
  trendingContent: {
    flex: 1,
    paddingTop: 12,
    justifyContent: "space-between",
  },
  trendingName: {
    fontSize: 18,
    fontWeight: "900",
  },
  trendingMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendingAddress: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  trendingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trendingRatingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  trendingRatingText: {
    fontSize: 10,
    fontWeight: "900",
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: "900",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySearch: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  retryText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});
