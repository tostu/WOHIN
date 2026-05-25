import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:url_launcher/url_launcher.dart';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import '../../theme/theme.dart';
import '../../models/location.dart';
import '../../providers/location_provider.dart';
import '../../providers/query_providers.dart';
import '../location_detail_screen.dart';
import '../../widgets/skeletons.dart';

class MapTab extends ConsumerStatefulWidget {
  const MapTab({super.key});

  @override
  ConsumerState<MapTab> createState() => _MapTabState();
}

class _MapTabState extends ConsumerState<MapTab> with TickerProviderStateMixin {
  final MapController _mapController = MapController();
  final PageController _pageController = PageController(viewportFraction: 0.88);
  int _activeIdx = 0;
  bool _ignorePageScroll = false;

  // Default to Berlin
  static final LatLng _berlinCenter = LatLng(52.5200, 13.4050);

  @override
  void dispose() {
    _mapController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _recenter(LatLng target, {double zoom = 14.0}) {
    // Standard animated map panning
    final latTween = Tween<double>(begin: _mapController.camera.center.latitude, end: target.latitude);
    final lngTween = Tween<double>(begin: _mapController.camera.center.longitude, end: target.longitude);
    final zoomTween = Tween<double>(begin: _mapController.camera.zoom, end: zoom);

    final controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 450),
    );

    final animation = CurvedAnimation(parent: controller, curve: Curves.easeInOut);

    controller.addListener(() {
      _mapController.move(
        LatLng(latTween.evaluate(animation), lngTween.evaluate(animation)),
        zoomTween.evaluate(animation),
      );
    });

    controller.forward().then((_) => controller.dispose());
  }

  void _onMarkerPressed(int idx, LatLng coord) {
    setState(() {
      _activeIdx = idx;
      _ignorePageScroll = true;
    });
    
    _pageController.animateToPage(
      idx,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    ).then((_) {
      _ignorePageScroll = false;
    });

    _recenter(coord, zoom: 14.5);
  }

  void _onPageChanged(int idx, List<Location> withCoords) {
    if (_ignorePageScroll) return;
    setState(() {
      _activeIdx = idx;
    });

    final loc = withCoords[idx];
    if (loc.coordinates != null) {
      _recenter(LatLng(loc.coordinates!.lat, loc.coordinates!.lng), zoom: 14.5);
    }
  }

  Color _getActivityColor(String themeColor, WohinColors colors) {
    switch (themeColor) {
      case 'matcha':
        return colors.matcha;
      case 'peach':
        return colors.peach;
      case 'sunny':
        return colors.sunny;
      default:
        return colors.peach;
    }
  }

  Future<void> _openExternalMaps(Location loc) async {
    final lat = loc.coordinates!.lat;
    final lng = loc.coordinates!.lng;
    final name = Uri.encodeComponent(loc.name);

    Uri url;
    if (kIsWeb) {
      url = Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng');
    } else if (Platform.isIOS) {
      url = Uri.parse('maps://0,0?q=$name@$lat,$lng');
    } else {
      url = Uri.parse('geo:$lat,$lng?q=$lat,$lng($name)');
    }

    if (await canLaunchUrl(url)) {
      await launchUrl(url);
    } else {
      // Fallback
      await launchUrl(Uri.parse('https://www.google.com/maps/search/?api=1&query=$lat,$lng'));
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final theme = Theme.of(context);

    // Watch location & map featured spots
    final gpsState = ref.watch(locationProvider);
    final userLat = gpsState.latitude;
    final userLng = gpsState.longitude;

    final featuredParams = FeaturedParams(userLat, userLng, 50);
    final locationsAsync = ref.watch(featuredLocationsProvider(featuredParams));

    return Scaffold(
      body: locationsAsync.when(
        loading: () => _buildLoadingState(colors),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(40),
            child: Text('Failed to load map spots: $err', style: TextStyle(color: colors.muted)),
          ),
        ),
        data: (locations) {
          final withCoords = locations.where((l) => l.coordinates != null).toList();
          final userLocationCoord = (userLat != null && userLng != null) ? LatLng(userLat, userLng) : null;
          final mapCenter = userLocationCoord ?? (withCoords.isNotEmpty ? LatLng(withCoords.first.coordinates!.lat, withCoords.first.coordinates!.lng) : _berlinCenter);

          return Stack(
            children: [
              // 1. Interactive map using flutter_map
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: mapCenter,
                  initialZoom: 13.0,
                  maxZoom: 18.0,
                  minZoom: 10.0,
                ),
                children: [
                  // OpenStreetMap Tile Layer (Adapts dynamically to Light/Dark themes using ColorFilter)
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.wohin.wohin_flutter',
                    tileBuilder: (context, tileWidget, tile) {
                      if (theme.brightness == Brightness.dark) {
                        return ColorFiltered(
                          colorFilter: const ColorFilter.matrix([
                            -0.2126, -0.7152, -0.0722,  0, 255, // Invert red
                            -0.2126, -0.7152, -0.0722,  0, 255, // Invert green
                            -0.2126, -0.7152, -0.0722,  0, 255, // Invert blue
                                  0,       0,       0,  1,   0,
                          ]),
                          child: tileWidget,
                        );
                      }
                      return tileWidget;
                    },
                  ),

                  // User Geolocation Indicator
                  if (userLocationCoord != null)
                    MarkerLayer(
                      markers: [
                        Marker(
                          point: userLocationCoord,
                          width: 24,
                          height: 24,
                          child: Container(
                            decoration: BoxDecoration(
                              color: colors.peach,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 3),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 4,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                  // Vibe Pin Markers Layer
                  MarkerLayer(
                    markers: [
                      for (int idx = 0; idx < withCoords.length; idx++)
                        Marker(
                          point: LatLng(withCoords[idx].coordinates!.lat, withCoords[idx].coordinates!.lng),
                          width: 44,
                          height: 44,
                          child: Builder(
                            builder: (context) {
                              final spot = withCoords[idx];
                              final primaryAct = spot.activities.isNotEmpty ? spot.activities.first : null;
                              final color = primaryAct != null
                                  ? _getActivityColor(primaryAct.themeColor, colors)
                                  : colors.peach;
                              final isActive = idx == _activeIdx;

                              return GestureDetector(
                                onTap: () => _onMarkerPressed(
                                  idx,
                                  LatLng(spot.coordinates!.lat, spot.coordinates!.lng),
                                ),
                                child: AnimatedScale(
                                  scale: isActive ? 1.25 : 1.0,
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeOutBack,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      color: color,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: colors.surface, width: 3),
                                      boxShadow: [
                                        BoxShadow(
                                          color: colors.shadow.withOpacity(0.25),
                                          blurRadius: 6,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      primaryAct?.icon ?? '📍',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                    ],
                  ),
                ],
              ),

              // 2. Floating Header Info overlay
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: colors.surface,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: colors.shadow.withOpacity(0.12),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  'BERLIN · ${withCoords.length} SPOTS',
                                  style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 2,
                                    color: colors.muted,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'On the Map',
                                  style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.5,
                                    color: colors.ink,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        
                        // Recenter user button
                        if (userLocationCoord != null)
                          GestureDetector(
                            onTap: () => _recenter(userLocationCoord, zoom: 14.0),
                            child: Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: colors.surface,
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: colors.shadow.withOpacity(0.12),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              alignment: Alignment.center,
                              child: Icon(LucideIcons.locate, color: colors.ink, size: 20),
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),

              // 3. Floating Snapping Snappy Cards slider
              Positioned(
                left: 0,
                right: 0,
                bottom: 16,
                child: SizedBox(
                  height: 110,
                  child: PageView.builder(
                    controller: _pageController,
                    onPageChanged: (idx) => _onPageChanged(idx, withCoords),
                    itemCount: withCoords.length,
                    itemBuilder: (context, idx) {
                      final loc = withCoords[idx];
                      final primaryAct = loc.activities.isNotEmpty ? loc.activities.first : null;
                      final accentColor = primaryAct != null
                          ? _getActivityColor(primaryAct.themeColor, colors)
                          : colors.peach;
                      final imageUrl = loc.image ?? (loc.photos != null && loc.photos!.isNotEmpty ? loc.photos!.first : null);

                      return GestureDetector(
                        onTap: () {
                          if (idx == _activeIdx) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => LocationDetailScreen(slug: loc.slug)),
                            );
                          } else {
                            _onMarkerPressed(
                              idx,
                              LatLng(loc.coordinates!.lat, loc.coordinates!.lng),
                            );
                          }
                        },
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: colors.surface,
                            borderRadius: BorderRadius.circular(28),
                            boxShadow: [
                              BoxShadow(
                                color: colors.shadow.withOpacity(0.12),
                                blurRadius: 16,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Row(
                            children: [
                              // Left Image Container
                              Container(
                                width: 56,
                                height: 56,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(18),
                                  color: accentColor.withOpacity(0.2),
                                ),
                                clipBehavior: Clip.antiAlias,
                                child: imageUrl != null && imageUrl.isNotEmpty
                                    ? Image.network(imageUrl, fit: BoxFit.cover)
                                    : Center(
                                        child: Text(
                                          primaryAct?.icon ?? '📍',
                                          style: const TextStyle(fontSize: 24),
                                        ),
                                      ),
                              ),
                              const SizedBox(width: 14),
                              
                              // Content Details
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      loc.name,
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w900,
                                        color: colors.ink,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    if (loc.address != null) ...[
                                      const SizedBox(height: 2),
                                      Row(
                                        children: [
                                          Icon(LucideIcons.map_pin, size: 11, color: colors.muted),
                                          const SizedBox(width: 4),
                                          Expanded(
                                            child: Text(
                                              '${loc.distance != null ? "${loc.distance!.toStringAsFixed(1)}km · " : ""}${loc.address}',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w600,
                                                color: colors.muted,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                    if (primaryAct != null) ...[
                                      const SizedBox(height: 4),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: accentColor.withOpacity(0.25),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          '${primaryAct.icon} ${primaryAct.name}',
                                          style: TextStyle(
                                            fontSize: 9,
                                            fontWeight: FontWeight.w700,
                                            color: colors.ink,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                              
                              // Navigation trigger button
                              GestureDetector(
                                onTap: () => _openExternalMaps(loc),
                                child: Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: accentColor,
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                  alignment: Alignment.center,
                                  child: const Icon(LucideIcons.navigation, color: Colors.white, size: 16),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildLoadingState(WohinColors colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('BERLIN · ALL SPOTS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: colors.muted)),
              const SizedBox(height: 12),
              Skeleton(width: MediaQuery.of(context).size.width * 0.5, height: 32, borderRadius: 8),
            ],
          ),
        ),
        const SizedBox(height: 32),
        const Expanded(
          child: SingleChildScrollView(
            child: Column(
              children: [
                LocationCardSkeleton(),
                LocationCardSkeleton(),
              ],
            ),
          ),
        )
      ],
    );
  }
}
