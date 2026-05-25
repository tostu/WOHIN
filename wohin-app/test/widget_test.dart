import 'package:flutter_test/flutter_test.dart';
import 'package:wohin_app/models/activity.dart';

void main() {
  test('Activity model JSON parsing test', () {
    final json = {
      'id': 'study-id',
      'name': 'Study',
      'slug': 'study',
      'themeColor': 'matcha',
      'icon': '📚',
    };

    final activity = Activity.fromJson(json);

    expect(activity.id, 'study-id');
    expect(activity.name, 'Study');
    expect(activity.slug, 'study');
    expect(activity.themeColor, 'matcha');
    expect(activity.icon, '📚');
  });
}
