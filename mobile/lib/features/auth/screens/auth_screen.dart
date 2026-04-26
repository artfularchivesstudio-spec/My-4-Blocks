import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _otpController = TextEditingController();
  bool _isLogin = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _submit() {
    final email = _emailController.text.trim();
    final password = _passwordController.text;
    if (email.isEmpty || password.isEmpty) return;
    
    if (_isLogin) {
      context.read<AuthBloc>().add(AuthSignInRequested(email, password));
    } else {
      context.read<AuthBloc>().add(AuthSignUpRequested(email, password));
    }
  }

  void _verify(String email) {
    final token = _otpController.text.trim();
    if (token.isEmpty) return;
    context.read<AuthBloc>().add(AuthVerifyRequested(email, token));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message), backgroundColor: Theme.of(context).colorScheme.error),
            );
          }
        },
        builder: (context, state) {
          final isWaitingForVerification = state is AuthNeedsVerification;
          final isLoading = state is AuthLoading;

          return SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Bespoke animated logo/header
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.primary.withAlpha(20),
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Icon(Icons.psychology_outlined, size: 36, color: Theme.of(context).colorScheme.primary),
                    ).animate().scale(delay: 200.ms, duration: 600.ms, curve: Curves.easeOutBack),
                    
                    const SizedBox(height: 32),
                    
                    Text(
                      isWaitingForVerification 
                        ? 'Verify Email'
                        : (_isLogin ? 'Welcome Back' : 'Create Account'),
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 28),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 8),
                    
                    Text(
                      isWaitingForVerification 
                        ? 'Enter the 6-digit code sent to your email.'
                        : 'Access your therapeutic blocks seamlessly.',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context).colorScheme.onSurface.withAlpha(150)
                      ),
                      textAlign: TextAlign.center,
                    ),
                    
                    const SizedBox(height: 48),
                    
                    if (isWaitingForVerification) ...[
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 24, letterSpacing: 8, fontWeight: FontWeight.bold),
                        decoration: const InputDecoration(
                          hintText: '000000',
                          counterText: '',
                        ),
                        maxLength: 6,
                      ).animate().fadeIn(),
                      const SizedBox(height: 32),
                      ElevatedButton(
                        onPressed: isLoading ? null : () => _verify((state as AuthNeedsVerification).email),
                        child: isLoading 
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Text('Verify Code', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                      TextButton(
                        onPressed: isLoading ? null : () => context.read<AuthBloc>().add(AuthSignOutRequested()),
                        child: const Text('Cancel / Go Back'),
                      ),
                    ] else ...[
                      // Inputs
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email Address',
                          prefixIcon: Icon(Icons.email_outlined),
                        ),
                      ).animate().slideX(begin: 0.1, duration: 400.ms, curve: Curves.easeOut).fadeIn(),
                      
                      const SizedBox(height: 16),
                      
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(Icons.lock_outline),
                        ),
                      ).animate().slideX(begin: 0.1, delay: 100.ms, duration: 400.ms, curve: Curves.easeOut).fadeIn(),
                      
                      const SizedBox(height: 32),
                      
                      ElevatedButton(
                        onPressed: isLoading ? null : _submit,
                        child: isLoading 
                          ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                          : Text(_isLogin ? 'Sign In' : 'Sign Up', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ).animate().scale(delay: 200.ms, duration: 400.ms, curve: Curves.easeOut),
                      
                      const SizedBox(height: 16),
                      
                      TextButton(
                        onPressed: () => setState(() => _isLogin = !_isLogin),
                        child: Text(
                          _isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in',
                          style: TextStyle(color: Theme.of(context).colorScheme.primary),
                        ),
                      ).animate().fadeIn(delay: 500.ms),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
