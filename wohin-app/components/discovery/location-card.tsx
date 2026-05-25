import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Heart, Share2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';


export interface Activity {
  id: string;
  name: string;
  slug: string;
  themeColor: 'matcha' | 'peach' | 'sunny';
  icon?: string;
}

export interface VibeCounts {
  sparkle: number;
  fire: number;
  chill: number;
  nope: number;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  address?: string;
  hours?: string;
  coordinates?: { lat: number; lng: number };
  distance?: number;
  rating?: number;
  image?: string;
  photos?: string[];
  activities: Activity[];
  vibeCounts?: VibeCounts;
}

const vibeEmojiMap: Record<string, string> = {
  sparkle: '✨',
  fire: '🔥',
  chill: '🧊',
  nope: '👎',
};

export function FeedbackStack({ vibeCounts }: { vibeCounts?: VibeCounts }) {
  const theme = useAppTheme();
  if (!vibeCounts) return <View style={styles.feedbackStack} />;

  const sparkle = vibeCounts.sparkle || 0;
  const fire = vibeCounts.fire || 0;
  const chill = vibeCounts.chill || 0;
  const nope = vibeCounts.nope || 0;
  
  const total = sparkle + fire + chill + nope;
  if (total === 0) return <View style={styles.feedbackStack} />;

  const active = (Object.entries(vibeCounts) as [string, number][])
    .filter(([key, count]) => count > 0 && vibeEmojiMap[key])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <View style={styles.feedbackStack}>
      {active.map(([key], i) => (
        <View
          key={key}
          style={StyleSheet.flatten([styles.emojiCircle, { zIndex: 10 - i, marginLeft: i === 0 ? 0 : -8, borderColor: theme.surface, backgroundColor: theme.accent.peach + '40' }])}
        >
          <Text style={styles.emojiText}>{vibeEmojiMap[key]}</Text>
        </View>
      ))}
      {total > 3 && (
        <View style={StyleSheet.flatten([styles.countCircle, { marginLeft: -8, borderColor: theme.surface, backgroundColor: theme.accent.sunny + '60' }])}>
          <Text style={StyleSheet.flatten([styles.countText, { color: theme.ink }])}>+{total}</Text>
        </View>
      )}
    </View>
  );
}

interface LocationCardProps {
  location: Location;
  isFavorited?: boolean;
  onFavorite?: (locationId: string) => void;
  onShare?: (location: Location) => void;
}

export function LocationCard({ location, isFavorited, onFavorite, onShare }: LocationCardProps) {
  const theme = useAppTheme();
  
  const themeMap: Record<string, string> = {
    matcha: theme.accent.matcha,
    peach: theme.accent.peach,
    sunny: theme.accent.sunny,
  };

  const primaryActivity = location.activities[0];
  const themeColor = primaryActivity ? themeMap[primaryActivity.themeColor] || theme.accent.peach : theme.accent.peach;

  return (
    <Link href={`/location/${location.slug}`} asChild>
      <TouchableOpacity activeOpacity={0.9} className="mb-6 px-5">
        <View className="rounded-[32px] p-4 flex-row shadow-lg" style={{ backgroundColor: theme.surface, shadowColor: theme.shadow }}>
          <View className="w-[120px] h-[120px] rounded-3xl overflow-hidden relative">
            {location.image || (location.photos && location.photos[0]) ? (
              <Image
                source={location.image || location.photos?.[0]}
                className="w-full h-full"
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View className="w-full h-full items-center justify-center" style={{ backgroundColor: themeColor + '40' }}>
                <MapPin size={48} color={themeColor} />
              </View>
            )}

            {primaryActivity && (
              <View className="absolute bottom-2 left-2 px-2 py-1 rounded-xl shadow-md" style={{ backgroundColor: themeColor }}>
                <Text className="text-[8px] font-black tracking-widest" style={{ color: theme.ink }}>{primaryActivity.name.toUpperCase()}</Text>
              </View>
            )}
          </View>

          <View className="flex-1 ml-4 justify-center">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-lg font-black flex-1 mr-2" style={{ color: theme.ink }} numberOfLines={1}>{location.name}</Text>
              {location.rating != null && (
                <View className="px-1.5 py-0.5 rounded-xl" style={{ backgroundColor: theme.accent.sunny + '40' }}>
                  <Text className="text-[10px] font-black" style={{ color: theme.ink }}>⭐ {location.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center mb-3">
              <MapPin size={12} color={theme.muted} />
              <Text className="text-[12px] ml-1 font-medium" style={{ color: theme.muted }} numberOfLines={1}>
                {location.distance != null ? `${location.distance.toFixed(1)}km · ` : ''}
                {location.address || 'Berlin, Germany'}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <FeedbackStack vibeCounts={location.vibeCounts} />

              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={StyleSheet.flatten([
                    { backgroundColor: theme.accent.peach + '30' },
                    isFavorited && { backgroundColor: theme.accent.peach }
                  ])}
                  onPress={(e) => { e.stopPropagation(); onFavorite?.(location.id); }}
                >
                  <Heart size={20} color={isFavorited ? '#fff' : theme.ink} fill={isFavorited ? '#fff' : 'none'} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-9 h-9 rounded-full items-center justify-center"
                  style={{ backgroundColor: theme.accent.peach + '30' }}
                  onPress={(e) => { e.stopPropagation(); onShare?.(location); }}
                >
                  <Share2 size={20} color={theme.ink} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 32,
    padding: 16,
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vibeTag: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  vibeTagText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '900',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 12,
  },
  countCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  countText: {
    fontSize: 8,
    fontWeight: '900',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
