import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFirstLaunch } from '@/hooks/use-first-launch';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Sparkles, Map, Heart, ArrowRight } from 'lucide-react-native';
import Animated, { 
  FadeInRight, 
  FadeOutLeft
} from 'react-native-reanimated';

const slides = [
  {
    id: 1,
    title: 'Welcome to WOHIN',
    description: 'Find the perfect spot for your next discovery, curated by the community.',
    icon: Map,
    color: 'matcha'
  },
  {
    id: 2,
    title: 'Drop Vibes',
    description: 'Share how a place feels. Sparkly? Chilled? Let others know the vibe.',
    icon: Sparkles,
    color: 'peach'
  },
  {
    id: 3,
    title: 'Your City, Radiant',
    description: 'Berlin is just the beginning. Join us in mapping the most vibrant corners.',
    icon: Heart,
    color: 'sunny'
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { completeOnboarding } = useFirstLaunch();
  const router = useRouter();
  const theme = useAppTheme();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding().then(() => {
        router.replace('/(tabs)');
      });
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const accentColor = slide.color === 'matcha' 
    ? theme.accent.matcha 
    : slide.color === 'peach' 
      ? theme.accent.peach 
      : theme.accent.sunny;

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.container, { backgroundColor: theme.background }])}>
      <View style={styles.content}>
        <Animated.View
          key={`slide-${slide.id}`}
          entering={Platform.OS !== 'web' ? FadeInRight.duration(400) : undefined}
          exiting={Platform.OS !== 'web' ? FadeOutLeft.duration(400) : undefined}
          style={styles.slide}
        >
          <View style={StyleSheet.flatten([styles.iconContainer, { backgroundColor: accentColor + '20' }])}>
            <Icon size={80} color={accentColor} />
          </View>
          
          <Text style={StyleSheet.flatten([styles.title, { color: theme.ink }])}>{slide.title}</Text>
          <Text style={StyleSheet.flatten([styles.description, { color: theme.muted }])}>{slide.description}</Text>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((_, i) => (
              <View 
                key={i} 
                style={StyleSheet.flatten([
                  styles.dot, 
                  { backgroundColor: i === currentSlide ? accentColor : theme.border },
                  i === currentSlide && { width: 24 }
                ])} 
              />
            ))}
          </View>

          <TouchableOpacity 
            style={StyleSheet.flatten([styles.button, { backgroundColor: theme.ink }])} 
            onPress={handleNext}
          >
            <Text style={StyleSheet.flatten([styles.buttonText, { color: theme.background }])}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={20} color={theme.background} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  slide: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    gap: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
  },
});
