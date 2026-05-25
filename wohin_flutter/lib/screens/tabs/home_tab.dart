import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:share_plus/share_plus.dart'; // We'll mock sharing if package not loaded, or use standard share
import '../../theme/theme.dart';
import '../../models/location.dart';
import '../../models/activity.dart';
import '../../providers/location_provider.dart';
import '../../providers/query_providers.dart';
import '../../widgets/location_card.dart';
import '../../widgets/skeletons.dart';
import '../../widgets/feedback_stack.dart';
import '../location_detail_screen.dart';

class HomeTab extends ConsumerStatefulWidget {
  const HomeTab({super.key});

  @override
  ConsumerState<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends ConsumerState<HomeTab> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = "";
  String? _selectedActivityId;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _clearSearch() {
    setState(() {
      _searchController.clear();
      _searchQuery = "";
    });
  }

  void _onActivityPressed(String? activityId) {
    setState(() {
      if (_selectedActivityId == activityId) {
        _selectedActivityId = null;
      } else {
        _selectedActivityId = activityId;
      }
      _searchController.clear();
      _searchQuery = "";
    });
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
        return colors.sunny;
    }
  }

  void _shareLocation(Location loc) {
    Share.share(
      'Check out ${loc.name} on WOHIN!${loc.address != null ? " - ${loc.address}" : ""}',
      subject: 'WOHIN Spot Discovery',
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;

    // Watch dependencies
    final gpsState = ref.watch(locationProvider);
    final userLat = gpsState.latitude;
    final userLng = gpsState.longitude;

    // 1. Fetch activities
    final activitiesAsync = ref.watch(activitiesProvider);

    // 2. Fetch featured locations
    final featuredParams = FeaturedParams(userLat, userLng, 10);
    final featuredAsync = ref.watch(featuredLocationsProvider(featuredParams));

    // 3. Fetch search results (if query is active)
    final isSearching = _searchQuery.trim().isNotEmpty;
    final searchParams = SearchParams(_searchQuery, userLat, userLng);
    final searchAsync = isSearching
        ? ref.watch(searchLocationsProvider(searchParams))
        : const AsyncValue<List<Location>>.data([]);

    // 4. Fetch activity-filtered results (if selected)
    final isFiltering = _selectedActivityId != null;
    final filterParams = FilterParams(_selectedActivityId ?? "", userLat, userLng);
    final filterAsync = isFiltering
        ? ref.watch(activityFilteredLocationsProvider(filterParams))
        : const AsyncValue<List<Location>>.data([]);

    // Pull to refresh action
    Future<void> handleRefresh() async {
      final refreshes = <Future<void>>[
        ref.read(activitiesProvider.notifier).refresh(),
        ref.read(featuredLocationsProvider(featuredParams).notifier).refresh(),
      ];
      if (isSearching) {
        refreshes.add(ref.read(searchLocationsProvider(searchParams).notifier).refresh());
      }
      if (isFiltering) {
        refreshes.add(ref.read(activityFilteredLocationsProvider(filterParams).notifier).refresh());
      }
      await Future.wait(refreshes);
    }

    final isLoadingInitial = activitiesAsync.isLoading || featuredAsync.isLoading;
    final hasError = (activitiesAsync.hasError || featuredAsync.hasError) &&
        !(activitiesAsync.hasValue && featuredAsync.hasValue);

    return Scaffold(
      body: SafeArea(
        child: isLoadingInitial
            ? _buildLoadingState(colors)
            : hasError
                ? _buildErrorState(colors, handleRefresh)
                : RefreshIndicator(
                    onRefresh: handleRefresh,
                    color: colors.peach,
                    backgroundColor: colors.surface,
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header
                          Padding(
                            padding: const EdgeInsets.only(left: 20, right: 20, top: 20, bottom: 16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'BERLIN · TODAY',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 2,
                                    color: colors.muted,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                RichText(
                                  text: TextSpan(
                                    style: TextStyle(
                                      fontSize: 36,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -1,
                                      color: colors.ink,
                                      fontFamily: 'Outfit',
                                    ),
                                    children: const [
                                      TextSpan(text: 'Whatcha '),
                                      TextSpan(
                                        text: 'wanna',
                                        style: TextStyle(fontStyle: FontStyle.italic),
                                      ),
                                      TextSpan(text: ' do?'),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Search Bar
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            child: Container(
                              decoration: BoxDecoration(
                                color: colors.surface,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: colors.border, width: 1),
                                boxShadow: [
                                  BoxShadow(
                                    color: colors.shadow.withOpacity(0.03),
                                    blurRadius: 10,
                                    offset: const Offset(0, 2),
                                  )
                                ],
                              ),
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              child: Row(
                                children: [
                                  Icon(LucideIcons.search, size: 18, color: colors.muted),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: TextField(
                                      controller: _searchController,
                                      style: TextStyle(color: colors.ink, fontWeight: FontWeight.w600),
                                      decoration: InputDecoration(
                                        hintText: 'Search spots...',
                                        hintStyle: TextStyle(color: colors.muted),
                                        border: InputBorder.none,
                                        isDense: true,
                                        contentPadding: const EdgeInsets.symmetric(vertical: 14),
                                      ),
                                      onChanged: (val) {
                                        setState(() {
                                          _searchQuery = val;
                                          _selectedActivityId = null;
                                        });
                                      },
                                    ),
                                  ),
                                  if (_searchQuery.isNotEmpty)
                                    GestureDetector(
                                      onTap: _clearSearch,
                                      child: Icon(LucideIcons.x, size: 18, color: colors.muted),
                                    ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Activity Pills (always visible)
                          _buildActivityPills(colors, activitiesAsync.value ?? []),
                          const SizedBox(height: 10),

                          // Results or Main Body
                          (isSearching || isFiltering)
                              ? _buildResultsView(
                                  colors,
                                  isSearching ? searchAsync : filterAsync,
                                  isSearching,
                                  activitiesAsync.value ?? [],
                                )
                              : _buildDefaultView(colors, featuredAsync.value ?? []),
                        ],
                      ),
                    ),
                  ),
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
              Text('BERLIN · TODAY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: colors.muted)),
              const SizedBox(height: 12),
              Skeleton(width: MediaQuery.of(context).size.width * 0.7, height: 40, borderRadius: 8),
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
                LocationCardSkeleton(),
              ],
            ),
          ),
        )
      ],
    );
  }

  Widget _buildErrorState(WohinColors colors, Future<void> Function() onRetry) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('⚡', style: TextStyle(fontSize: 64)),
            const SizedBox(height: 24),
            Text(
              'Signal Lost',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: colors.ink),
            ),
            const SizedBox(height: 12),
            Text(
              'Unable to reach the magic. Check your connection!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: colors.muted),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.peach,
                foregroundColor: Colors.white,
                minimumSize: const Size(160, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              onPressed: onRetry,
              child: const Text('Try Again', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultsView(WohinColors colors, AsyncValue<List<Location>> resultAsync, bool isSearchMode, List<Activity> activities) {
    return resultAsync.when(
      loading: () => const Padding(
        padding: EdgeInsets.only(top: 20),
        child: Column(
          children: [
            LocationCardSkeleton(),
            LocationCardSkeleton(),
          ],
        ),
      ),
      error: (err, _) => Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Text('Error loading results: $err', style: TextStyle(color: colors.muted, fontWeight: FontWeight.w600)),
        ),
      ),
      data: (results) {
        final title = isSearchMode
            ? '${results.length} result${results.length != 1 ? "s" : ""} for "$_searchQuery"'
            : '${results.length} result${results.length != 1 ? "s" : ""} for ${activities.firstWhere((a) => a.id == _selectedActivityId, orElse: () => Activity(id: '', name: 'Selected mood', slug: '', themeColor: 'peach')).name}';

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 20, right: 20, bottom: 16),
              child: Text(
                title,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: colors.ink),
              ),
            ),
            if (results.isEmpty)
              Padding(
                padding: const EdgeInsets.all(40),
                child: Center(
                  child: Text(
                    'No spots found. Try a different mood! ✨',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: colors.muted),
                  ),
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: results.length,
                itemBuilder: (context, idx) => LocationCard(
                  location: results[idx],
                  onShare: () => _shareLocation(results[idx]),
                ),
              ),
            const SizedBox(height: 100),
          ],
        );
      },
    );
  }

  Widget _buildActivityPills(WohinColors colors, List<Activity> activities) {
    return SizedBox(
      height: 100,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        itemCount: activities.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            // "All" pill
            final isSelected = _selectedActivityId == null;
            return Padding(
              padding: const EdgeInsets.only(right: 12),
              child: ChoiceChip(
                label: const Text(
                  'All',
                  maxLines: 1,
                  softWrap: false,
                  overflow: TextOverflow.visible,
                ),
                selected: isSelected,
                onSelected: (_) => _onActivityPressed(null),
                labelStyle: TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  color: isSelected ? Colors.white : colors.ink,
                  height: 1.0,
                ),
                backgroundColor: colors.surface,
                selectedColor: colors.peach,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(30),
                  side: BorderSide(color: isSelected ? colors.peach : colors.border, width: 2),
                ),
                showCheckmark: false,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              ),
            );
          }

          // Activity pill
          final act = activities[index - 1];
          final isSelected = _selectedActivityId == act.id;
          final actColor = _getActivityColor(act.themeColor, colors);

          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ChoiceChip(
              avatar: act.icon != null
                  ? Text(
                      act.icon!,
                      style: const TextStyle(fontSize: 20, height: 1.0),
                    )
                  : null,
              label: Text(
                act.name,
                maxLines: 1,
                softWrap: false,
                overflow: TextOverflow.visible,
              ),
              selected: isSelected,
              onSelected: (_) => _onActivityPressed(act.id),
              labelStyle: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 16,
                color: isSelected ? Colors.white : colors.ink,
                height: 1.0,
              ),
              backgroundColor: colors.surface,
              selectedColor: actColor,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
                side: BorderSide(color: isSelected ? actColor : colors.border, width: 2),
              ),
              showCheckmark: false,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDefaultView(WohinColors colors, List<Location> locations) {
    final newArrivals = locations.take(3).toList();
    final trendingSpots = locations.skip(3).take(4).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Trending Section
        if (trendingSpots.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Trending',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: colors.ink),
                ),
                Text(
                  'See all',
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: colors.muted),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 290,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              itemCount: trendingSpots.length,
              itemBuilder: (context, idx) {
                final spot = trendingSpots[idx];
                final primaryAct = spot.activities.isNotEmpty ? spot.activities.first : null;
                final accentColor = primaryAct != null
                    ? _getActivityColor(primaryAct.themeColor, colors)
                    : colors.peach;
                final imageUrl = spot.image ?? (spot.photos != null && spot.photos!.isNotEmpty ? spot.photos!.first : null);

                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => LocationDetailScreen(slug: spot.slug)),
                    );
                  },
                  child: Container(
                    width: 200,
                    margin: const EdgeInsets.only(right: 16),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: colors.surface,
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: colors.border, width: 1),
                      boxShadow: [
                        BoxShadow(
                          color: colors.shadow.withOpacity(0.04),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Card Image container
                        Container(
                          height: 130,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(24),
                            color: accentColor.withOpacity(0.15),
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Stack(
                            children: [
                              if (imageUrl != null && imageUrl.isNotEmpty)
                                Image.network(
                                  imageUrl,
                                  width: double.infinity,
                                  height: 130,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) => Center(
                                    child: Text(primaryAct?.icon ?? '📍', style: const TextStyle(fontSize: 32)),
                                  ),
                                )
                              else
                                Center(
                                  child: Text(
                                    primaryAct?.icon ?? '📍',
                                    style: const TextStyle(fontSize: 32),
                                  ),
                                ),
                              if (primaryAct != null)
                                Positioned(
                                  bottom: 8,
                                  left: 8,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: accentColor,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      primaryAct.name.toUpperCase(),
                                      style: TextStyle(
                                        fontSize: 8,
                                        fontWeight: FontWeight.w900,
                                        color: colors.ink,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),

                        // Card Content details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    spot.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: colors.ink),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    spot.address?.split(',')[0] ?? 'Berlin',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: colors.muted),
                                  ),
                                ],
                              ),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  FeedbackStack(vibeCounts: spot.vibeCounts),
                                  if (spot.rating != null && spot.rating! > 0)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: colors.sunny.withOpacity(0.3),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        '⭐ ${spot.rating!.toStringAsFixed(1)}',
                                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: colors.ink),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 10),
        ],

        // Just Landed Section
        if (newArrivals.isNotEmpty) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              children: [
                Text(
                  'Just Landed',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: colors.ink),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: colors.matcha,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    'NEW ✨',
                    style: TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      color: colors.ink,
                    ),
                  ),
                ),
              ],
            ),
          ),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: newArrivals.length,
            itemBuilder: (context, idx) => LocationCard(
              location: newArrivals[idx],
              onShare: () => _shareLocation(newArrivals[idx]),
            ),
          ),
        ],

        const SizedBox(height: 100),
      ],
    );
  }
}
