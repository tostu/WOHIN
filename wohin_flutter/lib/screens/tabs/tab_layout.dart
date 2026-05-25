import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../../theme/theme.dart';
import 'home_tab.dart';
import 'discover_tab.dart';
import 'map_tab.dart';
import 'profile_tab.dart';

class TabLayout extends StatefulWidget {
  const TabLayout({super.key});

  @override
  State<TabLayout> createState() => _TabLayoutState();
}

class _TabLayoutState extends State<TabLayout> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    const HomeTab(),
    const DiscoverTab(),
    const MapTab(),
    const ProfileTab(),
  ];

  void _onTabTapped(int index) {
    HapticFeedback.selectionClick();
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.colors;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: colors.surface,
          border: Border(
            top: BorderSide(color: colors.border, width: 1),
          ),
          boxShadow: [
            BoxShadow(
              color: colors.shadow.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTabTapped,
          backgroundColor: colors.surface,
          selectedItemColor: colors.ink,
          unselectedItemColor: colors.muted,
          type: BottomNavigationBarType.fixed,
          elevation: 0,
          selectedFontSize: 12,
          unselectedFontSize: 12,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w900),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.house, size: 22),
              activeIcon: Icon(LucideIcons.house, size: 22),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.sparkles, size: 22),
              activeIcon: Icon(LucideIcons.sparkles, size: 22),
              label: 'Discover',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.map, size: 22),
              activeIcon: Icon(LucideIcons.map, size: 22),
              label: 'Map',
            ),
            BottomNavigationBarItem(
              icon: Icon(LucideIcons.user, size: 22),
              activeIcon: Icon(LucideIcons.user, size: 22),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
