import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/theme/app_theme.dart';
import 'core/router/app_router.dart';
import 'features/auth/bloc/auth_bloc.dart';
import 'features/auth/bloc/auth_event.dart';
import 'features/auth/repository/auth_repository.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await Supabase.initialize(
    url: 'https://yofxwtwyquzusbubawzh.supabase.co',
    anonKey: 'sb_publishable_HfsFOGp1lr_6-SMwYRgfhA_5JZBzTGy',
  );

  final sharedPreferences = await SharedPreferences.getInstance();

  runApp(
    MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (_) => AuthBloc(
            authRepository: AuthRepository(Supabase.instance.client),
          )..add(AppStarted()),
        ),
      ],
      child: const My4BlocksApp(),
    ),
  );
}

class My4BlocksApp extends StatelessWidget {
  const My4BlocksApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'My 4 Blocks',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
