import React from "react";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { Location as LocationModel } from "./location-card";

interface NativeMapProps {
  mapRef: React.RefObject<MapView>;
  initialRegion: Region;
  locations: LocationModel[];
  activeIdx: number;
  onMarkerPress: (idx: number) => void;
  theme: any;
  styles: any;
}

export default function NativeMapView({
  mapRef,
  initialRegion,
  locations,
  activeIdx,
  onMarkerPress,
  theme,
  styles: externalStyles,
}: NativeMapProps) {
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_DEFAULT}
      style={StyleSheet.absoluteFill}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
    >
      {locations.map((loc, idx) => {
        const themeMap: Record<string, string> = {
          matcha: theme.accent.matcha,
          peach: theme.accent.peach,
          sunny: theme.accent.sunny,
        };
        const color =
          themeMap[loc.activities[0]?.themeColor] || theme.accent.peach;
        const isActive = idx === activeIdx;
        
        // Use a simpler approach for now to debug the crash
        return (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.coordinates!.lat,
              longitude: loc.coordinates!.lng,
            }}
            onPress={() => onMarkerPress(idx)}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
             <View
                style={[
                  externalStyles.pin,
                  {
                    backgroundColor: color,
                    borderColor: theme.surface,
                    transform: [{ scale: isActive ? 1.25 : 1 }],
                  },
                ]}
              >
                <Text style={externalStyles.pinIcon}>
                  {loc.activities[0]?.icon || "📍"}
                </Text>
              </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
