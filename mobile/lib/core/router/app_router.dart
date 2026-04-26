import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/auth_screen.dart';
import '../../features/chat/screens/chat_screen.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../features/chat/bloc/chat_bloc.dart';
import '../../features/chat/repository/chat_repository.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/auth',
      builder: (context, state) => const AuthScreen(),
    ),
    GoRoute(
      path: '/chat',
      builder: (context, state) => BlocProvider<ChatBloc>(
        create: (context) => ChatBloc(ChatRepository()),
        child: const ChatScreen(),
      ),
    ),
  ],
);

