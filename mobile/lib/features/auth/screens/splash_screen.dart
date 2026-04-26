import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
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
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Theme.of(context).colorScheme.primary,
                      Theme.of(context).colorScheme.primary.withAlpha(200)
                    ],
                  ),
                  shape: BoxShape.circle,
                ),
              ).animate(onPlay: (controller) => controller.repeat(reverse: true))
               .scale(duration: 1.5.seconds, begin: const Offset(1, 1), end: const Offset(1.1, 1.1))
               .shimmer(duration: 2.seconds, curve: Curves.easeInOut),
              const SizedBox(height: 32),
              Text(
                'My 4 Blocks',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 32),
              ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0, curve: Curves.easeOutQuad),
            ],
          ),
        ),
      ),
    );
  }
}
