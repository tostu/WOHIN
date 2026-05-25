import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/storage_service.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';

// Dependency injection providers for services
final storageServiceProvider = Provider<StorageService>((ref) {
  throw UnimplementedError('Initialize StorageService in main and override this provider');
});

final apiServiceProvider = Provider<ApiService>((ref) {
  final storageService = ref.watch(storageServiceProvider);
  return ApiService(storageService);
});

final authServiceProvider = Provider<AuthService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  final storage = ref.watch(storageServiceProvider);
  return AuthService(apiService, storage);
});

// Authentication State
class AuthState {
  final AuthUser? user;
  final bool isLoading;
  final String? error;

  AuthState({this.user, this.isLoading = false, this.error});

  AuthState copyWith({AuthUser? user, bool? isLoading, String? error, bool clearError = false}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;

  AuthNotifier(this._authService) : super(AuthState(isLoading: true)) {
    checkSession();
  }

  Future<void> checkSession() async {
    state = state.copyWith(isLoading: true);
    try {
      final user = await _authService.getSession();
      state = AuthState(user: user, isLoading: false);
    } catch (e) {
      state = AuthState(user: null, isLoading: false, error: e.toString());
    }
  }

  Future<bool> signIn(String email, String password) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final session = await _authService.signIn(email: email, password: password);
      state = AuthState(user: session.user, isLoading: false);
      return true;
    } catch (e) {
      state = AuthState(user: null, isLoading: false, error: e.toString().replaceAll('Exception: ', ''));
      return false;
    }
  }

  Future<bool> signUp(String email, String password, String name) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final session = await _authService.signUp(email: email, password: password, name: name);
      state = AuthState(user: session.user, isLoading: false);
      return true;
    } catch (e) {
      state = AuthState(user: null, isLoading: false, error: e.toString().replaceAll('Exception: ', ''));
      return false;
    }
  }

  Future<void> signOut() async {
    state = state.copyWith(isLoading: true);
    await _authService.signOut();
    state = AuthState(user: null, isLoading: false);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  return AuthNotifier(authService);
});
