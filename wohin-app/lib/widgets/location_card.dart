import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../models/location.dart';
import '../theme/theme.dart';
import '../providers/query_providers.dart';
import '../screens/location_detail_screen.dart';
import 'feedback_stack.dart';

class LocationCard extends ConsumerWidget {
  final Location location;
  final VoidCallback? onShare;

  const LocationCard({
    super.key,
    required this.location,
    this.onShare,
  });

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

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.colors;
    final primaryActivity = location.activities.isNotEmpty ? location.activities.first : null;
    final activityColor = primaryActivity != null
        ? _getActivityColor(primaryActivity.themeColor, colors)
        : colors.peach;

    // Check favorite status using favoritesProvider
    final favoritesAsync = ref.watch(favoritesProvider);
    final isFavorited = favoritesAsync.maybeWhen(
      data: (favs) => favs.contains(location.id),
      orElse: () => false,
    );

    final imageUrl = location.image ?? (location.photos != null && location.photos!.isNotEmpty ? location.photos!.first : null);

    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => LocationDetailScreen(slug: location.slug),
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 20, left: 20, right: 20),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: colors.surface,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: colors.border, width: 1),
          boxShadow: [
            BoxShadow(
              color: colors.shadow.withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Row(
          children: [
            // Left image thumbnail
            Container(
              width: 110,
              height: 110,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                color: activityColor.withOpacity(0.2),
              ),
              clipBehavior: Clip.antiAlias,
              child: Stack(
                children: [
                  if (imageUrl != null && imageUrl.isNotEmpty)
                    Image.network(
                      imageUrl,
                      width: 110,
                      height: 110,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Center(
                        child: Icon(LucideIcons.map_pin, size: 36, color: activityColor),
                      ),
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Container(
                          color: colors.border.withOpacity(0.05),
                          child: const Center(
                            child: SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          ),
                        );
                      },
                    )
                  else
                    Center(
                      child: Text(
                        primaryActivity?.icon ?? '📍',
                        style: const TextStyle(fontSize: 32),
                      ),
                    ),
                  
                  // Intention Pill Tag
                  if (primaryActivity != null)
                    Positioned(
                      bottom: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: activityColor,
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          primaryActivity.name.toUpperCase(),
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
            const SizedBox(width: 14),

            // Right text and details
            Expanded(
              child: SizedBox(
                height: 110,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Title and Rating
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            location.name,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: colors.ink,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (location.rating != null && location.rating! > 0)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: colors.sunny.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '⭐ ${location.rating!.toStringAsFixed(1)}',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 4),

                    // Pin and Address/Distance
                    Row(
                      children: [
                        Icon(LucideIcons.map_pin, size: 12, color: colors.muted),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            '${location.distance != null ? "${location.distance!.toStringAsFixed(1)}km · " : ""}${location.address ?? "Berlin"}',
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
                    const SizedBox(height: 10),

                    // Feedback stack and Action buttons
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        FeedbackStack(vibeCounts: location.vibeCounts),
                        Row(
                          children: [
                            // Favorite Button
                            GestureDetector(
                              onTap: () {
                                ref.read(favoritesProvider.notifier).toggleFavorite(location.id);
                              },
                              child: Container(
                                width: 34,
                                height: 34,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isFavorited
                                      ? colors.peach
                                      : colors.peach.withOpacity(0.2),
                                ),
                                child: Icon(
                                  LucideIcons.heart,
                                  size: 16,
                                  color: isFavorited ? Colors.white : colors.ink,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),

                            // Share Button
                            GestureDetector(
                              onTap: onShare,
                              child: Container(
                                width: 34,
                                height: 34,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: colors.peach.withOpacity(0.2),
                                ),
                                child: Icon(
                                  LucideIcons.share_2,
                                  size: 16,
                                  color: colors.ink,
                                ),
                              ),
                            ),
                          ],
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
