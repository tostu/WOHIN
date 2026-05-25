import 'package:app_links/app_links.dart';
import 'package:flutter/material.dart';
import '../screens/location_detail_screen.dart';

class DeepLinkService {
  static final DeepLinkService _instance = DeepLinkService._internal();
  factory DeepLinkService() => _instance;
  DeepLinkService._internal();

  final _appLinks = AppLinks();
  GlobalKey<NavigatorState>? _navigatorKey;

  void init(GlobalKey<NavigatorState> navigatorKey) {
    _navigatorKey = navigatorKey;
    
    // Subscribe to link changes
    _appLinks.uriLinkStream.listen((uri) {
      _handleUri(uri);
    });

    // Check initial link (when app is opened from a terminated state)
    _appLinks.getInitialLink().then((uri) {
      if (uri != null) {
        _handleUri(uri);
      }
    });
  }

  void _handleUri(Uri uri) {
    debugPrint('Received Deep Link: $uri');
    
    // Support schemes:
    // 1. wohinapp://location/<slug>
    // 2. https://wohinapp.com/location/<slug>
    
    String? slug;
    
    if (uri.scheme == 'wohinapp') {
      if (uri.host == 'location' && uri.pathSegments.isNotEmpty) {
        slug = uri.pathSegments.first;
      } else if (uri.pathSegments.length >= 2 && uri.pathSegments[0] == 'location') {
        slug = uri.pathSegments[1];
      }
    } else if (uri.scheme == 'https' && uri.host == 'wohinapp.com') {
      if (uri.pathSegments.length >= 2 && uri.pathSegments[0] == 'location') {
        slug = uri.pathSegments[1];
      }
    }

    if (slug != null && slug.isNotEmpty) {
      debugPrint('Parsed slug from deep link: $slug');
      // Push detail screen
      _navigatorKey?.currentState?.push(
        MaterialPageRoute(
          builder: (context) => LocationDetailScreen(slug: slug!),
        ),
      );
    }
  }
}
