import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, LogOut, Plus } from "lucide-react-native";
import { useSession, signOut } from "@/lib/auth";
import { Link } from "expo-router";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useUserVibes } from "@/hooks/use-queries";

export default function ProfileScreen() {
  const { data: session, isPending } = useSession();
  const theme = useAppTheme();

  // Load user vibes via TanStack Query hook
  const { data: vibes = [] } = useUserVibes(!!session);

  const vibeCount = vibes.length;
  const spotCount = new Set(vibes.map((v: any) => v.locationId)).size;

  if (isPending) {
    return (
      <View style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])} />
    );
  }

  if (!session) {
    return (
      <SafeAreaView
        style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}
      >
        <View style={styles.content}>
          <User size={64} color={theme.accent.peach} />
          <Text style={StyleSheet.flatten([styles.title, { color: theme.ink }])}>
            Join the Community
          </Text>
          <Text style={StyleSheet.flatten([styles.description, { color: theme.muted }])}>
            Sign in to drop vibes and share your favorite spots!
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity
              style={StyleSheet.flatten([styles.button, { backgroundColor: theme.accent.peach }])}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}
    >
      <View style={styles.header}>
        <View style={StyleSheet.flatten([styles.avatar, { backgroundColor: theme.accent.peach }])}>
          <Text style={styles.avatarText}>{session.user.name?.[0] || "U"}</Text>
        </View>
        <Text style={StyleSheet.flatten([styles.userName, { color: theme.ink }])}>
          {session.user.name}
        </Text>
        <Text style={StyleSheet.flatten([styles.userEmail, { color: theme.muted }])}>
          {session.user.email}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={StyleSheet.flatten([styles.sectionTitle, { color: theme.ink }])}>Stats</Text>
        <View style={styles.statsRow}>
          <View
            style={StyleSheet.flatten([
              styles.statBox,
              { backgroundColor: theme.surface, shadowColor: theme.shadow },
            ])}
          >
            <Text style={StyleSheet.flatten([styles.statValue, { color: theme.ink }])}>
              {vibeCount}
            </Text>
            <Text style={StyleSheet.flatten([styles.statLabel, { color: theme.muted }])}>
              Vibes
            </Text>
          </View>
          <View
            style={StyleSheet.flatten([
              styles.statBox,
              { backgroundColor: theme.surface, shadowColor: theme.shadow },
            ])}
          >
            <Text style={StyleSheet.flatten([styles.statValue, { color: theme.ink }])}>
              {spotCount}
            </Text>
            <Text style={StyleSheet.flatten([styles.statLabel, { color: theme.muted }])}>
              Spots
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <Link href="/submit" asChild>
          <TouchableOpacity
            style={StyleSheet.flatten([
              styles.submitButton,
              { backgroundColor: theme.accent.matcha },
            ])}
          >
            <Plus size={20} color={theme.ink} />
            <Text style={StyleSheet.flatten([styles.submitButtonText, { color: theme.ink }])}>
              Submit a Spot
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <LogOut size={20} color={theme.accent.peach} />
        <Text style={StyleSheet.flatten([styles.logoutText, { color: theme.accent.peach }])}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    padding: 40,
  },
  avatarAura: {
    width: 116,
    height: 116,
    borderRadius: 58,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "900",
  },
  titleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    gap: 6,
  },
  titleText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionsSection: {
    paddingHorizontal: 24,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderRadius: 24,
  },
  submitButtonText: {
    fontWeight: "900",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: "auto",
    marginBottom: 40,
  },
  logoutText: {
    fontWeight: "900",
    fontSize: 16,
  },
});
