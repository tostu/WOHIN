import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { Platform } from "react-native";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function requestPermissions() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setLoading(false);
          return;
        }

        // On web, sometimes it's better to use getCurrentPositionAsync directly
        // but watchPositionAsync is also fine.
        const currentLoc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLoc.coords.latitude,
          longitude: currentLoc.coords.longitude,
        });
      } catch (err) {
        setErrorMsg("Failed to get location");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    requestPermissions();
  }, []);

  return { location, errorMsg, loading };
}
