import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '../ui/skeleton';
import { useAppTheme } from '@/hooks/use-app-theme';

export function LocationCardSkeleton() {
  const theme = useAppTheme();
  
  return (
    <View style={styles.container}>
      <View style={StyleSheet.flatten([styles.card, { backgroundColor: theme.surface, shadowColor: theme.shadow }])}>
        <View style={styles.imageContainer}>
          <Skeleton width={120} height={120} borderRadius={24} />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Skeleton width="70%" height={20} borderRadius={4} />
          </View>

          <View style={styles.addressContainer}>
            <Skeleton width="40%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
          </View>

          <View style={styles.footer}>
            <View style={styles.feedbackStack}>
               <Skeleton width={28} height={28} borderRadius={14} />
               <Skeleton width={28} height={28} borderRadius={14} style={{ marginLeft: -8 }} />
            </View>

            <View style={styles.actions}>
              <Skeleton width={36} height={36} borderRadius={18} />
              <Skeleton width={36} height={36} borderRadius={18} />
            </View>
          </View>
        </View>
      </View>
    </View>
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
  },
  content: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 4,
  },
  addressContainer: {
    marginBottom: 12,
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
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});
