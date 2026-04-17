import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Heart, Share2 } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';

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
  coordinates?: { lat: number; lng: number };
  distance?: number;
  rating?: number;
  image?: string;
  photos?: string[];
  activities: Activity[];
  vibeCounts?: VibeCounts;
}

const themeMap: Record<string, string> = {
  matcha: '#a8e6cf',
  peach: '#ffb7b2',
  sunny: '#ffd97d',
};

const vibeEmojiMap: Record<string, string> = {
  sparkle: '✨',
  fire: '🔥',
  chill: '🧊',
  nope: '👎',
};

function FeedbackStack({ vibeCounts }: { vibeCounts?: VibeCounts }) {
  if (!vibeCounts) return <View style={styles.feedbackStack} />;

  const total = vibeCounts.sparkle + vibeCounts.fire + vibeCounts.chill + vibeCounts.nope;
  if (total === 0) return <View style={styles.feedbackStack} />;

  const active = (Object.entries(vibeCounts) as [string, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <View style={styles.feedbackStack}>
      {active.map(([key], i) => (
        <View
          key={key}
          style={[styles.emojiCircle, { zIndex: 10 - i, marginLeft: i === 0 ? 0 : -8 }]}
        >
          <Text style={styles.emojiText}>{vibeEmojiMap[key]}</Text>
        </View>
      ))}
      {total > 3 && (
        <View style={[styles.countCircle, { marginLeft: -8 }]}>
          <Text style={styles.countText}>+{total}</Text>
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
  const primaryActivity = location.activities[0];
  const themeColor = primaryActivity ? themeMap[primaryActivity.themeColor] || '#ffb7b2' : '#ffb7b2';

  return (
    <Link href={`/location/${location.slug}`} asChild>
      <TouchableOpacity activeOpacity={0.9} style={styles.container}>
        <View style={styles.card}>
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
                <Text style={styles.vibeTagText}>{primaryActivity.name.toUpperCase()}</Text>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>{location.name}</Text>
              {location.rating != null && (
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {location.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>

            <View style={styles.addressContainer}>
              <MapPin size={12} color="#2c2b2960" />
              <Text style={styles.address} numberOfLines={1}>
                {location.distance != null ? `${location.distance.toFixed(1)}km · ` : ''}
                {location.address || 'Berlin, Germany'}
              </Text>
            </View>

            <View style={styles.footer}>
              <FeedbackStack vibeCounts={location.vibeCounts} />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, isFavorited && styles.favoriteActive]}
                  onPress={(e) => { e.stopPropagation(); onFavorite?.(location.id); }}
                >
                  <Heart size={20} color={isFavorited ? '#fff' : '#2c2b29'} fill={isFavorited ? '#fff' : 'none'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={(e) => { e.stopPropagation(); onShare?.(location); }}
                >
                  <Share2 size={20} color="#2c2b29" />
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
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#2c2b29',
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
    color: '#2c2b29',
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
    color: '#2c2b29',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    backgroundColor: '#ffd97d40',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#2c2b29',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 12,
    color: '#2c2b2960',
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
    backgroundColor: '#ffb7b240',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  emojiText: {
    fontSize: 12,
  },
  countCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffd97d60',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  countText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#2c2b29',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffb7b230',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActive: {
    backgroundColor: '#ffb7b2',
  },
});
