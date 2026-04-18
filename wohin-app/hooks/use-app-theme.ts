import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * Custom hook to get the current theme's color palette.
 * Defaults to 'light' if colorScheme is null or undefined.
 */
export function useAppTheme() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  
  return Colors[theme];
}
