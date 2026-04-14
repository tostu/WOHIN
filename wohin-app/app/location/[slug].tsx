import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { api } from '@/lib/api';
import { VibeCheck } from '@/components/feedback/vibe-check';
import { Location, Activity } from '@/components/discovery/location-card';

export default function LocationDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [vibeHistory, setVibeHistory] = useState<any[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const loc = await api.get<Location>(`/api/v1/discovery/location/${slug}`);
        setLocation(loc);

        if (loc.activities.length > 0) {
          setSelectedActivityId(loc.activities[0].id);
        }

        const history = await api.get<any[]>(`/api/v1/feedback/location/${loc.id}`);
        setVibeHistory(history);
      } catch (e) {
        console.error('Failed to load location:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  const handleVibe = (vibe: string) => {
    const newVibe = {
      id: Math.random().toString(),
      vibe: vibe,
      createdAt: new Date().toISOString()
    };
    setVibeHistory(prev => [newVibe, ...prev]);
  };

  const vibeCounts = vibeHistory.reduce((acc: any, v) => {
    acc[v.vibe] = (acc[v.vibe] || 0) + 1;
    return acc;
  }, { sparkle: 0, fire: 0, chill: 0, nope: 0 });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffb7b2" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Location not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: location.name, headerTransparent: true, headerTintColor: '#fff' }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          {location.image ? (
            <Image source={{ uri: location.image }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={{ fontSize: 80 }}>🏙️</Text>
            </View>
          )}
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.name}>{location.name}</Text>
            <Text style={styles.address}>{location.address || 'Address coming soon'}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.activitiesScroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {location.activities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  onPress={() => setSelectedActivityId(activity.id)}
                  style={[
                    styles.activityButton,
                    selectedActivityId === activity.id ? styles.activeActivity : styles.inactiveActivity
                  ]}
                >
                  <Text>{activity.icon} {activity.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              {/* Svelte version has description field */}
              {(location as any).description || 'No description available yet.'}
            </Text>
          </View>

          {selectedActivityId && (
            <View style={styles.vibeCheckCard}>
              <VibeCheck
                locationId={location.id}
                activityId={selectedActivityId}
                onVibe={handleVibe}
              />
            </View>
          )}

          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>✨ Vibe History</Text>
            {vibeHistory.length === 0 ? (
              <Text style={styles.emptyHistory}>No vibe checks yet. Be the first to drop one! 💖</Text>
            ) : (
              <View style={styles.statsGrid}>
                {Object.entries(vibeCounts).map(([key, count]) => (
                  count as number > 0 ? (
                    <View key={key} style={styles.statBox}>
                      <Text style={styles.statEmoji}>
                        {key === 'sparkle' ? '✨' : key === 'fire' ? '🔥' : key === 'chill' ? '🧊' : '👎'}
                      </Text>
                      <Text style={styles.statCount}>{count as number}</Text>
                    </View>
                  ) : null
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefcf4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefcf4',
  },
  hero: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffb7b220',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  name: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  content: {
    backgroundColor: '#fefcf4',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -30,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  activitiesScroll: {
    marginBottom: 32,
  },
  activityButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    fontWeight: '700',
  },
  activeActivity: {
    backgroundColor: '#ffb7b2',
  },
  inactiveActivity: {
    backgroundColor: '#2c2b2910',
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c2b29',
    opacity: 0.8,
  },
  vibeCheckCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 8,
    marginBottom: 32,
    shadowColor: '#2c2b29',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#2c2b29',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2c2b29',
    marginBottom: 20,
  },
  emptyHistory: {
    fontSize: 14,
    color: '#8b8a87',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fefcf4',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statCount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2c2b29',
  },
});
