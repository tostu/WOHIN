class Activity {
  final String id;
  final String name;
  final String slug;
  final String themeColor; // 'matcha' | 'peach' | 'sunny'
  final String? icon;

  Activity({
    required this.id,
    required this.name,
    required this.slug,
    required this.themeColor,
    this.icon,
  });

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      id: json['id'] as String? ?? json['_id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      slug: json['slug'] as String? ?? (json['slug'] is Map ? json['slug']['current'] as String? ?? '' : ''),
      themeColor: json['themeColor'] as String? ?? 'peach',
      icon: json['icon'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'themeColor': themeColor,
      'icon': icon,
    };
  }
}
