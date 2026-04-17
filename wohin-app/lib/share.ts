import { Share } from "react-native";
import { Location } from "@/components/discovery/location-card";

export async function shareLocation(location: Location) {
  try {
    await Share.share({
      title: location.name,
      message: `Check out ${location.name} on WOHIN!${location.address ? ` - ${location.address}` : ""}`,
      url: `wohinapp://location/${location.slug}`,
    });
  } catch {}
}
