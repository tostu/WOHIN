import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Heart, Share2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';

const { width } = Dimensions.get('window');

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
          style={[styles.emojiCircle, { zIndex: 10 - i, marginLeft: i === 0 ? 0 : -8, borderColor: theme.surface, backgroundColor: theme.accent.peach + '40' }]}
        >
          <Text style={styles.emojiText}>{vibeEmojiMap[key]}</Text>
        </View>
      ))}
      {total > 3 && (
        <View style={[styles.countCircle, { marginLeft: -8, borderColor: theme.surface, backgroundColor: theme.accent.sunny + '60' }]}>
          <Text style={[styles.countText, { color: theme.ink }]}>+{total}</Text>
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
      <TouchableOpacity activeOpacity={0.9} style={styles.container}>
        <View style={[styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }]}>
          <View style={styles.imageContainer}>
            {location.image || (location.photos && location.photos[0]) ? (
              <Image
                source={location.image || location.photos?.[0]}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={[styles.imagePlaceholder, { backgroundColor: themeColor + '40' }]}>
                <MapPin size={48} color={themeColor} />
              </View>
            )}

            {primaryActivity && (
              <View style={[styles.vibeTag, { backgroundColor: themeColor }]}>
                <Text style={[styles.vibeTagText, { color: theme.ink }]}>{primaryActivity.name.toUpperCase()}</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.ink }]} numberOfLines={1}>{location.name}</Text>
              {location.rating != null && (
                <View style={[styles.ratingBadge, { backgroundColor: theme.accent.sunny + '40' }]}>
                  <Text style={[styles.ratingText, { color: theme.ink }]}>⭐ {location.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>

            <View style={styles.addressContainer}>
              <MapPin size={12} color={theme.muted} />
              <Text style={[styles.address, { color: theme.muted }]} numberOfLines={1}>
                {location.distance != null ? `${location.distance.toFixed(1)}km · ` : ''}
                {location.address || 'Berlin, Germany'}
              </Text>
            </View>

            <View style={styles.footer}>
              <FeedbackStack vibeCounts={location.vibeCounts} />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton, 
                    { backgroundColor: theme.accent.peach + '30' },
                    isFavorited && { backgroundColor: theme.accent.peach }
                  ]}
                  onPress={(e) => { e.stopPropagation(); onFavorite?.(location.id); }}
                >
                  <Heart size={20} color={isFavorited ? '#fff' : theme.ink} fill={isFavorited ? '#fff' : 'none'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.accent.peach + '30' }]}
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
