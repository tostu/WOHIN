import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Navigation, ExternalLink } from "lucide-react-native";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";
import { Location } from "@/components/discovery/location-card";
import { useLocation } from "@/hooks/use-location";

const themeMap: Record<string, string> = {
  matcha: "#a8e6cf",
  peach: "#ffb7b2",
  sunny: "#ffd97d",
};

function openInMaps(lat: number, lng: number, name: string) {
  const label = encodeURIComponent(name);
  const url = Platform.select({
    ios: `maps:0,0?q=${label}@${lat},${lng}`,
    android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  });
  if (url) Linking.openURL(url);
}

function LocationMapCard({
  location,
  onPress,
}: {
  location: Location;
  onPress: () => void;
}) {
  const color =
    themeMap[location.activities[0]?.themeColor] || "#ffb7b2";
  const hasCoords = location.coordinates?.lat != null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardRow}>
        <View style={[styles.imageBox, { backgroundColor: color + "30" }]}>
          {location.image ? (
            <Image
              source={location.image}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Text style={{ fontSize: 28 }}>
              {location.activities[0]?.icon || "📍"}
            </Text>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>
            {location.name}
          </Text>
          {location.address && (
            <View style={styles.addressRow}>
              <MapPin size={11} color="#8b8a87" />
              <Text style={styles.cardAddress} numberOfLines={1}>
                {location.distance != null ? `${location.distance.toFixed(1)}km · ` : ''}
                {location.address}
              </Text>
            </View>
          )}
          {location.activities[0] && (
            <View style={[styles.tag, { backgroundColor: color + "40" }]}>
              <Text style={styles.tagText}>
                {location.activities[0].icon} {location.activities[0].name}
              </Text>
            </View>
          )}
        </View>

        {hasCoords && (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: color }]}
            onPress={() =>
              openInMaps(
                location.coordinates!.lat,
                location.coordinates!.lng,
                location.name,
              )
            }
          >
            <Navigation size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { location: userLocation } = useLocation();

  useEffect(() => {
    const queryParams = userLocation 
        ? `?lat=${userLocation.latitude}&lng=${userLocation.longitude}`
        : "";

    api
      .get<{ results: Location[] }>(`/api/v1/discovery/featured${queryParams}${userLocation ? "&" : "?"}limit=50`)
      .then((res) => setLocations(res.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userLocation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffb7b2" />
      </View>
    );
  }

  const withCoords = locations.filter((l) => l.coordinates?.lat);
  const withoutCoords = locations.filter((l) => !l.coordinates?.lat);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.subTitle}>BERLIN · ALL SPOTS</Text>
        <Text style={styles.title}>On the Map</Text>
        <Text style={styles.desc}>
          {withCoords.length} spot{withCoords.length !== 1 ? "s" : ""} with
          directions
        </Text>
      </View>

      <FlatList
        data={[...withCoords, ...withoutCoords]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LocationMapCard
            location={item}
            onPress={() => router.push(`/location/${item.slug}`)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: 12,
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
  desc: {
    fontSize: 13,
    color: "#8b8a87",
    fontWeight: "600",
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#2c2b29",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    gap: 3,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#2c2b29",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardAddress: {
    fontSize: 12,
    color: "#8b8a87",
    fontWeight: "500",
    flex: 1,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2c2b29",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
