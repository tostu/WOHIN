import 'package:flutter/material.dart';
import '../models/location.dart';
import '../theme/theme.dart';

class FeedbackStack extends StatelessWidget {
  final VibeCounts? vibeCounts;

  const FeedbackStack({super.key, this.vibeCounts});

  static const Map<String, String> vibeEmojiMap = {
    'sparkle': '✨',
    'fire': '🔥',
    'chill': '🧊',
    'nope': '👎',
  };

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    if (vibeCounts == null) return const SizedBox(height: 28);

    final total = vibeCounts!.total;
    if (total == 0) return const SizedBox(height: 28);

    // Filter, sort by counts, take top 3
    final entries = [
      MapEntry('sparkle', vibeCounts!.sparkle),
      MapEntry('fire', vibeCounts!.fire),
      MapEntry('chill', vibeCounts!.chill),
      MapEntry('nope', vibeCounts!.nope),
    ];

    final active = entries
        .where((e) => e.value > 0)
        .toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    final top3 = active.take(3).toList();

    return SizedBox(
      height: 28,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Render top 3 overlapping circles
          for (int i = 0; i < top3.length; i++)
            Align(
              widthFactor: 0.72, // Overlap multiplier
              child: Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: colors.peach.withOpacity(0.25),
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.surface, width: 2),
                ),
                alignment: Alignment.center,
                child: Text(
                  vibeEmojiMap[top3[i].key] ?? '',
                  style: const TextStyle(fontSize: 12),
                ),
              ),
            ),
          
          // Render "+Total" count bubble if total > 3
          if (total > 3)
            Align(
              widthFactor: 0.72,
              child: Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: colors.sunny.withOpacity(0.35),
                  shape: BoxShape.circle,
                  border: Border.all(color: colors.surface, width: 2),
                ),
                alignment: Alignment.center,
                child: Text(
                  '+$total',
                  style: TextStyle(
                    fontSize: 8,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
