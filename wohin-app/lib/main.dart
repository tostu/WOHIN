import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/theme.dart';
import 'services/storage_service.dart';
import 'providers/auth_provider.dart';
import 'screens/onboarding_screen.dart';
import 'screens/tabs/tab_layout.dart';
import 'services/deep_link_service.dart';
import 'widgets/offline_banner.dart';
import 'screens/error_screen.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  // Ensure native bindings are set up before services initialization
  WidgetsFlutterBinding.ensureInitialized();

  // Route any widget rendering exception to our custom error page
  ErrorWidget.builder = (FlutterErrorDetails details) {
    return CustomErrorScreen(details: details);
  };

  // Initialize storage layer (Secure storage + SharedPreferences)
  final storageService = await StorageService.init();

  runApp(
    ProviderScope(
      overrides: [
        // Inject the initialized storage service instance
        storageServiceProvider.overrideWithValue(storageService),
      ],
      child: const WohinApp(),
    ),
  );
}

class WohinApp extends ConsumerStatefulWidget {
  const WohinApp({super.key});

  @override
  ConsumerState<WohinApp> createState() => _WohinAppState();
}

class _WohinAppState extends ConsumerState<WohinApp> {
  @override
  void initState() {
    super.initState();
    // Initialize Deep Linking Handling
    DeepLinkService().init(navigatorKey);
  }

  @override
  Widget build(BuildContext context) {
    final storage = ref.watch(storageServiceProvider);
    final isFirstLaunch = storage.getIsFirstLaunch();

    return MaterialApp(
      title: 'WOHIN',
      navigatorKey: navigatorKey,
      debugShowCheckedModeBanner: false,
      
      // Light and Dark themes config (peach, matcha, sunny)
      theme: WohinTheme.lightTheme,
      darkTheme: WohinTheme.darkTheme,
      themeMode: ThemeMode.system, // Adapt dynamically to OS setting

      // Route entrypoint
      home: isFirstLaunch ? const OnboardingScreen() : const TabLayout(),

      // Inject global offline status banner above all routes
      builder: (context, child) {
        return Stack(
          children: [
            ?child,
            const OfflineBannerOverlay(),
          ],
        );
      },
    );
  }
}
