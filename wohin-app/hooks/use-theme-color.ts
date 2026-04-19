import { useColorScheme, Platform } from 'react-native';
import { useAppTheme } from './use-app-theme';
import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];
  const appTheme = useAppTheme();

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // This helper usually expects flat keys. Accent is nested.
    // For now, we return the value from our unified hook.
    // @ts-ignore - accent is nested in Colors but flat mapping might be expected here
    return appTheme[colorName];
  }
}
