import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../theme/theme.dart';
import 'tabs/tab_layout.dart';

class CustomErrorScreen extends StatelessWidget {
  final FlutterErrorDetails details;

  const CustomErrorScreen({super.key, required this.details});

  void _handleRetry(BuildContext context) {
    // Navigate back to the home/tab layout to recover the application
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (context) => const TabLayout()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    // Default to light colors if context doesn't have custom extensions yet
    final colors = context.colors;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(40.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Branded warning icon wrapper
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF6B5A).withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Icon(
                    LucideIcons.circle_alert,
                    size: 64,
                    color: const Color(0xFFFF6B5A),
                  ),
                ),
                const SizedBox(height: 24),

                // Header Title
                Text(
                  'Oops, something slipped.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: colors.ink,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 12),

                // Description message
                Text(
                  "Even the best vibes sometimes trip. We've logged the issue and are working on a fix!",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 16,
                    color: colors.muted,
                    height: 1.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 24),

                // Console / Debug Info (Only show in debug mode)
                if (kDebugMode)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      details.exceptionAsString(),
                      style: const TextStyle(
                        color: Colors.greenAccent,
                        fontSize: 10,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ),
                const SizedBox(height: 32),

                // Try Again/Retry button
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.peach,
                    foregroundColor: Colors.white,
                    minimumSize: const Size(200, 56),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    elevation: 0,
                  ),
                  onPressed: () => _handleRetry(context),
                  icon: const Icon(LucideIcons.refresh_cw, size: 20),
                  label: const Text(
                    'Try Again',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
