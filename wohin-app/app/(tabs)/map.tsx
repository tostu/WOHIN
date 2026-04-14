import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Map as MapIcon } from "lucide-react-native";

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MapIcon size={48} color="#ffd97d" />
        </View>
        <Text style={styles.title}>Under Construction</Text>
        <Text style={styles.description}>
          The interactive map is being radiant-tuned for your pleasure.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefcf4",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#ffd97d40",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2c2b29",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#8b8a87",
    fontWeight: "600",
    textAlign: "center",
  },
});
