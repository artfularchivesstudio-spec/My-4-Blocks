import 'package:supabase_flutter/supabase_flutter.dart';

class AuthRepository {
  final SupabaseClient _supabaseClient;
  
  AuthRepository(this._supabaseClient);

  Stream<AuthState> get authStateChanges => _supabaseClient.auth.onAuthStateChange;
  
  User? get currentUser => _supabaseClient.auth.currentUser;

  Future<AuthResponse> signInWithEmail(String email, String password) async {
    return await _supabaseClient.auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> signUpWithEmail(String email, String password) async {
    return await _supabaseClient.auth.signUp(email: email, password: password);
  }

  Future<AuthResponse> verifyOTP(String email, String token) async {
    return await _supabaseClient.auth.verifyOTP(
      email: email,
      token: token,
      type: OtpType.signup,
    );
  }

  Future<void> signOut() async {
    await _supabaseClient.auth.signOut();
  }
}
