import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorBoundary } from '@/components/error-boundary';
import { OfflineBanner } from '@/components/offline-banner';
import { useFirstLaunch } from '@/hooks/use-first-launch';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isFirstLaunch } = useFirstLaunch();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isFirstLaunch === null) return;

    const inOnboardingGroup = segments[0] === 'onboarding';

    if (isFirstLaunch && !inOnboardingGroup) {
      router.replace('/onboarding');
    } else if (!isFirstLaunch && inOnboardingGroup) {
      router.replace('/(tabs)');
    }
  }, [isFirstLaunch, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OfflineBanner />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="submit" options={{ title: 'Submit a Spot', presentation: 'modal' }} />
        <Stack.Screen name="login" options={{ title: 'Sign In', presentation: 'modal' }} />
        <Stack.Screen name="location/[slug]" options={{ title: 'Location', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}
