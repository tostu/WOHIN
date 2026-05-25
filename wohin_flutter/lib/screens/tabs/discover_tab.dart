import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:share_plus/share_plus.dart';
import '../../theme/theme.dart';
import '../../models/location.dart';
import '../../providers/query_providers.dart';
import '../../widgets/location_card.dart';
import '../../widgets/skeletons.dart';

// --- Local Vibe Object Definition ---
class Vibe {
  final String id;
  final String name;
  final String tagline;
  final String emoji;
  final String themeColor;
  final List<String> keywords;
  final List<Color> bgGradient;
  final Brightness inkBrightness;

  Vibe({
    required this.id,
    required this.name,
    required this.tagline,
    required this.emoji,
    required this.themeColor,
    required this.keywords,
    required this.bgGradient,
    required this.inkBrightness,
  });
}

class DiscoverTab extends ConsumerStatefulWidget {
  const DiscoverTab({super.key});

  @override
  ConsumerState<DiscoverTab> createState() => _DiscoverTabState();
}

class _DiscoverTabState extends ConsumerState<DiscoverTab> {
  // Vibes configuration
  final List<Vibe> _vibes = [
    Vibe(
      id: 'cozy',
      name: 'Cozy',
      tagline: 'warm corners, slow sips',
      emoji: '☕',
      themeColor: 'peach',
      keywords: ['coffee', 'cafe', 'café', 'book', 'tea'],
      bgGradient: [const Color(0xFFFFB7B2), const Color(0xFFFF9E99)],
      inkBrightness: Brightness.light,
    ),
    Vibe(
      id: 'wild',
      name: 'Wild',
      tagline: 'let the night win',
      emoji: '🔥',
      themeColor: 'sunny',
      keywords: ['bar', 'club', 'party', 'late', 'dance'],
      bgGradient: [const Color(0xFF2C2B29), const Color(0xFFFF6B5A)],
      inkBrightness: Brightness.dark,
    ),
    Vibe(
      id: 'romantic',
      name: 'Romantic',
      tagline: 'candlelit, lingering',
      emoji: '🌹',
      themeColor: 'peach',
      keywords: ['wine', 'dinner', 'date', 'intimate', 'bistro'],
      bgGradient: [const Color(0xFFFF8479), const Color(0xFFFFB7B2)],
      inkBrightness: Brightness.light,
    ),
    Vibe(
      id: 'heady',
      name: 'Heady',
      tagline: 'think, stare, feel',
      emoji: '🎨',
      themeColor: 'matcha',
      keywords: ['art', 'gallery', 'film', 'museum', 'bookshop'],
      bgGradient: [const Color(0xFFA8E6CF), const Color(0xFF4A8A72)],
      inkBrightness: Brightness.light,
    ),
    Vibe(
      id: 'slow',
      name: 'Slow',
      tagline: 'no rush, no map',
      emoji: '🌿',
      themeColor: 'matcha',
      keywords: ['park', 'garden', 'walk', 'canal', 'river'],
      bgGradient: [const Color(0xFFA8E6CF), const Color(0xFFC8F0DA)],
      inkBrightness: Brightness.light,
    ),
    Vibe(
      id: 'loud',
      name: 'Loud',
      tagline: 'bass in your teeth',
      emoji: '🎧',
      themeColor: 'sunny',
      keywords: ['live', 'music', 'gig', 'venue', 'concert'],
      bgGradient: [const Color(0xFFFFD97D), const Color(0xFFFF8F3C)],
      inkBrightness: Brightness.light,
    ),
    Vibe(
      id: 'green',
      name: 'Green',
      tagline: 'trees, sky, breathe',
      emoji: '🌳',
      themeColor: 'matcha',
      keywords: ['nature', 'outdoor', 'forest', 'lake', 'park'],
      bgGradient: [const Color(0xFF4A8A72), const Color(0xFFA8E6CF)],
      inkBrightness: Brightness.dark,
    ),
    Vibe(
      id: 'hidden',
      name: 'Hidden',
      tagline: 'only the locals know',
      emoji: '🗝️',
      themeColor: 'peach',
      keywords: ['secret', 'local', 'hidden', 'tucked', 'speakeasy'],
      bgGradient: [const Color(0xFF1A1A1A), const Color(0xFFFFB7B2)],
      inkBrightness: Brightness.dark,
    ),
  ];

  void _shareLocation(Location loc) {
    Share.share('Check out ${loc.name} on WOHIN!${loc.address != null ? " - ${loc.address}" : ""}');
  }

  void _openDetailsSheet(
    BuildContext context, {
    required String title,
    required String emoji,
    required String tagline,
    required String typeLabel,
    required List<Location> results,
    required WohinColors colors,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.88,
          decoration: BoxDecoration(
            color: colors.background,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
          ),
          padding: const EdgeInsets.only(top: 12),
          child: Column(
            children: [
              // Swipe indicator bar
              Container(
                width: 40,
                height: 6,
                decoration: BoxDecoration(
                  color: colors.border,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(height: 16),

              // Bottom sheet Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '$typeLabel · ${results.length} spot${results.length == 1 ? "" : "s"}',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: colors.muted,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '$emoji $title',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                              color: colors.ink,
                              letterSpacing: -0.5,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            tagline,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: colors.muted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Black Close button
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: colors.ink,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          LucideIcons.x,
                          color: colors.background,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Filtered location card list
              Expanded(
                child: results.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(40),
                          child: Text(
                            'No spots found here yet! ✨',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: colors.muted,
                            ),
                          ),
                        ),
                      )
                    : ListView.builder(
                        itemCount: results.length,
                        padding: const EdgeInsets.only(bottom: 40),
                        itemBuilder: (context, idx) => LocationCard(
                          location: results[idx],
                          onShare: () => _shareLocation(results[idx]),
                        ),
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;

    // Fetch guides & featured locations
    final curatedListsAsync = ref.watch(curatedListsProvider);
    final featuredParams = FeaturedParams(null, null, 40);
    final featuredLocationsAsync = ref.watch(featuredLocationsProvider(featuredParams));

    Future<void> handleRefresh() async {
      await Future.wait([
        ref.read(curatedListsProvider.notifier).refresh(),
        ref.read(featuredLocationsProvider(featuredParams).notifier).refresh(),
      ]);
    }

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
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
                  padding: const EdgeInsets.only(left: 20, right: 20, top: 20, bottom: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'BERLIN · PICK YOUR MOOD',
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
                            TextSpan(text: "What's the "),
                            TextSpan(
                              text: 'vibe',
                              style: TextStyle(fontStyle: FontStyle.italic),
                            ),
                            TextSpan(text: '?'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'One tap. We\'ll handle the rest.',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: colors.muted,
                        ),
                      ),
                    ],
                  ),
                ),

                // Curated Guides Section
                curatedListsAsync.when(
                  loading: () => const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
                    child: Skeleton(width: double.infinity, height: 110, borderRadius: 24),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                  data: (guides) {
                    if (guides.isEmpty) return const SizedBox.shrink();
                    return Padding(
                      padding: const EdgeInsets.only(top: 8, bottom: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                            child: Text(
                              'Curated Guides 🗺️',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                            ),
                          ),
                          SizedBox(
                            height: 110,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              padding: const EdgeInsets.symmetric(horizontal: 20),
                              itemCount: guides.length,
                              itemBuilder: (context, idx) {
                                final list = guides[idx];
                                return GestureDetector(
                                  onTap: () => _openDetailsSheet(
                                    context,
                                    title: list.title,
                                    emoji: list.emoji ?? '🗺️',
                                    tagline: list.description ?? 'Curated guide',
                                    typeLabel: 'GUIDE',
                                    results: list.locations,
                                    colors: colors,
                                  ),
                                  child: Container(
                                    width: 280,
                                    margin: const EdgeInsets.only(right: 16),
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: colors.surface,
                                      borderRadius: BorderRadius.circular(24),
                                      border: Border.all(color: colors.border, width: 2),
                                    ),
                                    child: Row(
                                      children: [
                                        // Emoji container
                                        Container(
                                          width: 48,
                                          height: 48,
                                          decoration: BoxDecoration(
                                            color: colors.peach.withOpacity(0.18),
                                            shape: BoxShape.circle,
                                          ),
                                          alignment: Alignment.center,
                                          child: Text(
                                            list.emoji ?? '📍',
                                            style: const TextStyle(fontSize: 24),
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        // Text details
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Text(
                                                list.title,
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w900,
                                                  color: colors.ink,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                list.description ?? '',
                                                style: TextStyle(
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.w600,
                                                  color: colors.muted,
                                                  height: 1.3,
                                                ),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
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
                        ],
                      ),
                    );
                  },
                ),

                // Vibes Grid Section
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Wrap(
                    children: [
                      for (final vibe in _vibes)
                        FractionallySizedBox(
                          widthFactor: 0.5,
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: GestureDetector(
                              onTap: () {
                                // Filter featured locations client-side
                                final featuredLocs = featuredLocationsAsync.value ?? [];
                                final results = featuredLocs.where((loc) {
                                  final byColor = loc.activities.any((a) => a.themeColor == vibe.themeColor);
                                  final nameAddress = '${loc.name} ${loc.address ?? ""}'.toLowerCase();
                                  final byKeyword = vibe.keywords.any((k) => nameAddress.contains(k));
                                  return byKeyword || byColor;
                                }).toList();

                                _openDetailsSheet(
                                  context,
                                  title: vibe.name,
                                  emoji: vibe.emoji,
                                  tagline: vibe.tagline,
                                  typeLabel: 'VIBE',
                                  results: results,
                                  colors: colors,
                                );
                              },
                              child: Container(
                                height: 160,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(28),
                                  gradient: LinearGradient(
                                    colors: vibe.bgGradient,
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                ),
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    // Emoji bubble
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.25),
                                        shape: BoxShape.circle,
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        vibe.emoji,
                                        style: const TextStyle(fontSize: 20),
                                      ),
                                    ),
                                    
                                    // Details text
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          vibe.name,
                                          style: TextStyle(
                                            fontSize: 22,
                                            fontWeight: FontWeight.w900,
                                            color: vibe.inkBrightness == Brightness.dark
                                                ? const Color(0xFFFEFCF4)
                                                : const Color(0xFF2C2B29),
                                            letterSpacing: -0.5,
                                          ),
                                        ),
                                        Text(
                                          vibe.tagline,
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w700,
                                            color: vibe.inkBrightness == Brightness.dark
                                                ? const Color(0xFFFEFCF4).withOpacity(0.5)
                                                : const Color(0xFF2C2B29).withOpacity(0.5),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 100),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
