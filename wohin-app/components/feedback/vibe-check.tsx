import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { api } from "@/lib/api";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const vibes = [
  { id: "sparkle", emoji: "✨", label: "Sparkle", bg: "#deffaf40" },
  { id: "fire", emoji: "🔥", label: "Fire", bg: "#ff9e6d30" },
  { id: "chill", emoji: "🧊", label: "Chill", bg: "#6dbdff30" },
  { id: "nope", emoji: "👎", label: "Nope", bg: "#8b8a8720" },
];

export function VibeCheck({
  locationId,
  activityId,
  onVibe,
}: {
  locationId: string;
  activityId: string;
  onVibe: (vibe: string) => void;
}) {
  const [currentVibe, setCurrentVibe] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dropVibe = async (vibeId: string) => {
    if (submitting) return;

    setSubmitting(true);
    setCurrentVibe(vibeId);

    try {
      await api.post("/api/v1/feedback/vibe", {
        locationId,
        activityId,
        vibe: vibeId,
      });
      onVibe(vibeId);
    } catch (e) {
      console.error("Failed to drop vibe:", e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DROP A VIBE</Text>
        {currentVibe && <Text style={styles.successText}>Vibe sent! 💌</Text>}
      </View>

      <View style={styles.vibesGrid}>
        {vibes.map((vibe) => (
          <TouchableOpacity
            key={vibe.id}
            style={[
              styles.vibeButton,
              { backgroundColor: vibe.bg },
              currentVibe === vibe.id && styles.activeVibe,
            ]}
            onPress={() => dropVibe(vibe.id)}
            disabled={submitting}
          >
            <Text style={styles.emoji}>{vibe.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: "900",
    color: "#8b8a87",
    letterSpacing: 2,
  },
  successText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffb7b2",
  },
  vibesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vibeButton: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  activeVibe: {
    borderWidth: 3,
    borderColor: "#ffb7b2",
  },
  emoji: {
    fontSize: 32,
  },
});
