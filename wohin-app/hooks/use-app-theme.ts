import { useColorScheme, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * Custom hook to get the current theme's color palette.
 * On Web, it returns stable CSS variables to avoid Firefox style crashes.
 * On Native, it returns the standard color objects.
 */
export function useAppTheme() {
  const colorScheme = useColorScheme();
  const themeName = colorScheme ?? 'light';
  
  // Web: Use CSS variables via react-native-css-interop style strings
  if (Platform.OS === 'web') {
    return {
      background: 'var(--background)',
      surface: 'var(--surface)',
      ink: 'var(--ink)',
      muted: 'var(--muted)',
      border: 'var(--border)',
      accent: {
        peach: 'var(--accent-peach)',
        matcha: 'var(--accent-matcha)',
        sunny: 'var(--accent-sunny)',
      },
      shadow: 'var(--shadow)',
      overlay: 'var(--overlay)',
      tint: 'var(--tint)',
      icon: 'var(--icon)',
      tabIconDefault: 'var(--tab-icon-default)',
      tabIconSelected: 'var(--tab-icon-selected)',
    };
  }

  // Native: Return raw colors
  return Colors[themeName];
}
