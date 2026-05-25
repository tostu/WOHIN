import 'location.dart';

class CuratedList {
  final String id;
  final String title;
  final String slug;
  final String? emoji;
  final String? description;
  final List<Location> locations;

  CuratedList({
    required this.id,
    required this.title,
    required this.slug,
    this.emoji,
    this.description,
    required this.locations,
  });

  factory CuratedList.fromJson(Map<String, dynamic> json) {
    var rawLocations = json['locations'] as List? ?? [];
    List<Location> parsedLocations = rawLocations
        .map((l) => Location.fromJson(l as Map<String, dynamic>))
        .toList();

    return CuratedList(
      id: json['id'] as String? ?? json['_id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      slug: json['slug'] as String? ?? (json['slug'] is Map ? json['slug']['current'] as String? ?? '' : ''),
      emoji: json['emoji'] as String?,
      description: json['description'] as String?,
      locations: parsedLocations,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'slug': slug,
      'emoji': emoji,
      'description': description,
      'locations': locations.map((l) => l.toJson()).toList(),
    };
  }
}
