import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../theme/theme.dart';
import '../providers/auth_provider.dart';
import '../services/storage_service.dart';
import 'tabs/tab_layout.dart';

class OnboardingSlide {
  final String title;
  final String description;
  final IconData icon;
  final String color;

  OnboardingSlide({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
  });
}

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentSlide = 0;

  final List<OnboardingSlide> _slides = [
    OnboardingSlide(
      title: 'Welcome to WOHIN',
      description: 'Find the perfect spot for your next discovery, curated by the community.',
      icon: LucideIcons.map,
      color: 'matcha',
    ),
    OnboardingSlide(
      title: 'Drop Vibes',
      description: 'Share how a place feels. Sparkly? Chilled? Let others know the vibe.',
      icon: LucideIcons.sparkles,
      color: 'peach',
    ),
    OnboardingSlide(
      title: 'Your City, Radiant',
      description: 'Berlin is just the beginning. Join us in mapping the most vibrant corners.',
      icon: LucideIcons.heart,
      color: 'sunny',
    ),
  ];

  Color _getAccentColor(String colorKey, WohinColors colors) {
    if (colorKey == 'matcha') return colors.matcha;
    if (colorKey == 'peach') return colors.peach;
    if (colorKey == 'sunny') return colors.sunny;
    return colors.peach;
  }

  Future<void> _handleNext(StorageService storage) async {
    if (_currentSlide < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      await storage.setIsFirstLaunch(false);
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const TabLayout()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final storage = ref.watch(storageServiceProvider);

    final slide = _slides[_currentSlide];
    final accentColor = _getAccentColor(slide.color, colors);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
          child: Column(
            children: [
              // Sliding slides
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (idx) {
                    setState(() {
                      _currentSlide = idx;
                    });
                  },
                  itemCount: _slides.length,
                  itemBuilder: (context, index) {
                    final current = _slides[index];
                    final slideAccent = _getAccentColor(current.color, colors);

                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Icon bubble
                        Container(
                          width: 160,
                          height: 160,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: slideAccent.withOpacity(0.18),
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            current.icon,
                            size: 80,
                            color: slideAccent,
                          ),
                        ).animate(key: ValueKey(index))
                            .scale(duration: 400.ms, curve: Curves.easeOutBack),
                        const SizedBox(height: 48),

                        // Title
                        Text(
                          current.title,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 32,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -1,
                            color: colors.ink,
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Description
                        Text(
                          current.description,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: colors.muted,
                            height: 1.5,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),

              // Pagination & Button Footer
              Column(
                children: [
                  // Pagination dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (int i = 0; i < _slides.length; i++)
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 250),
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          height: 8,
                          width: i == _currentSlide ? 24 : 8,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            color: i == _currentSlide ? accentColor : colors.border,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Black action button
                  GestureDetector(
                    onTap: () => _handleNext(storage),
                    child: Container(
                      width: double.infinity,
                      height: 60,
                      decoration: BoxDecoration(
                        color: colors.ink,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _currentSlide == _slides.length - 1 ? 'Get Started' : 'Next',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: colors.background,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            LucideIcons.arrow_right,
                            size: 18,
                            color: colors.background,
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
      ),
    );
  }
}
