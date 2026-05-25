class VibeFeedback {
  final String id;
  final String vibe; // 'sparkle' | 'fire' | 'chill' | 'nope'
  final String locationId;
  final String activityId;
  final String userId;

  VibeFeedback({
    required this.id,
    required this.vibe,
    required this.locationId,
    required this.activityId,
    required this.userId,
  });

  factory VibeFeedback.fromJson(Map<String, dynamic> json) {
    return VibeFeedback(
      id: (json['id'] ?? '').toString(),
      vibe: json['vibe'] as String? ?? 'chill',
      locationId: json['locationId'] as String? ?? '',
      activityId: json['activityId'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'vibe': vibe,
      'locationId': locationId,
      'activityId': activityId,
      'userId': userId,
    };
  }
}
