import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/theme.dart';
import '../providers/auth_provider.dart';
import '../providers/query_providers.dart';
import '../screens/login_screen.dart';

// --- Particle Representation ---
class ParticleItem {
  final String id;
  final String emoji;
  final Offset position;

  ParticleItem({
    required this.id,
    required this.emoji,
    required this.position,
  });
}

// --- Floating Particle Animation ---
class AnimatedParticle extends StatefulWidget {
  final ParticleItem particle;
  final VoidCallback onComplete;

  const AnimatedParticle({
    super.key,
    required this.particle,
    required this.onComplete,
  });

  @override
  State<AnimatedParticle> createState() => _AnimatedParticleState();
}

class _AnimatedParticleState extends State<AnimatedParticle> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final double _driftX;
  late final double _distanceY;
  late final double _angle;

  @override
  void initState() {
    super.initState();
    final random = math.Random();
    _driftX = (random.nextDouble() - 0.5) * 100; // -50 to 50 horizontal drift
    _distanceY = 120.0 + random.nextDouble() * 80; // 120 to 200 upward travel
    _angle = (random.nextDouble() - 0.5) * 60; // rotation angle in degrees

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _controller.forward().then((_) {
      widget.onComplete();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _controller.value;
        
        // Custom curved values for scale and drift
        final scale = 0.5 + 1.2 * math.sin(t * math.pi); // springy scale up-down
        final opacity = (1.0 - t).clamp(0.0, 1.0);
        final offsetY = -_distanceY * t;
        final offsetX = _driftX * t;

        return Positioned(
          left: widget.particle.position.dx - 12,
          top: widget.particle.position.dy - 12,
          child: Transform.translate(
            offset: Offset(offsetX, offsetY),
            child: Transform.scale(
              scale: scale,
              child: Transform.rotate(
                angle: _angle * (math.pi / 180) * t,
                child: Opacity(
                  opacity: opacity,
                  child: Text(
                    widget.particle.emoji,
                    style: const TextStyle(fontSize: 26),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

// --- Main Vibe Check Selector Component ---
class VibeCheck extends ConsumerStatefulWidget {
  final String locationId;
  final String activityId;

  const VibeCheck({
    super.key,
    required this.locationId,
    required this.activityId,
  });

  @override
  ConsumerState<VibeCheck> createState() => _VibeCheckState();
}

class _VibeCheckState extends ConsumerState<VibeCheck> {
  final List<ParticleItem> _particles = [];
  bool _submitting = false;
  String? _droppedVibe;

  final List<Map<String, String>> _vibes = [
    {'id': 'sparkle', 'emoji': '✨', 'label': 'Sparkle', 'color': 'matcha'},
    {'id': 'fire', 'emoji': '🔥', 'label': 'Fire', 'color': 'peach'},
    {'id': 'chill', 'emoji': '🧊', 'label': 'Chill', 'color': 'sunny'},
    {'id': 'nope', 'emoji': '👎', 'label': 'Nope', 'color': 'muted'},
  ];

  Color _getVibeColor(String colorKey, WohinColors colors) {
    if (colorKey == 'matcha') return colors.matcha.withOpacity(0.35);
    if (colorKey == 'peach') return colors.peach.withOpacity(0.35);
    if (colorKey == 'sunny') return colors.sunny.withOpacity(0.35);
    return colors.muted.withOpacity(0.15);
  }

  void _triggerHaptic(String vibeId) {
    switch (vibeId) {
      case 'sparkle':
        HapticFeedback.selectionClick();
        break;
      case 'fire':
        HapticFeedback.lightImpact();
        break;
      case 'chill':
        HapticFeedback.mediumImpact();
        break;
      case 'nope':
        HapticFeedback.heavyImpact();
        break;
      default:
        HapticFeedback.lightImpact();
    }
  }

  void _showAuthPrompt(BuildContext context, WohinColors colors) {
    HapticFeedback.vibrate();
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            color: colors.surface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
            border: Border.all(color: colors.border, width: 1),
          ),
          padding: const EdgeInsets.only(top: 12, bottom: 40, left: 24, right: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 5,
                decoration: BoxDecoration(
                  color: colors.border,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Join the Vibe Check 🔒',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  color: colors.ink,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Drop your rating to let others know if the vibe is immaculate or needs work! Sign in to join the community.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: colors.muted,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.peach,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 56),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                ),
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const LoginScreen()),
                  );
                },
                child: const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 56),
                  side: BorderSide(color: colors.border),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                onPressed: () => Navigator.pop(context),
                child: Text('Cancel', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: colors.muted)),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _dropVibe(BuildContext context, String vibeId, String emoji, Offset tapPosition) async {
    if (_submitting) return;

    final session = ref.read(authProvider).user;
    final colors = context.colors;

    if (session == null) {
      _showAuthPrompt(context, colors);
      return;
    }

    _triggerHaptic(vibeId);

    // Spawn 6 particles at the tap location
    setState(() {
      final random = math.Random();
      for (int i = 0; i < 6; i++) {
        final id = '$vibeId-${DateTime.now().millisecondsSinceEpoch}-$i-${random.nextDouble()}';
        _particles.add(ParticleItem(id: id, emoji: emoji, position: tapPosition));
      }
      _submitting = true;
      _droppedVibe = vibeId;
    });

    try {
      await ref.read(vibeMutationProvider)(widget.locationId, widget.activityId, vibeId);
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save vibe check: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _submitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        // Main vibe grid layout
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'DROP A VIBE',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: colors.muted,
                    ),
                  ),
                  if (_droppedVibe != null)
                    Text(
                      'Vibe sent! 💌',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: colors.peach,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  for (final vibe in _vibes)
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: Builder(
                          builder: (childContext) {
                            final vibeId = vibe['id']!;
                            final emoji = vibe['emoji']!;
                            final colorKey = vibe['color']!;
                            final isCurrent = _droppedVibe == vibeId;

                            return LayoutBuilder(
                              builder: (context, constraints) {
                                return GestureDetector(
                                  onTapDown: (details) {
                                    // Find global coordinates of the center of this button
                                    final box = childContext.findRenderObject() as RenderBox;
                                    final size = box.size;
                                    final localCenter = Offset(size.width / 2, size.height / 2);
                                    // Convert to local position in Stack coordinate space
                                    final stackBox = context.findAncestorRenderObjectOfType<RenderStack>() as RenderBox?;
                                    final position = stackBox != null
                                        ? stackBox.globalToLocal(box.localToGlobal(localCenter))
                                        : localCenter;
                                    _dropVibe(context, vibeId, emoji, position);
                                  },
                                  child: Container(
                                    height: 64,
                                    decoration: BoxDecoration(
                                      color: _getVibeColor(colorKey, colors),
                                      borderRadius: BorderRadius.circular(24),
                                      border: isCurrent
                                          ? Border.all(color: colors.peach, width: 3)
                                          : Border.all(color: Colors.transparent, width: 3),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      emoji,
                                      style: const TextStyle(fontSize: 32),
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),

        // Floating particles overlays
        for (final p in _particles)
          AnimatedParticle(
            key: ValueKey(p.id),
            particle: p,
            onComplete: () {
              setState(() {
                _particles.removeWhere((item) => item.id == p.id);
              });
            },
          ),
      ],
    );
  }
}
