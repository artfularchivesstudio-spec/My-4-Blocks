import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lottie/lottie.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_state.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is Authenticated) {
          context.go('/chat');
        } else if (state is Unauthenticated) {
          context.go('/auth');
        }
      },
      child: Scaffold(
        body: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Theme.of(context).colorScheme.surface,
                Theme.of(context).colorScheme.primaryContainer.withAlpha(50),
              ],
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Lottie.network(
                  'https://lottie.host/8b248a80-0010-4356-9b9a-4c919c727038/oK4jXzI8YJ.json',
                  width: 280,
                  height: 280,
                  fit: BoxFit.contain,
                ).animate().fadeIn(duration: 1.seconds).scale(delay: 200.ms),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      LucideIcons.sparkles,
                      color: Theme.of(context).colorScheme.primary,
                      size: 32,
                    ).animate().fadeIn(delay: 800.ms).scale().shimmer(delay: 2.seconds),
                    const SizedBox(width: 12),
                    Text(
                      'My 4 Blocks',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                        fontSize: 40,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -1,
                        color: Theme.of(context).colorScheme.onSurface,
                      ),
                    ).animate()
                     .fadeIn(delay: 600.ms, duration: 800.ms)
                     .slideY(begin: 0.3, end: 0, curve: Curves.easeOutBack),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Find your inner balance',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant.withAlpha(180),
                    letterSpacing: 0.5,
                  ),
                ).animate().fadeIn(delay: 1.2.seconds),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
