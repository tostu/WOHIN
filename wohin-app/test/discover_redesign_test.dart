import 'package:flutter_test/flutter_test.dart';
import 'package:wohin_app/models/curated_list.dart';
import 'package:wohin_app/models/location.dart';

void main() {
  group('Discover Redesign Filtering Tests', () {
    test('CuratedList vibe and search matching logic test', () {
      final CozyKeywords = ['coffee', 'cafe', 'café', 'book', 'tea'];

      final cozyGuide = CuratedList(
        id: '1',
        title: 'Best Coffee Corners in Berlin',
        slug: 'best-coffee-corners',
        emoji: '☕',
        description: 'A cozy guide for slow coffee lovers',
        locations: [
          Location(
            id: 'loc1',
            name: 'Barn Coffee Roast',
            slug: 'barn-coffee',
            activities: [],
            vibeCounts: VibeCounts(),
          ),
        ],
      );

      final wildGuide = CuratedList(
        id: '2',
        title: 'Late Night Dance Clubs',
        slug: 'late-night-dance',
        emoji: '🔥',
        description: 'For those who want to let the night win',
        locations: [
          Location(
            id: 'loc2',
            name: 'Berghain',
            slug: 'berghain',
            activities: [],
            vibeCounts: VibeCounts(),
          ),
        ],
      );

      // Function representing the matching logic
      bool matchesVibe(CuratedList guide, String vibeName, List<String> keywords) {
        final text = '${guide.title} ${guide.description ?? ""}'.toLowerCase();
        return keywords.any((k) => text.contains(k.toLowerCase())) ||
               text.contains(vibeName.toLowerCase());
      }

      bool matchesSearch(CuratedList guide, String query) {
        final titleMatch = guide.title.toLowerCase().contains(query.toLowerCase());
        final descMatch = guide.description?.toLowerCase().contains(query.toLowerCase()) ?? false;
        return titleMatch || descMatch;
      }

      // Vibe Matching tests
      expect(matchesVibe(cozyGuide, 'Cozy', CozyKeywords), isTrue); // Matches "coffee" and "cozy"
      expect(matchesVibe(wildGuide, 'Cozy', CozyKeywords), isFalse); // Does not match cozy keywords

      // Search matching tests
      expect(matchesSearch(cozyGuide, 'Coffee'), isTrue);
      expect(matchesSearch(cozyGuide, 'Dance'), isFalse);
      expect(matchesSearch(wildGuide, 'dance'), isTrue);
    });
  });
}
