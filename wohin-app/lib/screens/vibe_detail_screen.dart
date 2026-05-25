import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:share_plus/share_plus.dart';
import '../theme/theme.dart';
import '../models/location.dart';
import '../widgets/location_card.dart';

class VibeDetailScreen extends ConsumerWidget {
  final String vibeId;
  final String name;
  final String tagline;
  final String emoji;
  final List<Color> bgGradient;
  final Brightness inkBrightness;
  final List<Location> results;

  const VibeDetailScreen({
    super.key,
    required this.vibeId,
    required this.name,
    required this.tagline,
    required this.emoji,
    required this.bgGradient,
    required this.inkBrightness,
    required this.results,
  });

  void _shareVibeSpots() {
    final spotsList = results.map((l) => l.name).take(3).join(', ');
    final suffix = results.length > 3 ? ' and more' : '';
    Share.share(
      'Checking out $name vibes on WOHIN! Found spots like $spotsList$suffix. ✨',
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.colors;
    final inkColor = inkBrightness == Brightness.dark
        ? const Color(0xFFFEFCF4)
        : const Color(0xFF2C2B29);
    final mutedInkColor = inkColor.withOpacity(0.65);

    return Scaffold(
      backgroundColor: colors.background,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Parallax Hero Header with customized gradients and big typography
          SliverAppBar(
            expandedHeight: 280,
            floating: false,
            pinned: true,
            stretch: true,
            backgroundColor: colors.background,
            elevation: 0,
            leading: GestureDetector(
              onTap: () => Navigator.pop(context),
              child: Container(
                margin: const EdgeInsets.only(left: 16, top: 8, bottom: 8),
                decoration: BoxDecoration(
                  color: inkColor.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.arrow_back_ios_new,
                  color: inkColor,
                  size: 16,
                ),
              ),
            ),
            actions: [
              GestureDetector(
                onTap: _shareVibeSpots,
                child: Container(
                  margin: const EdgeInsets.only(right: 16, top: 8, bottom: 8),
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: inkColor.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Icon(
                    LucideIcons.share_2,
                    color: inkColor,
                    size: 18,
                  ),
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              stretchModes: const [
                StretchMode.zoomBackground,
                StretchMode.blurBackground,
              ],
              background: Stack(
                fit: StackFit.expand,
                children: [
                  // High contrast Gen Z Gradient
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: bgGradient,
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                  ),
                  
                  // Decorative grid overlay pattern
                  Opacity(
                    opacity: 0.08,
                    child: GridPaper(
                      color: inkColor,
                      interval: 20,
                      divisions: 1,
                      subdivisions: 1,
                    ),
                  ),

                  // Floating animated emoji
                  Positioned(
                    right: 24,
                    bottom: 40,
                    child: Text(
                      emoji,
                      style: const TextStyle(fontSize: 100),
                    )
                        .animate(onPlay: (controller) => controller.repeat(reverse: true))
                        .scaleXY(begin: 0.9, end: 1.1, duration: 2.seconds, curve: Curves.easeInOut)
                        .rotate(begin: -0.05, end: 0.05, duration: 2.seconds, curve: Curves.easeInOut),
                  ),

                  // Header texts
                  Positioned(
                    left: 24,
                    bottom: 24,
                    right: 140, // Avoid overlapping with the emoji
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: inkColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'VIBE · ${results.length} SPOT${results.length == 1 ? "" : "S"}',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: inkColor,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          name,
                          style: TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -2,
                            color: inkColor,
                            height: 0.95,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          tagline,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: mutedInkColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content body
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(top: 24, bottom: 8, left: 24, right: 24),
              child: Text(
                'Top Spot Picks',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                  color: colors.ink,
                ),
              ),
            ),
          ),

          if (results.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(40),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '👀',
                        style: const TextStyle(fontSize: 48),
                      ).animate().shake(duration: 1.seconds),
                      const SizedBox(height: 16),
                      Text(
                        'No spots match this vibe yet!',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: colors.muted,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Check back later or check another vibe.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12,
                          color: colors.muted.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.only(top: 8, bottom: 80),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final loc = results[index];
                    return LocationCard(
                      location: loc,
                      onShare: () {
                        Share.share('Check out ${loc.name} on WOHIN!${loc.address != null ? " - ${loc.address}" : ""}');
                      },
                    )
                        .animate()
                        .fadeIn(duration: 400.ms, delay: (index * 60).ms)
                        .slideY(begin: 0.08, end: 0, duration: 450.ms, curve: Curves.easeOutBack);
                  },
                  childCount: results.length,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
