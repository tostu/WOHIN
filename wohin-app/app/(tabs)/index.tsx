import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/lib/api";
import {
  LocationCard,
  Location,
  Activity,
} from "@/components/discovery/location-card";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newArrivals, setNewArrivals] = useState<Location[]>([]);
  const [trendingSpots, setTrendingSpots] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? "light";

  useEffect(() => {
    async function loadData() {
      try {
        const [activitiesRes, featuredRes] = await Promise.all([
          api.get<{ activities: Activity[] }>("/api/v1/discovery/activities"),
          api.get<{ results: Location[] }>(
            "/api/v1/discovery/featured?limit=10",
          ),
        ]);

        setActivities(activitiesRes.activities);
        setNewArrivals(featuredRes.results.slice(0, 3));
        setTrendingSpots(featuredRes.results.slice(3, 7));
      } catch (e) {
        console.error("Failed to load home data:", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getActivityColor = (theme?: string) => {
    switch (theme) {
      case "matcha":
        return "#a8e6cf";
      case "peach":
        return "#ffb7b2";
      case "sunny":
        return "#ffd97d";
      default:
        return "#ffd97d";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffb7b2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subTitle}>BERLIN · TODAY</Text>
          <Text style={styles.title}>
            Whatcha <Text style={styles.italic}>wanna</Text> do?
          </Text>
        </View>

        {/* Activity Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activitiesContainer}
        >
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityPill,
                { backgroundColor: "#fff", borderColor: "#2c2b2910" },
              ]}
            >
              {activity.icon && (
                <Text style={styles.activityIcon}>{activity.icon}</Text>
              )}
              <Text style={styles.activityName}>{activity.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingScroll}
          >
            {trendingSpots.map((spot) => (
              <Link key={spot.id} href={`/location/${spot.slug}`} asChild>
                <TouchableOpacity style={styles.trendingCard}>
                  <View style={styles.trendingImageContainer}>
                    {spot.image ? (
                      <Image
                        source={{ uri: spot.image }}
                        style={styles.trendingImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.trendingImagePlaceholder,
                          {
                            backgroundColor:
                              getActivityColor(spot.activities[0]?.themeColor) +
                              "40",
                          },
                        ]}
                      >
                        <Text style={{ fontSize: 32 }}>
                          {spot.activities[0]?.icon || "📍"}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.trendingContent}>
                    <Text style={styles.trendingName} numberOfLines={1}>
                      {spot.name}
                    </Text>
                    <Text style={styles.trendingAddress} numberOfLines={1}>
                      {spot.address?.split(",")[0] || "Berlin"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Just Landed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={styles.sectionTitle}>Just Landed</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW ✨</Text>
              </View>
            </View>
          </View>

          {newArrivals.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefcf4",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefcf4",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#8b8a87",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2c2b29",
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
    color: "#2c2b29",
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
    color: "#2c2b29",
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8b8a87",
  },
  trendingScroll: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 24,
  },
  trendingCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#2c2b29",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  trendingImageContainer: {
    height: 120,
    width: "100%",
  },
  trendingImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  trendingImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  trendingContent: {
    padding: 12,
  },
  trendingName: {
    fontSize: 14,
    fontWeight: "900",
    color: "#2c2b29",
    marginBottom: 2,
  },
  trendingAddress: {
    fontSize: 11,
    color: "#8b8a87",
    fontWeight: "600",
  },
  newBadge: {
    backgroundColor: "#a8e6cf",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#2c2b29",
  },
});
