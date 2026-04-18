import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { api } from "@/lib/api";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/use-app-theme";

const vibesData = [
  { id: "sparkle", emoji: "✨", label: "Sparkle", color: "matcha" },
  { id: "fire", emoji: "🔥", label: "Fire", color: "peach" },
  { id: "chill", emoji: "🧊", label: "Chill", color: "sunny" },
  { id: "nope", emoji: "👎", label: "Nope", color: "muted" },
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
  const theme = useAppTheme();
  
  // Animation values for each vibe
  const scales = {
    sparkle: useSharedValue(1),
    fire: useSharedValue(1),
    chill: useSharedValue(1),
    nope: useSharedValue(1),
  };

  const dropVibe = async (vibeId: string) => {
    if (submitting) return;

    // Trigger animation
    const scale = (scales as any)[vibeId];
    if (scale) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
    }

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

  const getVibeStyle = (id: string, colorKey: string) => {
    const scale = (scales as any)[id];
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    let backgroundColor = theme.surface;
    if (colorKey === 'matcha') backgroundColor = theme.accent.matcha + '40';
    else if (colorKey === 'peach') backgroundColor = theme.accent.peach + '40';
    else if (colorKey === 'sunny') backgroundColor = theme.accent.sunny + '40';
    else backgroundColor = theme.muted + '20';

    return { animatedStyle, backgroundColor };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.muted }]}>DROP A VIBE</Text>
        {currentVibe && <Text style={[styles.successText, { color: theme.accent.peach }]}>Vibe sent! 💌</Text>}
      </View>

      <View style={styles.vibesGrid}>
        {vibesData.map((vibe) => {
          const { animatedStyle, backgroundColor } = getVibeStyle(vibe.id, vibe.color);
          return (
            <TouchableOpacity
              key={vibe.id}
              onPress={() => dropVibe(vibe.id)}
              disabled={submitting}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.vibeButton,
                  { backgroundColor },
                  currentVibe === vibe.id && { borderColor: theme.accent.peach, borderWidth: 3 },
                  animatedStyle,
                ]}
              >
                <Text style={styles.emoji}>{vibe.emoji}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
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
    letterSpacing: 2,
  },
  successText: {
    fontSize: 10,
    fontWeight: "700",
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
  },
  emoji: {
    fontSize: 32,
  },
});
