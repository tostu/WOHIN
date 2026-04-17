import Constants from "expo-constants";
import { Platform } from "react-native";

function getApiUrl() {
  // 1. For web: usually localhost:8787 or whatever is in window.location
  if (Platform.OS === "web") {
    return "http://localhost:8787";
  }

  // 2. For native/Expo Go: we need the local IP of the machine
  // Expo Constants helpfully provides the dev machine's host URI
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
  if (debuggerHost) {
    return `http://${debuggerHost}:8787`;
  }

  // 3. Fallback: hardcoded IP if needed, but the dynamic one is better
  return "http://192.168.178.45:8787"; 
}

export const API_URL = getApiUrl();
