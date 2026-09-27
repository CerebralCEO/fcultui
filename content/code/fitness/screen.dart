import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

class ActivityRing {
  const ActivityRing(this.label, this.value, this.goal, this.unit, this.color);
  final String label, unit;
  final int value, goal;
  final Color color;
  double get progress => (value / goal).clamp(0, 1.5);
}

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatelessWidget {
  const __NAME__Screen({
    super.key,
    this.accent = const Color(0xFF__ACCENT__),
    this.rings = const [
      ActivityRing('Move', 420, 500, 'KCAL', Color(0xFFFA114F)),
      ActivityRing('Exercise', 32, 30, 'MIN', Color(0xFFA6FF00)),
      ActivityRing('Stand', 9, 12, 'HRS', Color(0xFF00D8FF)),
    ],
    this.week = const [0.60, 0.80, 0.45, 0.95, 0.70, 0.30, 0.84],
  });

  final Color accent;
  final List<ActivityRing> rings;
  final List<double> week;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('TUESDAY, JUN 18', style: FcType.small.copyWith(color: FcColors.nightMuted, letterSpacing: 1.3, fontWeight: FontWeight.w600)),
            Text('Activity', style: FcType.display.copyWith(color: Colors.white)),
            const SizedBox(height: 20),
            Center(
              child: SizedBox.square(
                dimension: 280,
                child: TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: 1),
                  duration: const Duration(milliseconds: 1800),
                  curve: FcMotion.easeOutExpo,
                  builder: (context, t, _) => CustomPaint(painter: _RingsPainter(rings: rings, t: t)),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Row(children: [
              for (var i = 0; i < rings.length; i++) ...[
                Expanded(child: _Stat(ring: rings[i])),
                if (i < rings.length - 1) const SizedBox(width: 10),
              ],
            ]),
            const Spacer(),
            SizedBox(
              height: 96,
              child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                for (var i = 0; i < week.length; i++) ...[
                  Expanded(
                    child: Column(children: [
                      Expanded(
                        child: Align(
                          alignment: Alignment.bottomCenter,
                          child: TweenAnimationBuilder<double>(
                            tween: Tween(begin: 0, end: week[i]),
                            duration: FcMotion.medium + Duration(milliseconds: 400 + 60 * i),
                            curve: FcMotion.easeOutExpo,
                            builder: (context, v, _) => FractionallySizedBox(
                              heightFactor: v,
                              child: Container(decoration: BoxDecoration(color: accent.withValues(alpha: 0.85), borderRadius: BorderRadius.circular(6))),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text('MTWTFSS'[i], style: FcType.small.copyWith(fontSize: 11, color: FcColors.nightMuted)),
                    ]),
                  ),
                  if (i < week.length - 1) const SizedBox(width: 10),
                ],
              ]),
            ),
          ]),
        ),
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.ring});
  final ActivityRing ring;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: const Color(0xFF141416), borderRadius: BorderRadius.circular(16)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(ring.label, style: FcType.small.copyWith(color: Colors.white)),
          const SizedBox(height: 4),
          Text.rich(TextSpan(children: [
            TextSpan(text: '${ring.value}/${ring.goal}', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, letterSpacing: -0.6, color: ring.color)),
            TextSpan(text: ' ${ring.unit}', style: TextStyle(fontSize: 11, color: ring.color.withValues(alpha: 0.8))),
          ])),
        ]),
      );
}

class _RingsPainter extends CustomPainter {
  _RingsPainter({required this.rings, required this.t});
  final List<ActivityRing> rings;
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final center = size.center(Offset.zero);
    const stroke = 22.0;
    for (var i = 0; i < rings.length; i++) {
      final r = 118.0 - i * 26;
      final ring = rings[i];
      final track = Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = stroke
        ..color = ring.color.withValues(alpha: 0.22);
      final arc = Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = stroke
        ..strokeCap = StrokeCap.round
        ..color = ring.color;
      canvas.drawCircle(center, r, track);
      // Each ring starts 150 ms after the previous one.
      final local = ((t * 1.8 - i * 0.15) / 1.5).clamp(0.0, 1.0);
      canvas.drawArc(Rect.fromCircle(center: center, radius: r), -math.pi / 2, 2 * math.pi * ring.progress * local, false, arc);
    }
  }

  @override
  bool shouldRepaint(_RingsPainter old) => old.t != t;
}
