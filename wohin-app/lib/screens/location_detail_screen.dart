import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:share_plus/share_plus.dart';
import '../theme/theme.dart';
import '../models/location.dart';
import '../providers/query_providers.dart';
import '../widgets/vibe_check_sheet.dart';
import '../widgets/skeletons.dart';

// --- Simple Sanity Portable Text Renderer ---
class PortableText extends StatelessWidget {
  final dynamic value;

  const PortableText({super.key, this.value});

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;

    if (value == null) {
      return Text(
        'No description available yet.',
        style: TextStyle(fontSize: 16, color: colors.ink.withOpacity(0.8), height: 1.5),
      );
    }

    if (value is String) {
      return Text(
        value as String,
        style: TextStyle(fontSize: 16, color: colors.ink.withOpacity(0.8), height: 1.5),
      );
    }

    if (value is List) {
      final blocks = value as List;
      final textSpans = <TextSpan>[];

      for (final block in blocks) {
        if (block is Map<String, dynamic> && block['_type'] == 'block') {
          final children = block['children'] as List? ?? [];
          for (final child in children) {
            if (child is Map<String, dynamic> && child['_type'] == 'span') {
              final text = child['text'] as String? ?? '';
              final marks = child['marks'] as List? ?? [];
              
              // Apply formatting based on marks
              final isBold = marks.contains('strong');
              final isItalic = marks.contains('em');

              textSpans.add(
                TextSpan(
                  text: text,
                  style: TextStyle(
                    fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
                    fontStyle: isItalic ? FontStyle.italic : FontStyle.normal,
                  ),
                ),
              );
            }
          }
          // Add a line break at the end of each block
          textSpans.add(const TextSpan(text: '\n\n'));
        }
      }

      if (textSpans.isNotEmpty) {
        // Remove trailing newlines
        textSpans.removeLast();
        return RichText(
          text: TextSpan(
            style: TextStyle(
              fontSize: 16,
              color: colors.ink.withOpacity(0.8),
              height: 1.5,
              fontFamily: 'Outfit',
            ),
            children: textSpans,
          ),
        );
      }
    }

    return Text(
      'No description available yet.',
      style: TextStyle(fontSize: 16, color: colors.ink.withOpacity(0.8), height: 1.5),
    );
  }
}

// --- Main Detail Screen ---
class LocationDetailScreen extends ConsumerStatefulWidget {
  final String slug;

  const LocationDetailScreen({super.key, required this.slug});

  @override
  ConsumerState<LocationDetailScreen> createState() => _LocationDetailScreenState();
}

class _LocationDetailScreenState extends ConsumerState<LocationDetailScreen> {
  String? _selectedActivityId;

  void _shareLocation(Location location) {
    Share.share(
      'Check out ${location.name} on WOHIN!${location.address != null ? " - ${location.address}" : ""}',
      subject: location.name,
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;

    // Load queries
    final locationAsync = ref.watch(locationDetailProvider(widget.slug));
    
    // Read active location id if loaded
    final locationId = locationAsync.value?.id ?? '';
    final vibeHistoryAsync = ref.watch(vibeHistoryProvider(locationId));

    // Auto-select primary activity if not set
    ref.listen(locationDetailProvider(widget.slug), (_, next) {
      if (next.hasValue && _selectedActivityId == null) {
        final loc = next.value!;
        if (loc.activities.isNotEmpty) {
          setState(() {
            _selectedActivityId = loc.activities.first.id;
          });
        }
      }
    });

    // Calculate vibe counts from history query
    final Map<String, int> vibeCounts = {'sparkle': 0, 'fire': 0, 'chill': 0, 'nope': 0};
    if (vibeHistoryAsync.hasValue) {
      for (final v in vibeHistoryAsync.value!) {
        vibeCounts[v.vibe] = (vibeCounts[v.vibe] ?? 0) + 1;
      }
    }
    final totalVibes = vibeCounts.values.reduce((a, b) => a + b);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: GestureDetector(
          onTap: () => Navigator.pop(context),
          child: Container(
            margin: const EdgeInsets.only(left: 16, top: 8, bottom: 8),
            decoration: const BoxDecoration(
              color: Colors.black38,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back, color: Colors.white, size: 20),
          ),
        ),
        actions: [
          if (locationAsync.hasValue)
            GestureDetector(
              onTap: () => _shareLocation(locationAsync.value!),
              child: Container(
                margin: const EdgeInsets.only(right: 16, top: 8, bottom: 8),
                width: 40,
                height: 40,
                decoration: const BoxDecoration(
                  color: Colors.black38,
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Icon(LucideIcons.share_2, color: Colors.white, size: 18),
              ),
            ),
        ],
      ),
      body: locationAsync.when(
        loading: () => _buildLoadingState(colors),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(40),
            child: Text('Failed to load spot details: $err', style: TextStyle(color: colors.muted)),
          ),
        ),
        data: (location) {
          final imageUrl = location.image ?? (location.photos != null && location.photos!.isNotEmpty ? location.photos!.first : null);

          return SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              children: [
                // Parallax Header Hero Image
                Stack(
                  children: [
                    Container(
                      height: 400,
                      width: double.infinity,
                      color: colors.peach.withOpacity(0.18),
                      child: imageUrl != null && imageUrl.isNotEmpty
                          ? Image.network(imageUrl, fit: BoxFit.cover)
                          : const Center(
                              child: Text('🏙️', style: TextStyle(fontSize: 80)),
                            ),
                    ),
                    
                    // Dark legibility overlay
                    Container(
                      height: 400,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.black.withOpacity(0.6),
                            Colors.black.withOpacity(0.1),
                            Colors.black.withOpacity(0.5),
                          ],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                    
                    // Float Details
                    Positioned(
                      bottom: 40,
                      left: 24,
                      right: 24,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            location.name,
                            style: const TextStyle(
                              fontSize: 34,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: -1,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            location.address ?? 'Address coming soon',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                // Content Sheet Overlay
                Transform.translate(
                  offset: const Offset(0, -28),
                  child: Container(
                    decoration: BoxDecoration(
                      color: colors.background,
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
                    ),
                    padding: const EdgeInsets.only(top: 32, left: 24, right: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Intention selector tabs
                        if (location.activities.isNotEmpty) ...[
                          SizedBox(
                            height: 90,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: location.activities.length,
                              itemBuilder: (context, idx) {
                                final act = location.activities[idx];
                                final isSelected = _selectedActivityId == act.id;

                                return Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: ChoiceChip(
                                    avatar: act.icon != null
                                        ? Text(
                                            act.icon!,
                                            style: const TextStyle(fontSize: 16, height: 1.0),
                                          )
                                        : null,
                                    label: Text(
                                      act.name,
                                      maxLines: 1,
                                      softWrap: false,
                                      overflow: TextOverflow.visible,
                                    ),
                                    selected: isSelected,
                                    onSelected: (_) {
                                      setState(() {
                                        _selectedActivityId = act.id;
                                      });
                                    },
                                    labelStyle: TextStyle(
                                      fontWeight: FontWeight.w700,
                                      color: colors.ink,
                                      height: 1.0,
                                    ),
                                    backgroundColor: colors.border,
                                    selectedColor: colors.peach,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20),
                                      side: BorderSide(color: isSelected ? colors.peach : Colors.transparent),
                                    ),
                                    showCheckmark: false,
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 24),
                        ],

                        // Markdown Description
                        PortableText(value: location.description),
                        const SizedBox(height: 32),

                        // Interactive Vibe Check triggers
                        if (_selectedActivityId != null) ...[
                          Container(
                            decoration: BoxDecoration(
                              color: colors.surface,
                              borderRadius: BorderRadius.circular(32),
                              boxShadow: [
                                BoxShadow(
                                  color: colors.shadow.withOpacity(0.04),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: VibeCheck(
                              locationId: location.id,
                              activityId: _selectedActivityId!,
                            ),
                          ),
                          const SizedBox(height: 24),
                        ],

                        // Vibe History Stats Card
                        Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: colors.surface,
                            borderRadius: BorderRadius.circular(32),
                            boxShadow: [
                              BoxShadow(
                                  color: colors.shadow.withOpacity(0.04),
                                  blurRadius: 10,
                                  offset: const Offset(0, 2)),
                            ],
                          ),
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '✨ Vibe History',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w900,
                                  color: colors.ink,
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              if (totalVibes == 0)
                                Text(
                                  'No vibe checks yet. Be the first to drop one! 💖',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontStyle: FontStyle.italic,
                                    fontWeight: FontWeight.w600,
                                    color: colors.muted,
                                  ),
                                )
                              else
                                Wrap(
                                  spacing: 12,
                                  runSpacing: 12,
                                  children: [
                                    for (final entry in vibeCounts.entries)
                                      if (entry.value > 0)
                                        FractionallySizedBox(
                                          widthFactor: 0.47,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              color: colors.background,
                                              borderRadius: BorderRadius.circular(24),
                                            ),
                                            padding: const EdgeInsets.symmetric(vertical: 16),
                                            alignment: Alignment.center,
                                            child: Column(
                                              children: [
                                                Text(
                                                  entry.key == 'sparkle'
                                                      ? '✨'
                                                      : entry.key == 'fire'
                                                          ? '🔥'
                                                          : entry.key == 'chill'
                                                              ? '🧊'
                                                              : '👎',
                                                  style: const TextStyle(fontSize: 24),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  entry.value.toString(),
                                                  style: TextStyle(
                                                    fontSize: 18,
                                                    fontWeight: FontWeight.w900,
                                                    color: colors.ink,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                  ],
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 120),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildLoadingState(WohinColors colors) {
    return SingleChildScrollView(
      child: Column(
        children: [
          const Skeleton(width: double.infinity, height: 400, borderRadius: 0),
          Transform.translate(
            offset: const Offset(0, -28),
            child: Container(
              decoration: BoxDecoration(
                color: colors.background,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Skeleton(width: 100, height: 40, borderRadius: 20),
                      SizedBox(width: 8),
                      Skeleton(width: 100, height: 40, borderRadius: 20),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Skeleton(width: MediaQuery.of(context).size.width * 0.8, height: 20),
                  const SizedBox(height: 8),
                  Skeleton(width: MediaQuery.of(context).size.width * 0.9, height: 20),
                  const SizedBox(height: 24),
                  const Skeleton(width: double.infinity, height: 120, borderRadius: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
