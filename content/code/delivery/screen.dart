import 'dart:ui' show PathMetric;
import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.minutesLeft = 12, this.step = 2});

  final Color accent;
  final int minutesLeft;

  /// 0 = placed, 1 = picked up, 2 = on the way, 3 = delivered.
  final int step;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with SingleTickerProviderStateMixin {
  late final _travel = AnimationController(vsync: this, duration: const Duration(seconds: 5))..repeat(reverse: true);

  // Route drawn in the same 390 × 520 map space as the React Native SVG.
  static final Path _route = Path()
    ..moveTo(96, 438)
    ..cubicTo(90, 360, 150, 330, 200, 300)
    ..cubicTo(250, 270, 270, 200, 285, 120);

  @override
  void dispose() {
    _travel.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(children: [
        SizedBox(
          height: 520,
          width: double.infinity,
          child: FittedBox(
            fit: BoxFit.fill,
            child: SizedBox(
              width: 390,
              height: 520,
              child: AnimatedBuilder(
                animation: _travel,
                builder: (context, _) {
                  final metric = _route.computeMetrics().first;
                  final t = 0.04 + Curves.easeInOut.transform(_travel.value) * 0.92;
                  final pos = metric.getTangentForOffset(metric.length * t)!.position;
                  return Stack(children: [
                    CustomPaint(size: const Size(390, 520), painter: _MapPainter(route: _route, accent: accent, metric: metric)),
                    _pin(const Offset(96, 438), accent),
                    _pin(const Offset(285, 120), FcColors.ink, square: true),
                    Positioned(
                      left: pos.dx - 13,
                      top: pos.dy - 13,
                      child: Container(
                        width: 26,
                        height: 26,
                        decoration: BoxDecoration(
                          color: accent,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 5),
                          boxShadow: [BoxShadow(color: accent.withValues(alpha: 0.22), spreadRadius: 8), const BoxShadow(color: Color(0x33000000), blurRadius: 14, offset: Offset(0, 6))],
                        ),
                      ),
                    ),
                  ]);
                },
              ),
            ),
          ),
        ),
        SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 6, 20, 0),
            child: Row(children: [
              const CircleAvatar(radius: 22, backgroundColor: Colors.white, child: Icon(Icons.arrow_back_ios_new_rounded, size: 16, color: FcColors.ink)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(FcRadius.pill), boxShadow: const [BoxShadow(color: Color(0x14000000), blurRadius: 14, offset: Offset(0, 4))]),
                child: Text('Order #4821', style: FcType.small.copyWith(fontWeight: FontWeight.w600)),
              ),
            ]),
          ),
        ),
        Align(
          alignment: Alignment.bottomCenter,
          child: Container(
            height: 360,
            padding: const EdgeInsets.fromLTRB(FcSpace.lg, 12, FcSpace.lg, 0),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
              boxShadow: [BoxShadow(color: Color(0x14000000), blurRadius: 30, offset: Offset(0, -10))],
            ),
            child: SafeArea(
              top: false,
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Center(child: Container(width: 40, height: 5, decoration: BoxDecoration(color: const Color(0xFFDDDDDD), borderRadius: BorderRadius.circular(3)))),
                const SizedBox(height: 18),
                Text('Arriving in', style: FcType.small.copyWith(color: FcColors.inkMuted)),
                Text('${widget.minutesLeft} min', style: FcType.title.copyWith(fontSize: 32)),
                const SizedBox(height: 18),
                Row(children: [
                  for (var i = 0; i < 4; i++) ...[
                    Expanded(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(3),
                        child: TweenAnimationBuilder<double>(
                          tween: Tween(begin: 0, end: i < widget.step ? 1 : (i == widget.step ? 0.45 : 0)),
                          duration: Duration(milliseconds: 900 + 500 * i),
                          curve: FcMotion.easeOutExpo,
                          builder: (context, v, _) => LinearProgressIndicator(value: v, minHeight: 6, color: accent, backgroundColor: const Color(0xFFEEEEEE)),
                        ),
                      ),
                    ),
                    if (i < 3) const SizedBox(width: 6),
                  ],
                ]),
                const SizedBox(height: 12),
                Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  for (final l in ['Picked up', 'On the way', 'Delivered']) Text(l, style: FcType.small.copyWith(color: FcColors.inkMuted)),
                ]),
                const Spacer(),
                Row(children: [
                  const CircleAvatar(radius: 22, backgroundColor: Color(0xFF14B8A6)),
                  const SizedBox(width: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Daniel K.', style: FcType.body.copyWith(fontWeight: FontWeight.w600)),
                    Text('★ 4.9 · Courier', style: FcType.small.copyWith(color: FcColors.inkMuted)),
                  ]),
                  const Spacer(),
                  const CircleAvatar(radius: 23, backgroundColor: Color(0xFFF2F3F5), child: Icon(Icons.chat_bubble_outline_rounded, size: 18, color: FcColors.ink)),
                  const SizedBox(width: 12),
                  CircleAvatar(radius: 23, backgroundColor: accent, child: const Icon(Icons.call_rounded, size: 18, color: Colors.white)),
                ]),
                const SizedBox(height: 14),
              ]),
            ),
          ),
        ),
      ]),
    );
  }

  Widget _pin(Offset at, Color color, {bool square = false}) => Positioned(
        left: at.dx - 14,
        top: at.dy - 14,
        child: Container(
          width: 28,
          height: 28,
          alignment: Alignment.center,
          decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Color(0x2E000000), blurRadius: 16, offset: Offset(0, 6))]),
          child: Container(width: 12, height: 12, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(square ? 3 : 6))),
        ),
      );
}

class _MapPainter extends CustomPainter {
  _MapPainter({required this.route, required this.accent, required this.metric});
  final Path route;
  final Color accent;
  final PathMetric metric;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.drawRect(Offset.zero & size, Paint()..color = const Color(0xFFE8EDF1));
    final road = Paint()
      ..style = PaintingStyle.stroke
      ..color = Colors.white;
    canvas.drawPath(Path()..moveTo(-10, 140)..cubicTo(120, 120, 220, 190, 400, 150), road..strokeWidth = 18);
    canvas.drawLine(const Offset(60, -10), const Offset(110, 540), road..strokeWidth = 14);
    canvas.drawPath(Path()..moveTo(-10, 360)..cubicTo(150, 330, 260, 420, 400, 380), road..strokeWidth = 16);
    canvas.drawLine(const Offset(290, -10), const Offset(250, 540), road..strokeWidth = 12);
    final park = Paint()..color = const Color(0xFFCFE8D3);
    canvas.drawOval(Rect.fromCenter(center: const Offset(185, 265), width: 124, height: 88), park);
    canvas.drawOval(Rect.fromCenter(center: const Offset(340, 470), width: 140, height: 100), park);

    // Dashed route: 8 on, 10 off.
    final dash = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round
      ..color = accent;
    for (var d = 0.0; d < metric.length; d += 18) {
      canvas.drawPath(metric.extractPath(d, d + 8), dash);
    }
  }

  @override
  bool shouldRepaint(covariant _MapPainter old) => old.accent != accent;
}
