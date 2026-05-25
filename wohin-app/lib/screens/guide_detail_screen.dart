import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:share_plus/share_plus.dart';
import '../theme/theme.dart';
import '../models/curated_list.dart';
import '../widgets/location_card.dart';

class GuideDetailScreen extends ConsumerWidget {
  final CuratedList guide;

  const GuideDetailScreen({
    super.key,
    required this.guide,
  });

  void _shareGuide() {
    Share.share(
      'Check out the curated guide "${guide.title}" on WOHIN! 🗺️ Contains ${guide.locations.length} spots.',
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.colors;

    // A beautiful background gradient for guides using peach/matcha colors to look super modern
    final bgGradient = [
      colors.peach.withOpacity(0.45),
      colors.matcha.withOpacity(0.2),
      colors.background,
    ];

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
                  color: colors.ink.withOpacity(0.08),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.arrow_back_ios_new,
                  color: colors.ink,
                  size: 16,
                ),
              ),
            ),
            actions: [
              GestureDetector(
                onTap: _shareGuide,
                child: Container(
                  margin: const EdgeInsets.only(right: 16, top: 8, bottom: 8),
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: colors.ink.withOpacity(0.08),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Icon(
                    LucideIcons.share_2,
                    color: colors.ink,
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
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                  ),
                  
                  // Decorative grid overlay pattern
                  Opacity(
                    opacity: 0.05,
                    child: GridPaper(
                      color: colors.ink,
                      interval: 15,
                      divisions: 1,
                      subdivisions: 1,
                    ),
                  ),

                  // Floating animated emoji
                  Positioned(
                    right: 24,
                    bottom: 40,
                    child: Text(
                      guide.emoji ?? '🗺️',
                      style: const TextStyle(fontSize: 100),
                    )
                        .animate(onPlay: (controller) => controller.repeat(reverse: true))
                        .scaleXY(begin: 0.9, end: 1.1, duration: 2.2.seconds, curve: Curves.easeInOut)
                        .rotate(begin: 0.05, end: -0.05, duration: 2.2.seconds, curve: Curves.easeInOut),
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
                            color: colors.ink.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            'GUIDE · ${guide.locations.length} SPOT${guide.locations.length == 1 ? "" : "S"}',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: colors.ink,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          guide.title,
                          style: TextStyle(
                            fontSize: 40,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -1.5,
                            color: colors.ink,
                            height: 1.0,
                          ),
                        ),
                        if (guide.description != null && guide.description!.isNotEmpty) ...[
                          const SizedBox(height: 6),
                          Text(
                            guide.description!,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: colors.muted,
                            ),
                          ),
                        ],
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
                'Curated Selection',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                  color: colors.ink,
                ),
              ),
            ),
          ),

          if (guide.locations.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(40),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        '🗺️',
                        style: const TextStyle(fontSize: 48),
                      ).animate().shake(duration: 1.seconds),
                      const SizedBox(height: 16),
                      Text(
                        'No spots in this guide yet!',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: colors.muted,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Check back later or check another guide.',
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
                    final loc = guide.locations[index];
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
                  childCount: guide.locations.length,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
