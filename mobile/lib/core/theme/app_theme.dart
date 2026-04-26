import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Serene, therapeutic color palette
  static const Color background = Color(0xFFFBFBF9); // Warm cream (oklch(0.98 0.005 90))
  static const Color foreground = Color(0xFF1E2923); // Deep forest slate (oklch(0.20 0.02 150))
  static const Color primary = Color(0xFF166534); // Deep forest green (oklch(0.35 0.08 160))
  static const Color primaryForeground = Color(0xFFFBFBF9);
  static const Color secondary = Color(0xFFF1F5F1); // Soft sage (oklch(0.96 0.01 90))
  static const Color secondaryForeground = Color(0xFF166534);
  
  static const Color card = Colors.white;
  static const Color border = Color(0xFFE2E8E2);
  
  // Custom blocks colors (calming but distinct)
  static const Color anger = Color(0xFFB91C1C); // oklch(0.60 0.18 25)
  static const Color anxiety = Color(0xFFD97706); // oklch(0.65 0.15 85)
  static const Color depression = Color(0xFF1E3A8A); // oklch(0.50 0.12 250)
  static const Color guilt = Color(0xFF6B21A8); // oklch(0.55 0.15 320)

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: primary,
        onPrimary: primaryForeground,
        secondary: secondary,
        onSecondary: secondaryForeground,
        surface: card,
        onSurface: foreground,
      ),
      scaffoldBackgroundColor: background,
      textTheme: GoogleFonts.dmSansTextTheme().copyWith(
        displayLarge: GoogleFonts.cormorantGaramond(
          color: foreground, 
          fontWeight: FontWeight.bold,
          fontSize: 32,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          color: foreground, 
          fontWeight: FontWeight.w600,
          fontSize: 28,
        ),
        titleLarge: GoogleFonts.cormorantGaramond(
          color: foreground, 
          fontWeight: FontWeight.w600,
          fontSize: 22,
        ),
        bodyLarge: GoogleFonts.dmSans(color: foreground),
        bodyMedium: GoogleFonts.dmSans(color: foreground.withAlpha(200)),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: foreground),
        titleTextStyle: GoogleFonts.cormorantGaramond(
          color: foreground, 
          fontSize: 24, 
          fontWeight: FontWeight.w600,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: secondary,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: primary),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: primaryForeground,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        ),
      ),
    );
  }

  // Dark Theme
  static ThemeData get darkTheme {
    // Earthy, deep forest dark mode (oklch(0.15 0.02 150))
    const darkBackground = Color(0xFF161D19);
    const darkForeground = Color(0xFFFBFBF9);
    const darkPrimary = Color(0xFF22C55E); // oklch(0.65 0.10 160)
    const darkCard = Color(0xFF1D2621); // oklch(0.18 0.02 150)
    
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: darkPrimary,
        onPrimary: darkBackground,
        secondary: darkCard,
        onSecondary: darkForeground,
        surface: darkCard,
        onSurface: darkForeground,
      ),
      scaffoldBackgroundColor: darkBackground,
      textTheme: GoogleFonts.dmSansTextTheme().copyWith(
        displayLarge: GoogleFonts.cormorantGaramond(
          color: darkForeground, 
          fontWeight: FontWeight.bold,
          fontSize: 32,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          color: darkForeground, 
          fontWeight: FontWeight.w600,
          fontSize: 28,
        ),
        titleLarge: GoogleFonts.cormorantGaramond(
          color: darkForeground, 
          fontWeight: FontWeight.w600,
          fontSize: 22,
        ),
        bodyLarge: GoogleFonts.dmSans(color: darkForeground),
        bodyMedium: GoogleFonts.dmSans(color: darkForeground.withAlpha(200)),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: darkForeground),
        titleTextStyle: GoogleFonts.cormorantGaramond(
          color: darkForeground, 
          fontSize: 24, 
          fontWeight: FontWeight.w600,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: darkCard,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: darkPrimary),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: darkPrimary,
          foregroundColor: darkBackground,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
        ),
      ),
    );
  }
}
