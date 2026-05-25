/**
 * WOHIN Theme Constants
 * Defines the color palette and typography for the app.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    background: "#fefcf4",
    surface: "#ffffff",
    ink: "#2c2b29",
    muted: "#8b8a87",
    border: "rgba(44, 43, 41, 0.1)",
    accent: {
      peach: "#ffb7b2",
      matcha: "#a8e6cf",
      sunny: "#ffd97d",
    },
    shadow: "#2c2b29",
    overlay: "rgba(44, 43, 41, 0.5)",
    tint: "#2c2b29",
    icon: "#2c2b29",
    tabIconDefault: "#8b8a87",
    tabIconSelected: "#2c2b29",
  },
  dark: {
    background: "#1a1918",
    surface: "#2c2b29",
    ink: "#fefcf4",
    muted: "#a8a7a4",
    border: "rgba(254, 252, 244, 0.15)",
    accent: {
      peach: "#ffb7b2", // Accents stay vibrant in dark mode
      matcha: "#a8e6cf",
      sunny: "#ffd97d",
    },
    shadow: "#000000",
    overlay: "rgba(0, 0, 0, 0.7)",
    tint: "#fefcf4",
    icon: "#fefcf4",
    tabIconDefault: "#a8a7a4",
    tabIconSelected: "#fefcf4",
  },
};

/**
 * Appends an alpha value to a hex color string.
 * @param hex The hex color string (e.g., '#ffb7b2')
 * @param alpha The alpha value as a percentage hex string (e.g., '20' for 20%)
 */
export function withAlpha(hex: string, alpha: string) {
  if (!hex.startsWith("#")) return hex;
  return `${hex}${alpha}`;
}

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
