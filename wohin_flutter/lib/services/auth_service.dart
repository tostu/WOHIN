import 'package:dio/dio.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthUser {
  final String id;
  final String name;
  final String email;

  AuthUser({required this.id, required this.name, required this.email});

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
    );
  }
}

class AuthSession {
  final AuthUser user;
  final String token;

  AuthSession({required this.user, required this.token});
}

class AuthService {
  final ApiService _apiService;
  final StorageService _storageService;

  AuthService(this._apiService, this._storageService);

  Future<AuthSession> signIn({required String email, required String password}) async {
    try {
      final response = await _apiService.post(
        '/api/auth/sign-in/email',
        data: {
          'email': email,
          'password': password,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final sessionData = data['session'] as Map<String, dynamic>;
      final userData = data['user'] as Map<String, dynamic>;
      
      final token = sessionData['token'] as String;
      final user = AuthUser.fromJson(userData);

      // Save token in storage
      await _storageService.saveToken(token);

      return AuthSession(user: user, token: token);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<AuthSession> signUp({required String email, required String password, required String name}) async {
    try {
      final response = await _apiService.post(
        '/api/auth/sign-up/email',
        data: {
          'email': email,
          'password': password,
          'name': name,
        },
      );

      final data = response.data as Map<String, dynamic>;
      final sessionData = data['session'] as Map<String, dynamic>;
      final userData = data['user'] as Map<String, dynamic>;
      
      final token = sessionData['token'] as String;
      final user = AuthUser.fromJson(userData);

      // Save token in storage
      await _storageService.saveToken(token);

      return AuthSession(user: user, token: token);
    } catch (e) {
      throw _handleError(e);
    }
  }

  Future<AuthUser?> getSession() async {
    final token = await _storageService.getToken();
    if (token == null || token.isEmpty) return null;

    try {
      // Better auth endpoint to get active session
      final response = await _apiService.get('/api/auth/get-session');
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data as Map<String, dynamic>;
        if (data['user'] != null) {
          return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
        }
      }
      return null;
    } catch (e) {
      // If token expired, clear it
      await _storageService.deleteToken();
      return null;
    }
  }

  Future<void> signOut() async {
    try {
      await _apiService.post('/api/auth/sign-out');
    } catch (_) {
      // Even if network call fails, we still want to log out locally
    } finally {
      await _storageService.deleteToken();
    }
  }

  Exception _handleError(dynamic e) {
    if (e is DioException) {
      final message = e.response?.data?['message'] ?? e.response?.data?['error'] ?? 'Authentication failed';
      return Exception(message);
    }
    return Exception(e.toString());
  }
}
