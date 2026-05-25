import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/theme.dart';

class Skeleton extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;
  final EdgeInsetsGeometry? margin;

  const Skeleton({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = 8,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      margin: margin,
      child: Shimmer.fromColors(
        baseColor: colors.border.withOpacity(0.1),
        highlightColor: colors.border.withOpacity(0.03),
        child: Container(
          width: width,
          height: height,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(borderRadius),
          ),
        ),
      ),
    );
  }
}

class LocationCardSkeleton extends StatelessWidget {
  const LocationCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    return Container(
      margin: const EdgeInsets.only(bottom: 24, left: 20, right: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: colors.shadow.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Row(
        children: [
          // Image skeleton
          const Skeleton(width: 120, height: 120, borderRadius: 24),
          const SizedBox(width: 16),
          // Content skeleton
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Skeleton(width: MediaQuery.of(context).size.width * 0.3, height: 20, borderRadius: 8),
                    const Skeleton(width: 45, height: 18, borderRadius: 10),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Skeleton(width: 12, height: 12, borderRadius: 6),
                    const SizedBox(width: 4),
                    Skeleton(width: MediaQuery.of(context).size.width * 0.25, height: 12, borderRadius: 6),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Feedback stack placeholder
                    const Skeleton(width: 60, height: 28, borderRadius: 14),
                    // Action buttons
                    Row(
                      children: const [
                        Skeleton(width: 36, height: 36, borderRadius: 18),
                        SizedBox(width: 8),
                        Skeleton(width: 36, height: 36, borderRadius: 18),
                      ],
                    )
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
