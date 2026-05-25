import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:share_plus/share_plus.dart';
import '../../theme/theme.dart';
import '../../models/location.dart';
import '../../models/curated_list.dart';
import '../../providers/query_providers.dart';
import '../../widgets/location_card.dart';
import '../../widgets/skeletons.dart';
import '../vibe_detail_screen.dart';
import '../guide_detail_screen.dart';

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
  // Filter and Search states
  String? _selectedVibeId;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

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

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text;
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Widget _buildVibePills(WohinColors colors) {
    return Container(
      height: 48,
      margin: const EdgeInsets.only(top: 12, bottom: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        itemCount: _vibes.length + 1,
        itemBuilder: (context, idx) {
          if (idx == 0) {
            final isSelected = _selectedVibeId == null;
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: const Text('All Vibes ✨'),
                selected: isSelected,
                onSelected: (_) {
                  setState(() {
                    _selectedVibeId = null;
                  });
                },
                labelStyle: TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 12,
                  color: isSelected ? colors.background : colors.ink,
                ),
                selectedColor: colors.ink,
                backgroundColor: colors.surface,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24),
                  side: BorderSide(
                    color: isSelected ? colors.ink : colors.border,
                    width: 2,
                  ),
                ),
                showCheckmark: false,
              ),
            );
          }

          final vibe = _vibes[idx - 1];
          final isSelected = _selectedVibeId == vibe.id;
          final vibeColor = vibe.bgGradient.last;

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              avatar: Text(vibe.emoji),
              label: Text(vibe.name),
              selected: isSelected,
              onSelected: (_) {
                setState(() {
                  _selectedVibeId = vibe.id;
                });
              },
              labelStyle: TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 12,
                color: isSelected ? Colors.white : colors.ink,
              ),
              selectedColor: vibeColor,
              backgroundColor: colors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(
                  color: isSelected ? vibeColor : colors.border,
                  width: 2,
                ),
              ),
              showCheckmark: false,
            ),
          );
        },
      ),
    );
  }

  Widget _buildSearchBar(WohinColors colors) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: colors.surface,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: colors.border, width: 2),
          boxShadow: [
            BoxShadow(
              color: colors.shadow.withOpacity(0.02),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: TextField(
          controller: _searchController,
          style: TextStyle(
            fontWeight: FontWeight.w700,
            color: colors.ink,
            fontSize: 14,
          ),
          decoration: InputDecoration(
            hintText: 'Search curated guides...',
            hintStyle: TextStyle(
              color: colors.muted.withOpacity(0.65),
              fontWeight: FontWeight.w600,
            ),
            prefixIcon: Icon(
              LucideIcons.search,
              color: colors.muted,
              size: 18,
            ),
            suffixIcon: _searchQuery.isNotEmpty
                ? GestureDetector(
                    onTap: () {
                      _searchController.clear();
                    },
                    child: Icon(
                      LucideIcons.x,
                      color: colors.muted,
                      size: 16,
                    ),
                  )
                : null,
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ),
    );
  }

  Widget _buildCuratedGuides(
    List<CuratedList> guides,
    WohinColors colors,
    List<Location> featuredLocs,
  ) {
    final filteredGuides = guides.where((guide) {
      if (_searchQuery.isNotEmpty) {
        final titleMatch = guide.title.toLowerCase().contains(_searchQuery.toLowerCase());
        final descMatch = guide.description?.toLowerCase().contains(_searchQuery.toLowerCase()) ?? false;
        if (!titleMatch && !descMatch) return false;
      }

      if (_selectedVibeId != null) {
        final vibe = _vibes.firstWhere((v) => v.id == _selectedVibeId);
        final text = '${guide.title} ${guide.description ?? ""}'.toLowerCase();
        final byKeyword = vibe.keywords.any((k) => text.contains(k.toLowerCase())) ||
            text.contains(vibe.name.toLowerCase());
        if (!byKeyword) return false;
      }

      return true;
    }).toList();

    final showVibeHighlight = _selectedVibeId != null;

    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Curated Guides 🗺️',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                    letterSpacing: -0.5,
                  ),
                ),
                if (filteredGuides.length != guides.length)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: colors.peach.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${filteredGuides.length} found',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: colors.ink,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          SizedBox(
            height: 200,
            child: filteredGuides.isEmpty && !showVibeHighlight
                ? Container(
                    width: double.infinity,
                    margin: const EdgeInsets.symmetric(horizontal: 20),
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: colors.surface,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: colors.border, width: 2),
                    ),
                    alignment: Alignment.center,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('🔍', style: TextStyle(fontSize: 28)),
                        const SizedBox(height: 8),
                        Text(
                          'No guides match filters.',
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: colors.muted,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    itemCount: filteredGuides.length + (showVibeHighlight ? 1 : 0),
                    itemBuilder: (context, idx) {
                      // Render Vibe Highlight Card at index 0 to tie guides with vibes
                      if (showVibeHighlight && idx == 0) {
                        final vibe = _vibes.firstWhere((v) => v.id == _selectedVibeId);
                        final results = featuredLocs.where((loc) {
                          final byColor = loc.activities.any((a) => a.themeColor == vibe.themeColor);
                          final nameAddress = '${loc.name} ${loc.address ?? ""}'.toLowerCase();
                          final byKeyword = vibe.keywords.any((k) => nameAddress.contains(k));
                          return byKeyword || byColor;
                        }).toList();

                        return GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => VibeDetailScreen(
                                  vibeId: vibe.id,
                                  name: vibe.name,
                                  tagline: vibe.tagline,
                                  emoji: vibe.emoji,
                                  bgGradient: vibe.bgGradient,
                                  inkBrightness: vibe.inkBrightness,
                                  results: results,
                                ),
                              ),
                            );
                          },
                          child: Container(
                            width: 290,
                            margin: const EdgeInsets.only(right: 16, bottom: 8, top: 4),
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: vibe.bgGradient,
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(32),
                              boxShadow: [
                                BoxShadow(
                                  color: vibe.bgGradient.last.withOpacity(0.3),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        'VIBE SPOTLIGHT',
                                        style: TextStyle(
                                          fontSize: 8,
                                          fontWeight: FontWeight.w900,
                                          color: vibe.inkBrightness == Brightness.dark
                                              ? const Color(0xFFFEFCF4)
                                              : const Color(0xFF2C2B29),
                                          letterSpacing: 1,
                                        ),
                                      ),
                                    ),
                                    Text(
                                      vibe.emoji,
                                      style: const TextStyle(fontSize: 24),
                                    )
                                        .animate(onPlay: (c) => c.repeat(reverse: true))
                                        .scaleXY(begin: 0.9, end: 1.1, duration: 1.5.seconds, curve: Curves.easeInOut),
                                  ],
                                ),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'All "${vibe.name}" Spots',
                                      style: TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: -1,
                                        color: vibe.inkBrightness == Brightness.dark
                                            ? const Color(0xFFFEFCF4)
                                            : const Color(0xFF2C2B29),
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Row(
                                      children: [
                                        Text(
                                          'Explore ${results.length} locations ',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: (vibe.inkBrightness == Brightness.dark
                                                    ? const Color(0xFFFEFCF4)
                                                    : const Color(0xFF2C2B29))
                                                .withOpacity(0.7),
                                          ),
                                        ),
                                        Icon(
                                          LucideIcons.arrow_right,
                                          size: 12,
                                          color: vibe.inkBrightness == Brightness.dark
                                              ? const Color(0xFFFEFCF4)
                                              : const Color(0xFF2C2B29),
                                        ),
                                      ],
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ).animate().scale(
                              begin: const Offset(0.95, 0.95),
                              end: const Offset(1, 1),
                              duration: 400.ms,
                              curve: Curves.easeOutBack,
                            );
                      }

                      final guideIdx = showVibeHighlight ? idx - 1 : idx;
                      final list = filteredGuides[guideIdx];

                      // Fetch first available image from the guide locations to make card highly visual
                      final firstLocWithImage = list.locations.firstWhere(
                        (loc) =>
                            (loc.image != null && loc.image!.isNotEmpty) ||
                            (loc.photos != null && loc.photos!.isNotEmpty),
                        orElse: () => list.locations.isNotEmpty
                            ? list.locations.first
                            : Location(id: '', name: '', slug: '', activities: [], vibeCounts: VibeCounts()),
                      );
                      final guideImageUrl = (firstLocWithImage.id.isNotEmpty)
                          ? (firstLocWithImage.image ??
                              (firstLocWithImage.photos != null && firstLocWithImage.photos!.isNotEmpty
                                  ? firstLocWithImage.photos!.first
                                  : null))
                          : null;

                      return GestureDetector(
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => GuideDetailScreen(guide: list),
                            ),
                          );
                        },
                        child: Container(
                          width: 290,
                          margin: const EdgeInsets.only(right: 16, bottom: 8, top: 4),
                          decoration: BoxDecoration(
                            color: colors.surface,
                            borderRadius: BorderRadius.circular(32),
                            border: Border.all(color: colors.border, width: 2),
                            boxShadow: [
                              BoxShadow(
                                color: colors.shadow.withOpacity(0.04),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          clipBehavior: Clip.antiAlias,
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              // Background Image / Gradient
                              if (guideImageUrl != null && guideImageUrl.isNotEmpty) ...[
                                Image.network(
                                  guideImageUrl,
                                  fit: BoxFit.cover,
                                  errorBuilder: (c, e, s) => Container(color: colors.surface),
                                ),
                                Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        Colors.black.withOpacity(0.75),
                                        Colors.black.withOpacity(0.35),
                                      ],
                                      begin: Alignment.bottomCenter,
                                      end: Alignment.topCenter,
                                    ),
                                  ),
                                ),
                              ] else ...[
                                Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        colors.peach.withOpacity(0.12),
                                        colors.matcha.withOpacity(0.05),
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                  ),
                                ),
                              ],

                              // Type Tag Badge
                              Positioned(
                                top: 16,
                                left: 16,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: guideImageUrl != null
                                        ? Colors.white.withOpacity(0.2)
                                        : colors.border,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    '🗺️ GUIDE',
                                    style: TextStyle(
                                      fontSize: 8,
                                      fontWeight: FontWeight.w900,
                                      color: guideImageUrl != null ? Colors.white : colors.ink,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ),

                              // Spots counter
                              Positioned(
                                top: 16,
                                right: 16,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: colors.sunny,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    '${list.locations.length} SPOTS',
                                    style: const TextStyle(
                                      fontSize: 8,
                                      fontWeight: FontWeight.w900,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              ),

                              // Bottom Title details
                              Positioned(
                                bottom: 16,
                                left: 16,
                                right: 16,
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.end,
                                  children: [
                                    Container(
                                      width: 42,
                                      height: 42,
                                      decoration: BoxDecoration(
                                        color: guideImageUrl != null
                                            ? Colors.white.withOpacity(0.25)
                                            : colors.peach.withOpacity(0.25),
                                        shape: BoxShape.circle,
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        list.emoji ?? '📍',
                                        style: const TextStyle(fontSize: 20),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Text(
                                            list.title,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w900,
                                              letterSpacing: -0.5,
                                              color: guideImageUrl != null ? Colors.white : colors.ink,
                                            ),
                                          ),
                                          if (list.description != null && list.description!.isNotEmpty) ...[
                                            const SizedBox(height: 2),
                                            Text(
                                              list.description!,
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w600,
                                                color: guideImageUrl != null
                                                    ? Colors.white.withOpacity(0.75)
                                                    : colors.muted,
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ).animate().fadeIn(duration: 400.ms, delay: (idx * 50).ms).scale(
                            begin: const Offset(0.95, 0.95),
                            end: const Offset(1, 1),
                            duration: 400.ms,
                            curve: Curves.easeOutBack,
                          );
                    },
                  ),
          ),
        ],
      ),
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
                // Header details
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
                            letterSpacing: -1.5,
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

                // Vibe filter pills
                _buildVibePills(colors),

                // Search Box
                _buildSearchBar(colors),

                // Curated Guides Carousel
                curatedListsAsync.when(
                  loading: () => const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20, horizontal: 20),
                    child: Skeleton(width: double.infinity, height: 160, borderRadius: 32),
                  ),
                  error: (_, __) => const SizedBox.shrink(),
                  data: (guides) {
                    if (guides.isEmpty) return const SizedBox.shrink();
                    final featuredLocs = featuredLocationsAsync.value ?? [];
                    return _buildCuratedGuides(guides, colors, featuredLocs);
                  },
                ),

                // Vibes Grid Section Header
                Padding(
                  padding: const EdgeInsets.only(left: 20, top: 12, bottom: 4),
                  child: Text(
                    'Explore Vibes ⚡',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: colors.ink,
                      letterSpacing: -0.5,
                    ),
                  ),
                ),

                // Vibes Grid Section
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Wrap(
                    children: [
                      for (int i = 0; i < _vibes.length; i++)
                        (() {
                          final vibe = _vibes[i];
                          return FractionallySizedBox(
                            widthFactor: 0.5,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: GestureDetector(
                                onTap: () {
                                  final featuredLocs = featuredLocationsAsync.value ?? [];
                                  final results = featuredLocs.where((loc) {
                                    final byColor =
                                        loc.activities.any((a) => a.themeColor == vibe.themeColor);
                                    final nameAddress =
                                        '${loc.name} ${loc.address ?? ""}'.toLowerCase();
                                    final byKeyword = vibe.keywords.any((k) => nameAddress.contains(k));
                                    return byKeyword || byColor;
                                  }).toList();

                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (context) => VibeDetailScreen(
                                        vibeId: vibe.id,
                                        name: vibe.name,
                                        tagline: vibe.tagline,
                                        emoji: vibe.emoji,
                                        bgGradient: vibe.bgGradient,
                                        inkBrightness: vibe.inkBrightness,
                                        results: results,
                                      ),
                                    ),
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
                                    boxShadow: [
                                      BoxShadow(
                                        color: vibe.bgGradient.last.withOpacity(0.18),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                    border: Border.all(color: colors.ink.withOpacity(0.08), width: 1.5),
                                  ),
                                  padding: const EdgeInsets.all(16),
                                  child: Stack(
                                    children: [
                                      Positioned(
                                        right: 0,
                                        top: 0,
                                        child: Text(
                                          vibe.emoji,
                                          style: const TextStyle(fontSize: 48),
                                        )
                                            .animate(onPlay: (c) => c.repeat(reverse: true))
                                            .scaleXY(
                                                begin: 0.9,
                                                end: 1.1,
                                                duration: 1.8.seconds,
                                                curve: Curves.easeInOut)
                                            .rotate(
                                                begin: -0.05,
                                                end: 0.05,
                                                duration: 1.8.seconds,
                                                curve: Curves.easeInOut),
                                      ),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisAlignment: MainAxisAlignment.end,
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
                                          const SizedBox(height: 2),
                                          Text(
                                            vibe.tagline,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w700,
                                              color: vibe.inkBrightness == Brightness.dark
                                                  ? const Color(0xFFFEFCF4).withOpacity(0.6)
                                                  : const Color(0xFF2C2B29).withOpacity(0.6),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ).animate().fadeIn(duration: 400.ms, delay: (i * 40).ms).slideY(
                                begin: 0.06,
                                end: 0,
                                duration: 400.ms,
                                curve: Curves.easeOutQuad,
                              );
                        })(),
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
