import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class WohinColors extends ThemeExtension<WohinColors> {
  final Color background;
  final Color surface;
  final Color ink;
  final Color muted;
  final Color border;
  final Color shadow;
  final Color overlay;
  
  // Accents
  final Color peach;
  final Color matcha;
  final Color sunny;

  const WohinColors({
    required this.background,
    required this.surface,
    required this.ink,
    required this.muted,
    required this.border,
    required this.shadow,
    required this.overlay,
    required this.peach,
    required this.matcha,
    required this.sunny,
  });

  @override
  WohinColors copyWith({
    Color? background,
    Color? surface,
    Color? ink,
    Color? muted,
    Color? border,
    Color? shadow,
    Color? overlay,
    Color? peach,
    Color? matcha,
    Color? sunny,
  }) {
    return WohinColors(
      background: background ?? this.background,
      surface: surface ?? this.surface,
      ink: ink ?? this.ink,
      muted: muted ?? this.muted,
      border: border ?? this.border,
      shadow: shadow ?? this.shadow,
      overlay: overlay ?? this.overlay,
      peach: peach ?? this.peach,
      matcha: matcha ?? this.matcha,
      sunny: sunny ?? this.sunny,
    );
  }

  @override
  WohinColors lerp(ThemeExtension<WohinColors>? other, double t) {
    if (other is! WohinColors) return this;
    return WohinColors(
      background: Color.lerp(background, other.background, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      ink: Color.lerp(ink, other.ink, t)!,
      muted: Color.lerp(muted, other.muted, t)!,
      border: Color.lerp(border, other.border, t)!,
      shadow: Color.lerp(shadow, other.shadow, t)!,
      overlay: Color.lerp(overlay, other.overlay, t)!,
      peach: Color.lerp(peach, other.peach, t)!,
      matcha: Color.lerp(matcha, other.matcha, t)!,
      sunny: Color.lerp(sunny, other.sunny, t)!,
    );
  }

  static const light = WohinColors(
    background: Color(0xFFFEFCF4),
    surface: Color(0xFFFFFFFF),
    ink: Color(0xFF2C2B29),
    muted: Color(0xFF8B8A87),
    border: Color(0x1A2C2B29), // 10% alpha ink
    shadow: Color(0xFF2C2B29),
    overlay: Color(0x802C2B29), // 50% alpha ink
    peach: Color(0xFFFFB7B2),
    matcha: Color(0xFFA8E6CF),
    sunny: Color(0xFFFFD97D),
  );

  static const dark = WohinColors(
    background: Color(0xFF1A1918),
    surface: Color(0xFF2C2B29),
    ink: Color(0xFFFEFCF4),
    muted: Color(0xFFA8A7A4),
    border: Color(0x26FEFCF4), // 15% alpha ink
    shadow: Color(0xFF000000),
    overlay: Color(0xB3000000), // 70% alpha black
    peach: Color(0xFFFFB7B2),
    matcha: Color(0xFFA8E6CF),
    sunny: Color(0xFFFFD97D),
  );
}

class WohinTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: WohinColors.light.background,
      fontFamily: GoogleFonts.outfit().fontFamily,
      extensions: const [WohinColors.light],
      colorScheme: const ColorScheme.light(
        background: Color(0xFFFEFCF4),
        surface: Color(0xFFFFFFFF),
        primary: Color(0xFF2C2B29),
        secondary: Color(0xFFFFB7B2),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: WohinColors.dark.background,
      fontFamily: GoogleFonts.outfit().fontFamily,
      extensions: const [WohinColors.dark],
      colorScheme: const ColorScheme.dark(
        background: Color(0xFF1A1918),
        surface: Color(0xFF2C2B29),
        primary: Color(0xFFFEFCF4),
        secondary: Color(0xFFFFB7B2),
      ),
    );
  }
}

extension WohinThemeContext on BuildContext {
  WohinColors get colors => Theme.of(this).extension<WohinColors>() ?? WohinColors.light;
}
