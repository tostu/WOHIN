import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import { VibeCheck } from '@/components/feedback/vibe-check';
import { PortableText } from '@/components/portable-text';
import { Skeleton } from '@/components/ui/skeleton';
import { Share2 } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useLocationDetail, useVibeHistory } from '@/hooks/use-queries';

export default function LocationDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const theme = useAppTheme();

  // Load location detail and vibe history via queries
  const { data: location, isLoading: isLoadingLocation } = useLocationDetail(slug);
  const { data: vibeHistory = [] } = useVibeHistory(location?.id ?? "");

  useEffect(() => {
    if (location && location.activities.length > 0) {
      const hasActivity = location.activities.some(a => a.id === selectedActivityId);
      if (!hasActivity) {
        setSelectedActivityId(location.activities[0].id);
      }
    }
  }, [location, slug, selectedActivityId]);

  const vibeCounts = vibeHistory.reduce((acc: any, v) => {
    acc[v.vibe] = (acc[v.vibe] || 0) + 1;
    return acc;
  }, { sparkle: 0, fire: 0, chill: 0, nope: 0 });

  if (isLoadingLocation) {
    return (
      <View className="flex-1" style={{ backgroundColor: theme.background }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Skeleton width="100%" height={400} borderRadius={0} />
          <View className="rounded-t-[40px] -mt-7 pt-8 px-6" style={{ backgroundColor: theme.background }}>
            <View className="flex-row gap-2 mb-8">
              <Skeleton width={100} height={40} borderRadius={20} />
              <Skeleton width={100} height={40} borderRadius={20} />
            </View>
            <Skeleton width="100%" height={20} style={{ marginBottom: 12 }} />
            <Skeleton width="90%" height={20} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={150} borderRadius={32} style={{ marginTop: 20 }} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!location) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: theme.background }}>
        <Text style={{ color: theme.ink }}>Location not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <Stack.Screen options={{
        title: location.name,
        headerTransparent: true,
        headerTintColor: '#fff',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => Share.share({
              title: location.name,
              message: `Check out ${location.name} on WOHIN!${location.address ? ` - ${location.address}` : ''}`,
              url: `wohinapp://location/${location.slug}`,
            })}
            className="p-2"
          >
            <Share2 size={22} color="#fff" />
          </TouchableOpacity>
        ),
      }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="h-[400px] w-full relative">
          {location.image ? (
            <Image source={location.image} className="w-full h-full" contentFit="cover" />
          ) : (
            <View className="w-full h-full items-center justify-center" style={{ backgroundColor: theme.accent.peach + '20' }}>
              <Text className="text-[80px]">🏙️</Text>
            </View>
          )}
          <View className="absolute inset-0" style={{ backgroundColor: theme.overlay }} />
          <View className="absolute bottom-10 left-6 right-6">
            <Text className="text-4xl font-black text-white tracking-tighter">{location.name}</Text>
            <Text className="text-base font-semibold text-white/90 mt-1">{location.address || 'Address coming soon'}</Text>
          </View>
        </View>

        <View className="rounded-t-[40px] -mt-7 pt-8 px-6" style={{ backgroundColor: theme.background }}>
          <View className="mb-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {location.activities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  onPress={() => setSelectedActivityId(activity.id)}
                  className="px-5 py-2.5 rounded-[20px]"
                  style={StyleSheet.flatten([
                    selectedActivityId === activity.id 
                      ? { backgroundColor: theme.accent.peach } 
                      : { backgroundColor: theme.border }
                  ])}
                >
                  <Text style={{ color: theme.ink }}>{activity.icon} {activity.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="mb-8">
            {Array.isArray((location as any).description) ? (
              <PortableText value={(location as any).description} />
            ) : (
              <Text className="text-base leading-6 opacity-80" style={{ color: theme.ink }}>No description available yet.</Text>
            )}
          </View>

          {selectedActivityId && (
            <View className="rounded-[32px] p-2 mb-8 shadow-sm" style={{ backgroundColor: theme.surface, shadowColor: theme.shadow }}>
              <VibeCheck
                locationId={location.id}
                activityId={selectedActivityId}
                onVibe={() => {}}
              />
            </View>
          )}

          <View className="rounded-[32px] p-6 mb-8 shadow-sm" style={{ backgroundColor: theme.surface, shadowColor: theme.shadow }}>
            <Text className="text-xl font-black mb-5" style={{ color: theme.ink }}>✨ Vibe History</Text>
            {vibeHistory.length === 0 ? (
              <Text className="text-sm italic" style={{ color: theme.muted }}>No vibe checks yet. Be the first to drop one! 💖</Text>
            ) : (
              <View className="flex-row flex-wrap gap-3">
                {Object.entries(vibeCounts).map(([key, count]) => (
                  count as number > 0 ? (
                    <View key={key} className="flex-1 min-w-[45%] rounded-3xl p-4 items-center justify-center" style={{ backgroundColor: theme.background }}>
                      <Text className="text-2xl mb-1">
                        {key === 'sparkle' ? '✨' : key === 'fire' ? '🔥' : key === 'chill' ? '🧊' : '👎'}
                      </Text>
                      <Text className="text-lg font-black" style={{ color: theme.ink }}>{count as number}</Text>
                    </View>
                  ) : null
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

