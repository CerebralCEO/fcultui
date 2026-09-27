import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatelessWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__)});

  final Color accent;

  static const _week = [0.42, 0.68, 0.51, 0.90, 0.62, 0.76, 0.38];
  static const _tx = [
    ('Spotify', 'Subscription', '-\$9.99', Color(0xFF1DB954)),
    ('Salary', 'Acme Inc.', '+\$4,200', null),
    ('Blue Bottle', 'Coffee', '-\$6.50', Color(0xFFC08457)),
  ];

  @override
  Widget build(BuildContext context) {
    const muted = FcColors.nightMuted;
    return Scaffold(
      backgroundColor: const Color(0xFF0D0E12),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
          children: [
            Row(children: [
              const CircleAvatar(radius: 22, backgroundColor: Color(0xFFF472B6)),
              const SizedBox(width: 12),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Good morning', style: FcType.small.copyWith(color: muted)),
                Text('Sara Lee', style: FcType.body.copyWith(color: Colors.white, fontWeight: FontWeight.w600)),
              ]),
              const Spacer(),
              const CircleAvatar(radius: 22, backgroundColor: FcColors.nightCard, child: Icon(Icons.notifications_none_rounded, color: Colors.white, size: 20)),
            ]),
            const SizedBox(height: 20),
            _BalanceCard(accent: accent),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                for (final label in ['Send', 'Request', 'Top up', 'More'])
                  Column(children: [
                    Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(color: const Color(0xFF16171C), borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFF23252B))),
                      child: Center(child: Container(width: 20, height: 20, decoration: BoxDecoration(borderRadius: BorderRadius.circular(6), border: Border.all(color: accent, width: 2)))),
                    ),
                    const SizedBox(height: 8),
                    Text(label, style: FcType.small.copyWith(fontSize: 12, color: muted)),
                  ]),
              ],
            ),
            const SizedBox(height: 20),
            Row(children: [
              Text('Spending', style: FcType.body.copyWith(color: Colors.white, fontWeight: FontWeight.w600)),
              const Spacer(),
              Text('This week', style: FcType.small.copyWith(color: muted)),
            ]),
            const SizedBox(height: 20),
            SizedBox(
              height: 128,
              child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                for (var i = 0; i < _week.length; i++) ...[
                  Expanded(child: _Bar(value: _week[i], label: 'MTWTFSS'[i], index: i, color: i == 3 ? accent : const Color(0xFF22242B))),
                  if (i < _week.length - 1) const SizedBox(width: 12),
                ],
              ]),
            ),
            const SizedBox(height: 20),
            for (final (name, sub, amount, color) in _tx)
              Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Row(children: [
                  Container(width: 44, height: 44, decoration: BoxDecoration(color: color ?? accent, borderRadius: BorderRadius.circular(14))),
                  const SizedBox(width: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(name, style: FcType.body.copyWith(color: Colors.white, fontWeight: FontWeight.w600)),
                    Text(sub, style: FcType.small.copyWith(color: muted)),
                  ]),
                  const Spacer(),
                  Text(amount, style: FcType.body.copyWith(fontWeight: FontWeight.w600, color: amount.startsWith('+') ? FcColors.positive : Colors.white)),
                ]),
              ),
          ],
        ),
      ),
    );
  }
}

class _BalanceCard extends StatelessWidget {
  const _BalanceCard({required this.accent});
  final Color accent;

  @override
  Widget build(BuildContext context) => ClipRRect(
        borderRadius: BorderRadius.circular(FcRadius.card),
        child: Container(
          height: 196,
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [accent, Color.lerp(accent, Colors.black, 0.45)!]),
          ),
          child: Stack(clipBehavior: Clip.none, children: [
            Positioned(top: -112, right: -92, child: _circle(230)),
            Positioned(bottom: -118, right: 18, child: _circle(160)),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Total balance', style: FcType.small.copyWith(color: Colors.white70)),
              const SizedBox(height: 6),
              Text('\$24,830.50', style: FcType.display.copyWith(fontSize: 36, color: Colors.white)),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(FcRadius.pill)),
                child: const Text('+2.4% this month', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
              ),
              const Spacer(),
              const Row(children: [
                Text('•••• 4291', style: TextStyle(color: Colors.white70, letterSpacing: 1.7)),
                Spacer(),
                Text('VISA', style: TextStyle(color: Colors.white70, letterSpacing: 1.7)),
              ]),
            ]),
          ]),
        ),
      );

  Widget _circle(double size) => Container(width: size, height: size, decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0x1AFFFFFF)));
}

class _Bar extends StatelessWidget {
  const _Bar({required this.value, required this.label, required this.index, required this.color});
  final double value;
  final String label;
  final int index;
  final Color color;

  @override
  Widget build(BuildContext context) => Column(children: [
        Expanded(
          child: Align(
            alignment: Alignment.bottomCenter,
            // Bars grow in with a 70 ms stagger — same timing as the RN version.
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: value),
              duration: FcMotion.medium + Duration(milliseconds: 70 * index),
              curve: FcMotion.easeOutExpo,
              builder: (context, v, _) => FractionallySizedBox(
                heightFactor: v,
                child: Container(decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(8))),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, style: FcType.small.copyWith(fontSize: 11, color: FcColors.nightMuted)),
      ]);
}
