import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/use-app-theme";
import * as Haptics from "expo-haptics";
import { useSession } from "@/lib/auth";
import { useRouter } from "expo-router";
import { useVibeMutation } from "@/hooks/use-queries";

const vibesData = [
  { id: "sparkle", emoji: "✨", label: "Sparkle", color: "matcha" },
  { id: "fire", emoji: "🔥", label: "Fire", color: "peach" },
  { id: "chill", emoji: "🧊", label: "Chill", color: "sunny" },
  { id: "nope", emoji: "👎", label: "Nope", color: "muted" },
];

const hapticStyleMap: Record<string, Haptics.ImpactFeedbackStyle> = {
  sparkle: Haptics.ImpactFeedbackStyle.Light,
  fire: Haptics.ImpactFeedbackStyle.Medium,
  chill: Haptics.ImpactFeedbackStyle.Heavy,
  nope: Haptics.ImpactFeedbackStyle.Light,
};

interface Particle {
  id: string;
  emoji: string;
  vibeId: string;
}

function AnimatedParticle({
  id,
  emoji,
  onComplete,
}: {
  id: string;
  emoji: string;
  onComplete: (id: string) => void;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.5);
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    const angle = (Math.random() - 0.5) * 45; // -22.5 to 22.5 deg rotation
    const distance = 100 + Math.random() * 80; // height path
    const drift = (Math.random() - 0.5) * 50; // horizontal drift

    translateY.value = withTiming(-distance, { duration: 800 });
    translateX.value = withTiming(drift, { duration: 800 });
    opacity.value = withTiming(0, { duration: 800 });
    scale.value = withSpring(1.5, { damping: 8, stiffness: 80 });
    rotation.value = withTiming(angle, { duration: 800 }, (finished) => {
      if (finished) {
        runOnJS(onComplete)(id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: 18,
    top: 18,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[animatedStyle, { fontSize: 24, zIndex: 999 }]} pointerEvents="none">
      {emoji}
    </Animated.Text>
  );
}

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
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const theme = useAppTheme();
  const vibeMutation = useVibeMutation();
  
  // Animation values for each vibe button press feedback
  const scales = {
    sparkle: useSharedValue(1),
    fire: useSharedValue(1),
    chill: useSharedValue(1),
    nope: useSharedValue(1),
  };

  const animatedStyles = {
    sparkle: useAnimatedStyle(() => ({
      transform: [{ scale: scales.sparkle.value }],
    })),
    fire: useAnimatedStyle(() => ({
      transform: [{ scale: scales.fire.value }],
    })),
    chill: useAnimatedStyle(() => ({
      transform: [{ scale: scales.chill.value }],
    })),
    nope: useAnimatedStyle(() => ({
      transform: [{ scale: scales.nope.value }],
    })),
  };

  const removeParticle = (id: string) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  const dropVibe = async (vibeId: string, emoji: string) => {
    if (submitting) return;

    // Auth Guard check
    if (!session) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch (err) {
        console.warn("Haptics feedback warning failed:", err);
      }
      setShowAuthPrompt(true);
      return;
    }

    // Trigger haptic feedback based on vibe pressed
    try {
      const hapticStyle = hapticStyleMap[vibeId] || Haptics.ImpactFeedbackStyle.Medium;
      await Haptics.impactAsync(hapticStyle);
    } catch (err) {
      console.warn("Haptics failed:", err);
    }

    // Trigger floating emoji particles
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: `${vibeId}-${Date.now()}-${i}-${Math.random()}`,
      emoji,
      vibeId,
    }));
    setParticles((prev) => [...prev, ...newParticles]);

    // Trigger press animation
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
      await vibeMutation.mutateAsync({
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

  const getVibeStyleColor = (colorKey: string) => {
    let backgroundColor = theme.surface;
    if (colorKey === 'matcha') backgroundColor = theme.accent.matcha + '40';
    else if (colorKey === 'peach') backgroundColor = theme.accent.peach + '40';
    else if (colorKey === 'sunny') backgroundColor = theme.accent.sunny + '40';
    else backgroundColor = theme.muted + '20';

    return backgroundColor;
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.muted }]}>DROP A VIBE</Text>
        {currentVibe && <Text style={[styles.successText, { color: theme.accent.peach }]}>Vibe sent! 💌</Text>}
      </View>

      <View style={styles.vibesGrid}>
        {vibesData.map((vibe) => {
          const animatedStyle = (animatedStyles as any)[vibe.id];
          const backgroundColor = getVibeStyleColor(vibe.color);
          const currentVibeParticles = particles.filter((p) => p.vibeId === vibe.id);

          return (
            <TouchableOpacity
              key={vibe.id}
              onPress={() => dropVibe(vibe.id, vibe.emoji)}
              disabled={submitting}
              activeOpacity={0.7}
              style={{ overflow: "visible" }}
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
                {currentVibeParticles.map((p) => (
                  <AnimatedParticle
                    key={p.id}
                    id={p.id}
                    emoji={p.emoji}
                    onComplete={removeParticle}
                  />
                ))}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Auth Prompt Sheet */}
      <Modal
        visible={showAuthPrompt}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAuthPrompt(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowAuthPrompt(false)}>
          <Pressable
            style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalIndicator} />
            <Text style={[styles.modalTitle, { color: theme.ink }]}>Join the Vibe Check 🔒</Text>
            <Text style={[styles.modalSubtitle, { color: theme.muted }]}>
              Drop your rating to let others know if the vibe is immaculate or needs work! Sign in to join the community.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButtonPrimary, { backgroundColor: theme.accent.peach }]}
                onPress={() => {
                  setShowAuthPrompt(false);
                  router.push("/login");
                }}
              >
                <Text style={styles.modalButtonPrimaryText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { borderColor: theme.border }]}
                onPress={() => setShowAuthPrompt(false)}
              >
                <Text style={[styles.modalButtonSecondaryText, { color: theme.muted }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    overflow: "visible",
  },
  vibeButton: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  emoji: {
    fontSize: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
    opacity: 0.5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    gap: 12,
  },
  modalButtonPrimary: {
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  modalButtonSecondary: {
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
