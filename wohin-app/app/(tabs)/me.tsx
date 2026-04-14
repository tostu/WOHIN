import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, LogOut } from "lucide-react-native";
import { useSession, signOut } from "@/lib/auth";
import { Link } from "expo-router";

export default function ProfileScreen() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <View style={styles.container} />;
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <User size={64} color="#ffb7b2" />
          <Text style={styles.title}>Join the Community</Text>
          <Text style={styles.description}>
            Sign in to drop vibes and share your favorite spots!
          </Text>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{session.user.name?.[0] || "U"}</Text>
        </View>
        <Text style={styles.userName}>{session.user.name}</Text>
        <Text style={styles.userEmail}>{session.user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Vibes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Spots</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <LogOut size={20} color="#ffb7b2" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2c2b29",
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#8b8a87",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#ffb7b2",
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ffb7b2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2c2b29",
  },
  userEmail: {
    fontSize: 14,
    color: "#8b8a87",
    fontWeight: "600",
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2c2b29",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#2c2b29",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2c2b29",
  },
  statLabel: {
    fontSize: 12,
    color: "#8b8a87",
    fontWeight: "700",
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
    color: "#ffb7b2",
    fontWeight: "900",
    fontSize: 16,
  },
});
