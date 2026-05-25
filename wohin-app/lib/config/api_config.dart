import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConfig {
  static String get baseUrl {
    // If we are running on Web, use localhost (or window.location host in production)
    if (kIsWeb) {
      return "http://localhost:8787";
    }
    
    // For native platforms:
    try {
      if (Platform.isAndroid) {
        // Android emulator points to 10.0.2.2 for the host machine's localhost
        return "http://10.0.2.2:8787";
      }
    } catch (_) {
      // Platform check can throw on web if not handled, but kIsWeb guards it
    }
    
    // Default fallback (iOS Simulator, macOS native, etc. uses localhost)
    return "http://localhost:8787";
  }
}
