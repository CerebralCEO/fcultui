import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

class SettingsRow {
  const SettingsRow(this.label, this.color, {this.value, this.toggle});
  final String label;
  final Color color;
  final String? value;
  final bool? toggle;
}

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.onChanged});

  /// Tint used for switches (defaults to the iOS system green).
  final Color accent;
  final void Function(String label, bool value)? onChanged;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> {
  final _groups = <List<SettingsRow>>[
    const [
      SettingsRow('Airplane Mode', Color(0xFFFF9500), toggle: false),
      SettingsRow('Wi-Fi', Color(0xFF0A84FF), value: 'Home'),
      SettingsRow('Bluetooth', Color(0xFF0A84FF), value: 'On'),
    ],
    const [
      SettingsRow('Notifications', Color(0xFFFF3B30), toggle: true),
      SettingsRow('Focus', Color(0xFF5E5CE6), toggle: false),
      SettingsRow('Dark Mode', Color(0xFF1C1C1E), toggle: false),
      SettingsRow('Haptics', Color(0xFFFF2D55), toggle: true),
    ],
  ];
  late final _state = {for (final g in _groups) for (final r in g) if (r.toggle != null) r.label: r.toggle!};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF2F2F7),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
          children: [
            Text('Settings', style: FcType.display.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            Container(
              height: 38,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              alignment: Alignment.centerLeft,
              decoration: BoxDecoration(color: const Color(0x1F767680), borderRadius: BorderRadius.circular(12)),
              child: const Row(children: [
                Icon(Icons.search_rounded, size: 18, color: Color(0x993C3C43)),
                SizedBox(width: 6),
                Text('Search', style: TextStyle(color: Color(0x993C3C43), fontSize: 15)),
              ]),
            ),
            const SizedBox(height: 14),
            _Group(children: [
              SizedBox(
                height: 76,
                child: Row(children: [
                  const CircleAvatar(radius: 28, backgroundColor: Color(0xFF6366F1)),
                  const SizedBox(width: 12),
                  Column(mainAxisAlignment: MainAxisAlignment.center, crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Sara Lee', style: FcType.body.copyWith(fontWeight: FontWeight.w600)),
                    Text('Account, sync & more', style: FcType.small.copyWith(color: FcColors.inkMuted)),
                  ]),
                  const Spacer(),
                  const Icon(Icons.chevron_right_rounded, color: Color(0xFFC4C4C7)),
                ]),
              ),
            ]),
            for (final group in _groups) ...[
              const SizedBox(height: 14),
              _Group(children: [
                for (final row in group)
                  SizedBox(
                    height: 50,
                    child: Row(children: [
                      Container(width: 30, height: 30, decoration: BoxDecoration(color: row.color, borderRadius: BorderRadius.circular(8))),
                      const SizedBox(width: 12),
                      Text(row.label, style: FcType.body),
                      const Spacer(),
                      if (row.toggle != null)
                        Switch.adaptive(
                          value: _state[row.label]!,
                          activeTrackColor: widget.accent,
                          onChanged: (v) {
                            setState(() => _state[row.label] = v);
                            widget.onChanged?.call(row.label, v);
                          },
                        )
                      else ...[
                        Text(row.value!, style: FcType.body.copyWith(color: FcColors.inkMuted)),
                        const Icon(Icons.chevron_right_rounded, color: Color(0xFFC4C4C7)),
                      ],
                    ]),
                  ),
              ]),
            ],
          ],
        ),
      ),
    );
  }
}

class _Group extends StatelessWidget {
  const _Group({required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
        child: Column(children: [
          for (var i = 0; i < children.length; i++) ...[
            if (i > 0) const Divider(height: 1, color: Color(0xFFECECF0)),
            children[i],
          ],
        ]),
      );
}
