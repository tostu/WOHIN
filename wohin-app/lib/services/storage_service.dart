import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  final _secureStorage = const FlutterSecureStorage();
  late final SharedPreferences _prefs;

  StorageService._();

  static Future<StorageService> init() async {
    final instance = StorageService._();
    instance._prefs = await SharedPreferences.getInstance();
    return instance;
  }

  // --- Session Token ---
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: 'auth_token', value: token);
  }

  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'auth_token');
  }

  Future<void> deleteToken() async {
    await _secureStorage.delete(key: 'auth_token');
  }

  // --- Onboarding / First Launch ---
  bool getIsFirstLaunch() {
    return _prefs.getBool('is_first_launch') ?? true;
  }

  Future<void> setIsFirstLaunch(bool value) async {
    await _prefs.setBool('is_first_launch', value);
  }

  // --- Favorites Local Fallback ---
  List<String> getLocalFavorites() {
    return _prefs.getStringList('local_favorites') ?? [];
  }

  Future<void> saveLocalFavorites(List<String> favorites) async {
    await _prefs.setStringList('local_favorites', favorites);
  }

  // --- Generic API Response Caching (stale-while-revalidate) ---
  CacheEntry? getCachedResponse(String key) {
    final str = _prefs.getString('cache_$key');
    if (str == null) return null;
    try {
      final json = jsonDecode(str) as Map<String, dynamic>;
      return CacheEntry.fromJson(json);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveCachedResponse(String key, dynamic data) async {
    final entry = CacheEntry(
      cachedAt: DateTime.now().millisecondsSinceEpoch,
      data: data,
    );
    await _prefs.setString('cache_$key', jsonEncode(entry.toJson()));
  }

  Future<void> clearCache() async {
    final keys = _prefs.getKeys();
    for (final key in keys) {
      if (key.startsWith('cache_')) {
        await _prefs.remove(key);
      }
    }
  }

  Future<void> deleteCachedResponse(String key) async {
    await _prefs.remove('cache_$key');
  }
}

class CacheEntry {
  final int cachedAt;
  final dynamic data;

  CacheEntry({required this.cachedAt, required this.data});

  Map<String, dynamic> toJson() => {
        'cachedAt': cachedAt,
        'data': data,
      };

  factory CacheEntry.fromJson(Map<String, dynamic> json) => CacheEntry(
        cachedAt: json['cachedAt'] as int,
        data: json['data'],
      );
}
