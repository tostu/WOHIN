import 'activity.dart';

class LocationCoordinates {
  final double lat;
  final double lng;

  LocationCoordinates({required this.lat, required this.lng});

  factory LocationCoordinates.fromJson(Map<String, dynamic> json) {
    return LocationCoordinates(
      lat: (json['lat'] as num?)?.toDouble() ?? 0.0,
      lng: (json['lng'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lat': lat,
      'lng': lng,
    };
  }
}

class VibeCounts {
  final int sparkle;
  final int fire;
  final int chill;
  final int nope;

  VibeCounts({
    this.sparkle = 0,
    this.fire = 0,
    this.chill = 0,
    this.nope = 0,
  });

  int get total => sparkle + fire + chill + nope;

  factory VibeCounts.fromJson(Map<String, dynamic>? json) {
    if (json == null) return VibeCounts();
    return VibeCounts(
      sparkle: (json['sparkle'] as num?)?.toInt() ?? 0,
      fire: (json['fire'] as num?)?.toInt() ?? 0,
      chill: (json['chill'] as num?)?.toInt() ?? 0,
      nope: (json['nope'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sparkle': sparkle,
      'fire': fire,
      'chill': chill,
      'nope': nope,
    };
  }
}

class Location {
  final String id;
  final String name;
  final String slug;
  final String? address;
  final String? hours;
  final LocationCoordinates? coordinates;
  final double? distance;
  final double? rating;
  final String? image;
  final List<String>? photos;
  final List<Activity> activities;
  final VibeCounts vibeCounts;
  final dynamic description; // Sanity Portable Text (can be List or String)

  Location({
    required this.id,
    required this.name,
    required this.slug,
    this.address,
    this.hours,
    this.coordinates,
    this.distance,
    this.rating,
    this.image,
    this.photos,
    required this.activities,
    required this.vibeCounts,
    this.description,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    var rawActivities = json['activities'] as List? ?? [];
    List<Activity> parsedActivities = rawActivities
        .map((act) => Activity.fromJson(act as Map<String, dynamic>))
        .toList();

    List<String>? parsedPhotos;
    if (json['photos'] != null) {
      parsedPhotos = (json['photos'] as List).map((p) => p.toString()).toList();
    }

    LocationCoordinates? parsedCoordinates;
    if (json['coordinates'] != null) {
      parsedCoordinates = LocationCoordinates.fromJson(json['coordinates'] as Map<String, dynamic>);
    }

    return Location(
      id: json['id'] as String? ?? json['_id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      slug: json['slug'] as String? ?? (json['slug'] is Map ? json['slug']['current'] as String? ?? '' : ''),
      address: json['address'] as String?,
      hours: json['hours'] as String?,
      coordinates: parsedCoordinates,
      distance: (json['distance'] as num?)?.toDouble(),
      rating: (json['rating'] as num?)?.toDouble(),
      image: json['image'] as String?,
      photos: parsedPhotos,
      activities: parsedActivities,
      vibeCounts: VibeCounts.fromJson(json['vibeCounts'] as Map<String, dynamic>?),
      description: json['description'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'slug': slug,
      'address': address,
      'hours': hours,
      'coordinates': coordinates?.toJson(),
      'distance': distance,
      'rating': rating,
      'image': image,
      'photos': photos,
      'activities': activities.map((a) => a.toJson()).toList(),
      'vibeCounts': vibeCounts.toJson(),
      'description': description,
    };
  }
}
