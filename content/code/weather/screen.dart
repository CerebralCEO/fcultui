import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

class HourlyForecast {
  const HourlyForecast(this.hour, this.temp);
  final String hour;
  final int temp;
}

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({
    super.key,
    this.accent = const Color(0xFF__ACCENT__),
    this.city = 'San Francisco',
    this.temp = 24,
    this.hourly = const [HourlyForecast('Now', 24), HourlyForecast('14', 25), HourlyForecast('15', 26), HourlyForecast('16', 24), HourlyForecast('17', 22)],
  });

  final Color accent;
  final String city;
  final int temp;
  final List<HourlyForecast> hourly;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with TickerProviderStateMixin {
  late final _rays = AnimationController(vsync: this, duration: const Duration(seconds: 12))..repeat();
  late final _cloud = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);

  @override
  void dispose() {
    _rays.dispose();
    _cloud.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    const glass = Color(0x24FFFFFF);
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [accent, Color.lerp(accent, const Color(0xFF0B1B3A), 0.6)!],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
            child: Column(children: [
              Text(widget.city, style: FcType.body.copyWith(color: Colors.white, fontWeight: FontWeight.w600)),
              Text('Tue, 18 June', style: FcType.small.copyWith(color: Colors.white70)),
              SizedBox(
                height: 196,
                child: Stack(children: [
                  Positioned(
                    top: 18,
                    left: 64,
                    child: SizedBox.square(
                      dimension: 150,
                      child: Stack(alignment: Alignment.center, children: [
                        RotationTransition(turns: _rays, child: CustomPaint(size: const Size.square(150), painter: _RaysPainter())),
                        Container(
                          width: 84,
                          height: 84,
                          decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFFFD76A), boxShadow: [BoxShadow(color: Color(0xCCFFD76A), blurRadius: 50)]),
                        ),
                      ]),
                    ),
                  ),
                  AnimatedBuilder(
                    animation: _cloud,
                    builder: (context, child) => Positioned(right: 44 - (_cloud.value * 36 - 14), top: 96, child: child!),
                    child: const _Cloud(),
                  ),
                ]),
              ),
              Text('${widget.temp}°', style: const TextStyle(fontSize: 100, fontWeight: FontWeight.w200, letterSpacing: -6, color: Colors.white, height: 1)),
              const SizedBox(height: 8),
              Text('Partly cloudy · H 26° L 17°', style: FcType.body.copyWith(color: Colors.white70)),
              const SizedBox(height: 14),
              Row(children: [
                for (final (label, value) in const [('Wind', '12 km/h'), ('Humidity', '48%'), ('UV', '5 Mod')]) ...[
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      decoration: BoxDecoration(color: glass, borderRadius: BorderRadius.circular(18)),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(label, style: FcType.small.copyWith(color: Colors.white70)),
                        Text(value, style: FcType.body.copyWith(color: Colors.white, fontWeight: FontWeight.w600)),
                      ]),
                    ),
                  ),
                  if (label != 'UV') const SizedBox(width: 10),
                ],
              ]),
              const Spacer(),
              Row(children: [
                for (var i = 0; i < widget.hourly.length; i++) ...[
                  Expanded(
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0, end: 1),
                      duration: Duration(milliseconds: 600 + 90 * i),
                      curve: FcMotion.easeOutExpo,
                      builder: (context, t, child) => Opacity(opacity: t, child: Transform.translate(offset: Offset(0, 10 * (1 - t)), child: child)),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(color: i == 0 ? const Color(0x4DFFFFFF) : const Color(0x1AFFFFFF), borderRadius: BorderRadius.circular(22)),
                        child: Column(children: [
                          Text(widget.hourly[i].hour, style: FcType.small.copyWith(color: Colors.white)),
                          const SizedBox(height: 8),
                          Container(width: 18, height: 18, decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFFFD76A))),
                          const SizedBox(height: 8),
                          Text('${widget.hourly[i].temp}°', style: FcType.body.copyWith(color: Colors.white, fontWeight: FontWeight.w600)),
                        ]),
                      ),
                    ),
                  ),
                  if (i < widget.hourly.length - 1) const SizedBox(width: 8),
                ],
              ]),
            ]),
          ),
        ),
      ),
    );
  }
}

class _Cloud extends StatelessWidget {
  const _Cloud();

  @override
  Widget build(BuildContext context) => SizedBox(
        width: 170,
        height: 100,
        child: Stack(clipBehavior: Clip.none, children: [
          Positioned(
            bottom: 0,
            child: Container(
              width: 170,
              height: 62,
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.96),
                borderRadius: BorderRadius.circular(40),
                boxShadow: const [BoxShadow(color: Color(0x1F000000), blurRadius: 40, offset: Offset(0, 20))],
              ),
            ),
          ),
          Positioned(left: 34, top: 0, child: Container(width: 78, height: 78, decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white.withValues(alpha: 0.96)))),
        ]),
      );
}

class _RaysPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final c = size.center(Offset.zero);
    final paint = Paint()
      ..color = const Color(0xE6FFDE78)
      ..strokeWidth = 7
      ..strokeCap = StrokeCap.round;
    for (var i = 0; i < 12; i++) {
      final a = i * math.pi / 6;
      final dir = Offset(math.cos(a), math.sin(a));
      canvas.drawLine(c + dir * 54, c + dir * 70, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
