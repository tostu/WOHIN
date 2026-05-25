import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_provider.dart';
import '../models/activity.dart';
import '../models/location.dart';
import '../models/vibe_feedback.dart';
import '../models/curated_list.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';

// --- Parameters for Family Providers ---
class FeaturedParams {
  final double? lat;
  final double? lng;
  final int limit;
  FeaturedParams(this.lat, this.lng, this.limit);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FeaturedParams &&
          runtimeType == other.runtimeType &&
          lat == other.lat &&
          lng == other.lng &&
          limit == other.limit;

  @override
  int get hashCode => lat.hashCode ^ lng.hashCode ^ limit.hashCode;
}

class SearchParams {
  final String query;
  final double? lat;
  final double? lng;
  SearchParams(this.query, this.lat, this.lng);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SearchParams &&
          runtimeType == other.runtimeType &&
          query == other.query &&
          lat == other.lat &&
          lng == other.lng;

  @override
  int get hashCode => query.hashCode ^ lat.hashCode ^ lng.hashCode;
}

class FilterParams {
  final String activityId;
  final double? lat;
  final double? lng;
  FilterParams(this.activityId, this.lat, this.lng);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FilterParams &&
          runtimeType == other.runtimeType &&
          activityId == other.activityId &&
          lat == other.lat &&
          lng == other.lng;

  @override
  int get hashCode => activityId.hashCode ^ lat.hashCode ^ lng.hashCode;
}

// --- Query Providers (Stale-While-Revalidate Caching Notifiers) ---

// 1. Activities list query
class ActivitiesNotifier extends AsyncNotifier<List<Activity>> {
  @override
  Future<List<Activity>> build() async {
    final storage = ref.watch(storageServiceProvider);
    final cache = storage.getCachedResponse('activities');

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => Activity.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground();
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch();
      } catch (_) {
        return (cache.data as List)
            .map((item) => Activity.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch();
  }

  Future<List<Activity>> _fetch() async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);

    final response = await api.get('/api/v1/discovery/activities');
    final data = response.data as Map<String, dynamic>;
    final list = data['activities'] as List? ?? [];

    await storage.saveCachedResponse('activities', list);

    return list.map((item) => Activity.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      await storage.deleteCachedResponse('activities');
      final list = await _fetch();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground() async {
    try {
      final list = await _fetch();
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final activitiesProvider = AsyncNotifierProvider<ActivitiesNotifier, List<Activity>>(ActivitiesNotifier.new);

// 2. Featured locations query
class FeaturedLocationsNotifier extends FamilyAsyncNotifier<List<Location>, FeaturedParams> {
  @override
  Future<List<Location>> build(FeaturedParams params) async {
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'featured_locations_${params.lat}_${params.lng}_${params.limit}';
    final cache = storage.getCachedResponse(cacheKey);

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => Location.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground(params);
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch(params);
      } catch (_) {
        return (cache.data as List)
            .map((item) => Location.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch(params);
  }

  Future<List<Location>> _fetch(FeaturedParams params) async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'featured_locations_${params.lat}_${params.lng}_${params.limit}';

    final queryParams = <String, dynamic>{'limit': params.limit};
    if (params.lat != null && params.lng != null) {
      queryParams['lat'] = params.lat;
      queryParams['lng'] = params.lng;
    }

    final response = await api.get('/api/v1/discovery/featured', queryParameters: queryParams);
    final data = response.data as Map<String, dynamic>;
    final list = data['results'] as List? ?? [];

    await storage.saveCachedResponse(cacheKey, list);

    return list.map((item) => Location.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      final cacheKey = 'featured_locations_${arg.lat}_${arg.lng}_${arg.limit}';
      await storage.deleteCachedResponse(cacheKey);
      final list = await _fetch(arg);
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground(FeaturedParams params) async {
    try {
      final list = await _fetch(params);
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final featuredLocationsProvider = AsyncNotifierProvider.family<FeaturedLocationsNotifier, List<Location>, FeaturedParams>(
  FeaturedLocationsNotifier.new,
);

// 3. Curated lists query
class CuratedListsNotifier extends AsyncNotifier<List<CuratedList>> {
  @override
  Future<List<CuratedList>> build() async {
    final storage = ref.watch(storageServiceProvider);
    final cache = storage.getCachedResponse('curated_lists');

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => CuratedList.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground();
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch();
      } catch (_) {
        return (cache.data as List)
            .map((item) => CuratedList.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch();
  }

  Future<List<CuratedList>> _fetch() async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);

    final response = await api.get('/api/v1/discovery/lists');
    final data = response.data as Map<String, dynamic>;
    final list = data['results'] as List? ?? [];

    await storage.saveCachedResponse('curated_lists', list);

    return list.map((item) => CuratedList.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      await storage.deleteCachedResponse('curated_lists');
      final list = await _fetch();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground() async {
    try {
      final list = await _fetch();
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final curatedListsProvider = AsyncNotifierProvider<CuratedListsNotifier, List<CuratedList>>(CuratedListsNotifier.new);

// 4. Search locations query
class SearchLocationsNotifier extends FamilyAsyncNotifier<List<Location>, SearchParams> {
  @override
  Future<List<Location>> build(SearchParams params) async {
    if (params.query.trim().isEmpty) return const [];

    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'search_${params.query.trim()}_${params.lat}_${params.lng}';
    final cache = storage.getCachedResponse(cacheKey);

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => Location.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground(params);
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch(params);
      } catch (_) {
        return (cache.data as List)
            .map((item) => Location.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch(params);
  }

  Future<List<Location>> _fetch(SearchParams params) async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'search_${params.query.trim()}_${params.lat}_${params.lng}';

    final queryParams = <String, dynamic>{'q': params.query};
    if (params.lat != null && params.lng != null) {
      queryParams['lat'] = params.lat;
      queryParams['lng'] = params.lng;
    }

    final response = await api.get('/api/v1/discovery/search', queryParameters: queryParams);
    final data = response.data as Map<String, dynamic>;
    final list = data['results'] as List? ?? [];

    await storage.saveCachedResponse(cacheKey, list);

    return list.map((item) => Location.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      final cacheKey = 'search_${arg.query.trim()}_${arg.lat}_${arg.lng}';
      await storage.deleteCachedResponse(cacheKey);
      final list = await _fetch(arg);
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground(SearchParams params) async {
    try {
      final list = await _fetch(params);
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final searchLocationsProvider = AsyncNotifierProvider.family<SearchLocationsNotifier, List<Location>, SearchParams>(
  SearchLocationsNotifier.new,
);

// 5. Activity filtered locations query
class ActivityFilteredLocationsNotifier extends FamilyAsyncNotifier<List<Location>, FilterParams> {
  @override
  Future<List<Location>> build(FilterParams params) async {
    if (params.activityId.isEmpty) return const [];

    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'activity_${params.activityId}_${params.lat}_${params.lng}';
    final cache = storage.getCachedResponse(cacheKey);

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => Location.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground(params);
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch(params);
      } catch (_) {
        return (cache.data as List)
            .map((item) => Location.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch(params);
  }

  Future<List<Location>> _fetch(FilterParams params) async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'activity_${params.activityId}_${params.lat}_${params.lng}';

    final queryParams = <String, dynamic>{'activityId': params.activityId};
    if (params.lat != null && params.lng != null) {
      queryParams['lat'] = params.lat;
      queryParams['lng'] = params.lng;
    }

    final response = await api.get('/api/v1/discovery/search', queryParameters: queryParams);
    final data = response.data as Map<String, dynamic>;
    final list = data['results'] as List? ?? [];

    await storage.saveCachedResponse(cacheKey, list);

    return list.map((item) => Location.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      final cacheKey = 'activity_${arg.activityId}_${arg.lat}_${arg.lng}';
      await storage.deleteCachedResponse(cacheKey);
      final list = await _fetch(arg);
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground(FilterParams params) async {
    try {
      final list = await _fetch(params);
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final activityFilteredLocationsProvider = AsyncNotifierProvider.family<ActivityFilteredLocationsNotifier, List<Location>, FilterParams>(
  ActivityFilteredLocationsNotifier.new,
);

// 6. Location Detail query
class LocationDetailNotifier extends FamilyAsyncNotifier<Location, String> {
  @override
  Future<Location> build(String slug) async {
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'location_detail_$slug';
    final cache = storage.getCachedResponse(cacheKey);

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final location = Location.fromJson(cache.data as Map<String, dynamic>);

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground(slug);
        }
        return location;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch(slug);
      } catch (_) {
        return Location.fromJson(cache.data as Map<String, dynamic>);
      }
    }

    return _fetch(slug);
  }

  Future<Location> _fetch(String slug) async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'location_detail_$slug';

    final response = await api.get('/api/v1/discovery/location/$slug');
    final data = response.data as Map<String, dynamic>;

    await storage.saveCachedResponse(cacheKey, data);

    return Location.fromJson(data);
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      await storage.deleteCachedResponse('location_detail_$arg');
      final location = await _fetch(arg);
      state = AsyncValue.data(location);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground(String slug) async {
    try {
      final location = await _fetch(slug);
      state = AsyncValue.data(location);
    } catch (_) {}
  }
}

final locationDetailProvider = AsyncNotifierProvider.family<LocationDetailNotifier, Location, String>(
  LocationDetailNotifier.new,
);

// 7. Vibe History query
class VibeHistoryNotifier extends FamilyAsyncNotifier<List<VibeFeedback>, String> {
  @override
  Future<List<VibeFeedback>> build(String locationId) async {
    if (locationId.isEmpty) return const [];

    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'vibe_history_$locationId';
    final cache = storage.getCachedResponse(cacheKey);

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => VibeFeedback.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground(locationId);
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch(locationId);
      } catch (_) {
        return (cache.data as List)
            .map((item) => VibeFeedback.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch(locationId);
  }

  Future<List<VibeFeedback>> _fetch(String locationId) async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);
    final cacheKey = 'vibe_history_$locationId';

    final response = await api.get('/api/v1/feedback/location/$locationId');
    final list = response.data as List? ?? [];

    await storage.saveCachedResponse(cacheKey, list);

    return list.map((item) => VibeFeedback.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      await storage.deleteCachedResponse('vibe_history_$arg');
      final list = await _fetch(arg);
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground(String locationId) async {
    try {
      final list = await _fetch(locationId);
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final vibeHistoryProvider = AsyncNotifierProvider.family<VibeHistoryNotifier, List<VibeFeedback>, String>(
  VibeHistoryNotifier.new,
);

// 8. User Vibes query
class UserVibesNotifier extends AsyncNotifier<List<VibeFeedback>> {
  @override
  Future<List<VibeFeedback>> build() async {
    final storage = ref.watch(storageServiceProvider);
    final cache = storage.getCachedResponse('user_vibes');

    if (cache != null) {
      final cachedAt = DateTime.fromMillisecondsSinceEpoch(cache.cachedAt);
      final age = DateTime.now().difference(cachedAt);

      if (age < const Duration(hours: 24)) {
        final list = (cache.data as List)
            .map((item) => VibeFeedback.fromJson(item as Map<String, dynamic>))
            .toList();

        if (age >= const Duration(minutes: 5)) {
          _fetchInBackground();
        }
        return list;
      }

      // Cache > 24h: Try fetch, fallback to cache on error
      try {
        return await _fetch();
      } catch (_) {
        return (cache.data as List)
            .map((item) => VibeFeedback.fromJson(item as Map<String, dynamic>))
            .toList();
      }
    }

    return _fetch();
  }

  Future<List<VibeFeedback>> _fetch() async {
    final api = ref.watch(apiServiceProvider);
    final storage = ref.watch(storageServiceProvider);

    final response = await api.get('/api/v1/feedback/me');
    final list = response.data as List? ?? [];

    await storage.saveCachedResponse('user_vibes', list);

    return list.map((item) => VibeFeedback.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    try {
      final storage = ref.read(storageServiceProvider);
      await storage.deleteCachedResponse('user_vibes');
      final list = await _fetch();
      state = AsyncValue.data(list);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> _fetchInBackground() async {
    try {
      final list = await _fetch();
      state = AsyncValue.data(list);
    } catch (_) {}
  }
}

final userVibesProvider = AsyncNotifierProvider<UserVibesNotifier, List<VibeFeedback>>(UserVibesNotifier.new);

// --- Favorites Notifier (handles optimistic updates, local storage sync & API calls) ---
class FavoritesNotifier extends StateNotifier<AsyncValue<Set<String>>> {
  final ApiService _api;
  final StorageService _storage;

  FavoritesNotifier(this._api, this._storage) : super(const AsyncValue.loading()) {
    fetchFavorites();
  }

  Future<void> fetchFavorites() async {
    // Load local cache first to render instantly
    final localList = _storage.getLocalFavorites();
    state = AsyncValue.data(localList.toSet());

    try {
      final token = await _storage.getToken();
      if (token == null || token.isEmpty) return; // User not logged in, stick to local cache

      final response = await _api.get('/api/v1/favorites');
      final list = response.data as List? ?? [];
      final serverFavs = list.map((item) => (item['locationId'] ?? '').toString()).toSet();
      
      // Save back to local storage
      await _storage.saveLocalFavorites(serverFavs.toList());
      
      state = AsyncValue.data(serverFavs);
    } catch (e) {
      // Keep displaying local cache on network error
      state = AsyncValue.data(localList.toSet());
    }
  }

  Future<bool> toggleFavorite(String locationId) async {
    final currentVal = state.value ?? {};
    final exists = currentVal.contains(locationId);

    // 1. Optimistic Update
    final updated = Set<String>.from(currentVal);
    if (exists) {
      updated.remove(locationId);
    } else {
      updated.add(locationId);
    }
    state = AsyncValue.data(updated);
    await _storage.saveLocalFavorites(updated.toList());

    // 2. Server API Call (if logged in)
    try {
      final token = await _storage.getToken();
      if (token != null && token.isNotEmpty) {
        await _api.post('/api/v1/favorites/toggle', data: {'locationId': locationId});
        return true;
      }
      return false; // Toggle locally only
    } catch (e) {
      // Rollback to original value on network failure
      state = AsyncValue.data(currentVal);
      await _storage.saveLocalFavorites(currentVal.toList());
      return false;
    }
  }
}

final favoritesProvider = StateNotifierProvider<FavoritesNotifier, AsyncValue<Set<String>>>((ref) {
  final api = ref.watch(apiServiceProvider);
  final storage = ref.watch(storageServiceProvider);
  return FavoritesNotifier(api, storage);
});

// --- Vibe Mutation Helper ---
final vibeMutationProvider = Provider((ref) {
  final api = ref.watch(apiServiceProvider);
  return (String locationId, String activityId, String vibe) async {
    await api.post('/api/v1/feedback/vibe', data: {
      'locationId': locationId,
      'activityId': activityId,
      'vibe': vibe,
    });
    
    // Clean caches to ensure mutations propagate instantly on next fetches
    final storage = ref.read(storageServiceProvider);
    await storage.deleteCachedResponse('vibe_history_$locationId');
    await storage.deleteCachedResponse('user_vibes');
    await storage.clearCache(); // clear other cached lists since ratings might have updated
    
    // Invalidate queries so values refresh
    ref.invalidate(vibeHistoryProvider(locationId));
    ref.invalidate(userVibesProvider);
    ref.invalidate(featuredLocationsProvider);
  };
});
