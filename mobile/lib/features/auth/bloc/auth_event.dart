import 'package:equatable/equatable.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AppStarted extends AuthEvent {}

class AuthStateChanged extends AuthEvent {
  final User? user;
  const AuthStateChanged(this.user);
  @override
  List<Object?> get props => [user];
}

class AuthSignInRequested extends AuthEvent {
  final String email;
  final String password;
  const AuthSignInRequested(this.email, this.password);
  
  @override
  List<Object> get props => [email, password];
}

class AuthSignUpRequested extends AuthEvent {
  final String email;
  final String password;
  const AuthSignUpRequested(this.email, this.password);

  @override
  List<Object> get props => [email, password];
}

class AuthSignOutRequested extends AuthEvent {}

class AuthVerifyRequested extends AuthEvent {
  final String email;
  final String token;
  const AuthVerifyRequested(this.email, this.token);

  @override
  List<Object> get props => [email, token];
}
