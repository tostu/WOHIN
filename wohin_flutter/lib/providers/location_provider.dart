import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';

class LocationState {
  final double? latitude;
  final double? longitude;
  final bool isLoading;
  final String? errorMessage;

  LocationState({
    this.latitude,
    this.longitude,
    this.isLoading = false,
    this.errorMessage,
  });

  LocationState copyWith({
    double? latitude,
    double? longitude,
    bool? isLoading,
    String? errorMessage,
  }) {
    return LocationState(
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class LocationNotifier extends StateNotifier<LocationState> {
  LocationNotifier() : super(LocationState(isLoading: true)) {
    requestLocation();
  }

  Future<void> requestLocation() async {
    state = state.copyWith(isLoading: true);
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        state = LocationState(
          errorMessage: 'Location services are disabled.',
          isLoading: false,
        );
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          state = LocationState(
            errorMessage: 'Location permission denied.',
            isLoading: false,
          );
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        state = LocationState(
          errorMessage: 'Location permissions are permanently denied.',
          isLoading: false,
        );
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
      );
      
      state = LocationState(
        latitude: position.latitude,
        longitude: position.longitude,
        isLoading: false,
      );
    } catch (e) {
      state = LocationState(
        errorMessage: e.toString(),
        isLoading: false,
      );
    }
  }
}

final locationProvider = StateNotifierProvider<LocationNotifier, LocationState>((ref) {
  return LocationNotifier();
});
