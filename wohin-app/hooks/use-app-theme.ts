import { useColorScheme, Platform } from "react-native";
import { Colors } from "@/constants/theme";

/**
 * Custom hook to get the current theme's color palette.
 * On Web, it returns stable CSS variables to avoid Firefox style crashes.
 * On Native, it returns the standard color objects.
 */
export function useAppTheme() {
  const colorScheme = useColorScheme();
  const themeName = colorScheme ?? "light";

  return Colors[themeName];
}
