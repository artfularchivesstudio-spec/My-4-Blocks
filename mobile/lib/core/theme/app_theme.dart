import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Serene, therapeutic color palette
  static const Color background = Color(0xFFFAF9F6); // Warm cream
  static const Color foreground = Color(0xFF1E293B); // Deep slate
  static const Color primary = Color(0xFF166534); // Deep forest green
  static const Color primaryForeground = Color(0xFFF0FDF4);
  static const Color secondary = Color(0xFFF1F5F9);
  static const Color secondaryForeground = Color(0xFF334155);
  
  static const Color card = Colors.white;
  static const Color border = Color(0xFFE2E8F0);
  
  // Custom blocks colors
  static const Color anger = Color(0xFF991B1B);
  static const Color anxiety = Color(0xFFD97706);
  static const Color depression = Color(0xFF1E3A8A);
  static const Color guilt = Color(0xFF6B21A8);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: primary,
        onPrimary: primaryForeground,
        secondary: secondary,
        onSecondary: secondaryForeground,
        background: background,
        onBackground: foreground,
        surface: card,
        onSurface: foreground,
      ),
      scaffoldBackgroundColor: background,
      textTheme: GoogleFonts.dmSansTextTheme().copyWith(
        displayLarge: GoogleFonts.dmSans(color: foreground, fontWeight: FontWeight.bold),
        bodyLarge: GoogleFonts.dmSans(color: foreground),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        iconTheme: IconThemeData(color: foreground),
        titleTextStyle: TextStyle(color: foreground, fontSize: 20, fontWeight: FontWeight.w600),
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
    // Implementing the dark palette from the css
    const darkBackground = Color(0xFF0F172A);
    const darkForeground = Color(0xFFF8FAFC);
    const darkPrimary = Color(0xFF22C55E);
    const darkCard = Color(0xFF1E293B);
    
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: const ColorScheme.dark(
        primary: darkPrimary,
        onPrimary: darkBackground,
        secondary: darkCard,
        onSecondary: darkForeground,
        background: darkBackground,
        onBackground: darkForeground,
        surface: darkCard,
        onSurface: darkForeground,
      ),
      scaffoldBackgroundColor: darkBackground,
      textTheme: GoogleFonts.dmSansTextTheme().copyWith(
        displayLarge: GoogleFonts.dmSans(color: darkForeground, fontWeight: FontWeight.bold),
        bodyLarge: GoogleFonts.dmSans(color: darkForeground),
        bodyMedium: GoogleFonts.dmSans(color: darkForeground),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkBackground,
        elevation: 0,
        iconTheme: IconThemeData(color: darkForeground),
        titleTextStyle: TextStyle(color: darkForeground, fontSize: 20, fontWeight: FontWeight.w600),
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
