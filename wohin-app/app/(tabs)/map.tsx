import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Navigation, Locate } from "lucide-react-native";
import { useRouter } from "expo-router";

import { Location as LocationModel } from "@/components/discovery/location-card";
import { LocationCardSkeleton } from "@/components/discovery/location-card-skeleton";
import { useLocation } from "@/hooks/use-location";
import { useAppTheme } from "@/hooks/use-app-theme";
import NativeMapView from "@/components/discovery/map-view";
import { useFeaturedLocations } from "@/hooks/use-queries";

// Define a minimal interface for the map ref to avoid importing react-native-maps on web
interface MapViewRef {
  animateToRegion: (region: any, duration?: number) => void;
}

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 40;
const CARD_SPACING = 12;
const SNAP = CARD_W + CARD_SPACING;

// Berlin center fallback
const DEFAULT_REGION = {
  latitude: 52.52,
  longitude: 13.405,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
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

function MapCard({
  location,
  onPress,
  width,
}: {
  location: LocationModel;
  onPress: () => void;
  width: number;
}) {
  const theme = useAppTheme();
  const themeMap: Record<string, string> = {
    matcha: theme.accent.matcha,
    peach: theme.accent.peach,
    sunny: theme.accent.sunny,
  };
  const color =
    themeMap[location.activities[0]?.themeColor] || theme.accent.peach;
  const hasCoords = location.coordinates?.lat != null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width,
          backgroundColor: theme.surface,
          shadowColor: theme.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
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
          <Text style={[styles.cardName, { color: theme.ink }]} numberOfLines={1}>
            {location.name}
          </Text>
          {location.address && (
            <View style={styles.addressRow}>
              <MapPin size={11} color={theme.muted} />
              <Text
                style={[styles.cardAddress, { color: theme.muted }]}
                numberOfLines={1}
              >
                {location.distance != null
                  ? `${location.distance.toFixed(1)}km · `
                  : ""}
                {location.address}
              </Text>
            </View>
          )}
          {location.activities[0] && (
            <View style={[styles.tag, { backgroundColor: color + "40" }]}>
              <Text style={[styles.tagText, { color: theme.ink }]}>
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
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const { location: userLocation } = useLocation();
  const theme = useAppTheme();
  const mapRef = useRef<MapViewRef>(null);
  const listRef = useRef<FlatList<LocationModel>>(null);

  // Fetch 50 featured locations using TanStack query hook
  const { data: locations = [], isLoading: loading } = useFeaturedLocations(
    userLocation?.latitude,
    userLocation?.longitude,
    50
  );

  const withCoords = useMemo(
    () => locations.filter((l) => l.coordinates?.lat != null),
    [locations],
  );

  // Initial region: fit bounds around all markers (+user), fallback Berlin
  const initialRegion = useMemo(() => {
    const pts = withCoords.map((l) => ({
      lat: l.coordinates!.lat,
      lng: l.coordinates!.lng,
    }));
    if (userLocation) {
      pts.push({
        lat: userLocation.latitude,
        lng: userLocation.longitude,
      });
    }
    if (pts.length === 0) return DEFAULT_REGION;
    const lats = pts.map((p) => p.lat);
    const lngs = pts.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latDelta = Math.max(0.02, (maxLat - minLat) * 1.4);
    const lngDelta = Math.max(0.02, (maxLng - minLng) * 1.4);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [withCoords, userLocation]);

  function focusOn(loc: LocationModel, animate = true) {
    if (!loc.coordinates?.lat) return;
    const region = {
      latitude: loc.coordinates.lat,
      longitude: loc.coordinates.lng,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
    if (animate) {
      mapRef.current?.animateToRegion(region, 450);
    } else {
      mapRef.current?.animateToRegion(region, 0);
    }
  }

  function onMarkerPress(idx: number) {
    setActiveIdx(idx);
    listRef.current?.scrollToIndex({ index: idx, animated: true });
    focusOn(withCoords[idx]);
  }

  function onCardScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SNAP);
    if (idx !== activeIdx && withCoords[idx]) {
      setActiveIdx(idx);
      focusOn(withCoords[idx]);
    }
  }

  function recenterOnUser() {
    if (!userLocation) return;
    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      450,
    );
  }

  // Web fallback: no native map, keep list UI
  if (Platform.OS === "web") {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <View style={styles.header}>
          <Text style={[styles.subTitle, { color: theme.muted }]}>
            BERLIN · ALL SPOTS
          </Text>
          <Text style={[styles.title, { color: theme.ink }]}>On the Map</Text>
          <Text style={[styles.desc, { color: theme.muted }]}>
            Map view is only available on iOS and Android
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {locations.map((item) => (
            <MapCard
              key={item.id}
              location={item}
              width={SCREEN_W - 32}
              onPress={() => router.push(`/location/${item.slug}`)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
        edges={["top"]}
      >
        <View style={styles.header}>
          <Text style={[styles.subTitle, { color: theme.muted }]}>
            BERLIN · ALL SPOTS
          </Text>
          <Text style={[styles.title, { color: theme.ink }]}>On the Map</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LocationCardSkeleton />
          <LocationCardSkeleton />
          <LocationCardSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <NativeMapView
        mapRef={mapRef}
        initialRegion={initialRegion}
        locations={withCoords}
        activeIdx={activeIdx}
        onMarkerPress={onMarkerPress}
        theme={theme}
        styles={styles}
      />

      <SafeAreaView
        style={styles.overlayTop}
        edges={["top"]}
        pointerEvents="box-none"
      >
        <View
          style={[
            styles.floatingHeader,
            { backgroundColor: theme.surface, shadowColor: theme.shadow },
          ]}
        >
          <Text style={[styles.subTitle, { color: theme.muted }]}>
            BERLIN · {withCoords.length} SPOTS
          </Text>
          <Text style={[styles.headerTitle, { color: theme.ink }]}>
            On the Map
          </Text>
        </View>

        {userLocation && (
          <TouchableOpacity
            style={[
              styles.locateButton,
              { backgroundColor: theme.surface, shadowColor: theme.shadow },
            ]}
            onPress={recenterOnUser}
            activeOpacity={0.8}
          >
            <Locate size={20} color={theme.ink} />
          </TouchableOpacity>
        )}
      </SafeAreaView>

      <SafeAreaView style={styles.overlayBottom} edges={["bottom"]}>
        <FlatList
          ref={listRef}
          data={withCoords}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled={false}
          snapToInterval={SNAP}
          decelerationRate="fast"
          snapToAlignment="start"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          onMomentumScrollEnd={onCardScroll}
          ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
          getItemLayout={(_, index) => ({
            length: SNAP,
            offset: SNAP * index,
            index,
          })}
          renderItem={({ item, index }) => (
            <MapCard
              location={item}
              width={CARD_W}
              onPress={() => {
                if (index === activeIdx) {
                  router.push(`/location/${item.slug}`);
                } else {
                  onMarkerPress(index);
                }
              }}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  desc: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    gap: 12,
  },
  floatingHeader: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  locateButton: {
    marginTop: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  overlayBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  carousel: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  card: {
    borderRadius: 24,
    padding: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
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
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardAddress: {
    fontSize: 12,
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
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  pinIcon: {
    fontSize: 18,
  },
});
