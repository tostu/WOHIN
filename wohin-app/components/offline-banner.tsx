import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Network from 'expo-network';
import { CloudOff } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsOffline(!state.isConnected || !state.isInternetReachable);
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: isOffline ? 0 : -100,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  }, [isOffline]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          paddingTop: Math.max(insets.top, 20),
          backgroundColor: theme.accent.peach,
          transform: [{ translateY }]
        }
      ]}
    >
      <View style={styles.content}>
        <CloudOff size={16} color="#fff" />
        <Text style={styles.text}>Nap Mode: You&apos;re currently offline. ✨</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
});
