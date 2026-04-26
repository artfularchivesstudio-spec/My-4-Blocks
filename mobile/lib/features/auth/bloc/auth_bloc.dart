import 'package:flutter_bloc/flutter_bloc.dart';
import 'dart:async';

import 'auth_event.dart';
import 'auth_state.dart';
import '../repository/auth_repository.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;
  late StreamSubscription _authSubscription;

  AuthBloc({required this.authRepository}) : super(AuthInitial()) {
    on<AppStarted>(_onAppStarted);
    on<AuthStateChanged>(_onAuthStateChanged);
    on<AuthSignInRequested>(_onSignInRequested);
    on<AuthSignUpRequested>(_onSignUpRequested);
    on<AuthVerifyRequested>(_onVerifyRequested);
    on<AuthSignOutRequested>(_onSignOutRequested);

    _authSubscription = authRepository.authStateChanges.listen((data) {
      add(AuthStateChanged(data.session?.user));
    });
  }

  void _onAuthStateChanged(AuthStateChanged event, Emitter<AuthState> emit) {
    if (event.user != null) {
      emit(Authenticated(event.user!));
    } else {
      // Don't emit Unauthenticated if we are in NeedsVerification
      if (state is! AuthNeedsVerification) {
        emit(Unauthenticated());
      }
    }
  }

  Future<void> _onAppStarted(AppStarted event, Emitter<AuthState> emit) async {
    final user = authRepository.currentUser;
    if (user != null) {
      emit(Authenticated(user));
    } else {
      emit(Unauthenticated());
    }
  }

  Future<void> _onSignInRequested(AuthSignInRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      await authRepository.signInWithEmail(event.email, event.password);
    } catch (e) {
      final message = e.toString();
      if (message.contains('Email not confirmed')) {
        emit(AuthNeedsVerification(event.email));
      } else {
        emit(AuthError(message));
        emit(Unauthenticated());
      }
    }
  }

  Future<void> _onSignUpRequested(AuthSignUpRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      final response = await authRepository.signUpWithEmail(event.email, event.password);
      if (response.user != null && response.session == null) {
        // Confirmation mail sent
        emit(AuthNeedsVerification(event.email));
      }
    } catch (e) {
      emit(AuthError(e.toString()));
      emit(Unauthenticated());
    }
  }

  Future<void> _onVerifyRequested(AuthVerifyRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    try {
      await authRepository.verifyOTP(event.email, event.token);
    } catch (e) {
      emit(AuthError(e.toString()));
      emit(AuthNeedsVerification(event.email));
    }
  }

  Future<void> _onSignOutRequested(AuthSignOutRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    await authRepository.signOut();
  }

  @override
  Future<void> close() {
    _authSubscription.cancel();
    return super.close();
  }
}
