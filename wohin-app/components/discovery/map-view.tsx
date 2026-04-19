import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MapViewProps {
  mapRef: any;
  initialRegion: any;
  locations: any[];
  activeIdx: number;
  onMarkerPress: (idx: number) => void;
  theme: any;
  styles: any;
}

export default function NativeMapView({ theme }: MapViewProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme?.background || "#f0f0f0" }]}>
      <Text style={[styles.text, { color: theme?.muted || "#666" }]}>
        Map view is not available on web.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
