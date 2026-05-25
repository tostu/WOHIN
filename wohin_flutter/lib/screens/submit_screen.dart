import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../theme/theme.dart';
import '../providers/auth_provider.dart';
import '../providers/location_provider.dart';
import 'login_screen.dart';

class SubmitScreen extends ConsumerStatefulWidget {
  const SubmitScreen({super.key});

  @override
  ConsumerState<SubmitScreen> createState() => _SubmitScreenState();
}

class _SubmitScreenState extends ConsumerState<SubmitScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _addressController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  Map<String, double>? _coordinates;
  bool _loading = false;
  bool _submitted = false;

  @override
  void dispose() {
    _nameController.dispose();
    _addressController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _captureCurrentLocation() {
    final gpsState = ref.read(locationProvider);
    if (gpsState.latitude != null && gpsState.longitude != null) {
      setState(() {
        _coordinates = {
          'lat': gpsState.latitude!,
          'lng': gpsState.longitude!,
        };
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Current location set! ✨")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Location not available yet. Please wait a moment.")),
      );
    }
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _loading = true;
    });

    final api = ref.read(apiServiceProvider);

    try {
      await api.post('/api/v1/submissions/location', data: {
        'name': _nameController.text.trim(),
        'address': _addressController.text.trim(),
        'description': _descriptionController.text.trim(),
        'coordinates': _coordinates, // Mapped to geoPoint in Sanity backend
      });

      setState(() {
        _submitted = true;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to submit location: $e')),
      );
    } finally {
      if (mounted) {
        setState(() {
          _loading = false;
        });
      }
    }
  }

  void _resetForm() {
    setState(() {
      _submitted = false;
      _nameController.clear();
      _addressController.clear();
      _descriptionController.clear();
      _coordinates = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;
    final session = ref.watch(authProvider).user;

    // --- 1. Auth Guard View ---
    if (session == null) {
      return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: colors.ink),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(40.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('🔒', style: TextStyle(fontSize: 80)),
                  const SizedBox(height: 24),
                  Text(
                    'Sign in first',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: colors.ink,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'You need to be signed in to submit a spot.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: colors.muted,
                    ),
                  ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.peach,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(180, 56),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const LoginScreen()),
                      );
                    },
                    child: const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    // --- 2. Success Submission View ---
    if (_submitted) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(40.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('🕊️', style: TextStyle(fontSize: 80)),
                  const SizedBox(height: 24),
                  Text(
                    'Sent to the curators!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      color: colors.ink,
                      letterSpacing: -1,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "We'll review your spot and add it to the radiant map soon. Thanks for being awesome! ✨",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: colors.muted,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 40),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.peach,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(200, 56),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    ),
                    onPressed: _resetForm,
                    child: const Text('Submit another', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    // --- 3. Main Form Input View ---
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colors.ink),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                RichText(
                  text: TextSpan(
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -2,
                      color: colors.ink,
                      height: 1.1,
                      fontFamily: 'Outfit',
                    ),
                    children: [
                      const TextSpan(text: 'Share a \n'),
                      TextSpan(
                        text: 'new',
                        style: TextStyle(fontStyle: FontStyle.italic, color: colors.matcha),
                      ),
                      const TextSpan(text: ' \ndiscovery.'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Help the community grow by adding your favorite radiant spots.',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: colors.muted,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 40),

                // Form Container
                Container(
                  decoration: BoxDecoration(
                    color: colors.surface,
                    borderRadius: BorderRadius.circular(40),
                    boxShadow: [
                      BoxShadow(
                        color: colors.shadow.withOpacity(0.04),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Spot Name
                      _buildLabel('SPOT NAME', colors),
                      TextFormField(
                        controller: _nameController,
                        style: TextStyle(color: colors.ink, fontWeight: FontWeight.w600),
                        decoration: _buildInputDecoration('e.g., The Cozy Corner', colors),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter a name for the spot';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 24),

                      // Location/Address
                      _buildLabel('WHERE IS IT?', colors),
                      TextFormField(
                        controller: _addressController,
                        style: TextStyle(color: colors.ink, fontWeight: FontWeight.w600),
                        decoration: _buildInputDecoration('Street, City', colors),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please enter the address';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 12),
                      
                      // Geolocator button
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size(120, 44),
                          side: BorderSide(color: colors.peach),
                          backgroundColor: _coordinates != null
                              ? colors.peach
                              : colors.peach.withOpacity(0.05),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: _captureCurrentLocation,
                        icon: Icon(
                          LucideIcons.map_pin,
                          size: 16,
                          color: _coordinates != null ? Colors.white : colors.peach,
                        ),
                        label: Text(
                          _coordinates != null ? 'Location Captured! ✨' : 'Use my current location',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: _coordinates != null ? Colors.white : colors.peach,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Description
                      _buildLabel('THE VIBE', colors),
                      TextFormField(
                        controller: _descriptionController,
                        style: TextStyle(color: colors.ink, fontWeight: FontWeight.w600),
                        maxLines: 4,
                        decoration: _buildInputDecoration('Tell us why it\'s cool! ✨', colors),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Please describe the vibe';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 32),

                      // Share the magic submit
                      SizedBox(
                        width: double.infinity,
                        height: 60,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: colors.peach,
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                            elevation: 0,
                          ),
                          onPressed: _loading ? null : _handleSubmit,
                          child: _loading
                              ? const CircularProgressIndicator(color: Colors.white)
                              : const Text(
                                  'Share the Magic! ✨',
                                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String labelText, WohinColors colors) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0, left: 4),
      child: Text(
        labelText,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w900,
          letterSpacing: 2,
          color: colors.muted,
        ),
      ),
    );
  }

  InputDecoration _buildInputDecoration(String hint, WohinColors colors) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: colors.muted, fontWeight: FontWeight.normal),
      filled: true,
      fillColor: colors.background,
      contentPadding: const EdgeInsets.all(16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(20),
        borderSide: BorderSide.none,
      ),
    );
  }
}
