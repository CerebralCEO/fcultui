import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.playing = true});

  final Color accent;
  final bool playing;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with TickerProviderStateMixin {
  late final _spin = AnimationController(vsync: this, duration: const Duration(milliseconds: 3200));
  late final _eq = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
  late bool _playing = widget.playing;

  @override
  void initState() {
    super.initState();
    _sync();
  }

  void _sync() {
    if (_playing) {
      _spin.repeat();
      _eq.repeat(reverse: true);
    } else {
      _spin.stop();
      _eq.stop();
    }
  }

  @override
  void dispose() {
    _spin.dispose();
    _eq.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: const [0, 0.62],
            colors: [Color.lerp(accent, Colors.black, 0.4)!, const Color(0xFF0A0A0B)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
            child: Column(children: [
              Row(children: [
                const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.white),
                const Spacer(),
                Text('NOW PLAYING', style: FcType.small.copyWith(color: Colors.white70, letterSpacing: 1.3, fontWeight: FontWeight.w600)),
                const Spacer(),
                const Icon(Icons.more_horiz_rounded, color: Colors.white),
              ]),
              const SizedBox(height: 18),
              AspectRatio(
                aspectRatio: 1,
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(FcRadius.card),
                    gradient: RadialGradient(
                      center: const Alignment(-0.45, -0.5),
                      radius: 1.2,
                      colors: [Color.lerp(accent, Colors.white, 0.35)!, accent, Color.lerp(accent, Colors.black, 0.55)!],
                      stops: const [0, 0.42, 1],
                    ),
                    boxShadow: const [BoxShadow(color: Color(0xB3000000), blurRadius: 60, offset: Offset(0, 30), spreadRadius: -20)],
                  ),
                  child: Center(child: RotationTransition(turns: _spin, child: _Vinyl(accent: accent))),
                ),
              ),
              const SizedBox(height: 18),
              Row(children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Midnight Drive', style: FcType.title.copyWith(fontSize: 26, color: Colors.white)),
                  Text('Neon Coast', style: FcType.body.copyWith(color: FcColors.nightMuted)),
                ]),
                const Spacer(),
                Icon(Icons.favorite_rounded, color: accent, size: 26),
              ]),
              const SizedBox(height: 18),
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0.36, end: _playing ? 0.78 : 0.36),
                duration: const Duration(seconds: 5),
                builder: (context, v, _) => ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(value: v, minHeight: 5, color: Colors.white, backgroundColor: Colors.white24),
                ),
              ),
              const SizedBox(height: 10),
              Row(children: [
                Text('1:24', style: FcType.small.copyWith(color: FcColors.nightMuted)),
                const Spacer(),
                Text('3:48', style: FcType.small.copyWith(color: FcColors.nightMuted)),
              ]),
              const SizedBox(height: 18),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Icon(Icons.shuffle_rounded, color: Colors.white54),
                const Icon(Icons.skip_previous_rounded, color: Colors.white, size: 34),
                GestureDetector(
                  onTap: () => setState(() {
                    _playing = !_playing;
                    _sync();
                  }),
                  child: Container(
                    width: 76,
                    height: 76,
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                    child: Icon(_playing ? Icons.pause_rounded : Icons.play_arrow_rounded, size: 36, color: FcColors.ink),
                  ),
                ),
                const Icon(Icons.skip_next_rounded, color: Colors.white, size: 34),
                const Icon(Icons.repeat_rounded, color: Colors.white54),
              ]),
              const Spacer(),
              SizedBox(
                height: 44,
                child: AnimatedBuilder(
                  animation: _eq,
                  builder: (context, _) => Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    for (var i = 0; i < 28; i++) ...[
                      Expanded(
                        child: FractionallySizedBox(
                          heightFactor: 0.25 + 0.75 * ((math.sin(_eq.value * math.pi + i * 0.9) + 1) / 2),
                          child: Container(decoration: BoxDecoration(color: Colors.white38, borderRadius: BorderRadius.circular(2))),
                        ),
                      ),
                      if (i < 27) const SizedBox(width: 4),
                    ],
                  ]),
                ),
              ),
            ]),
          ),
        ),
      ),
    );
  }
}

class _Vinyl extends StatelessWidget {
  const _Vinyl({required this.accent});
  final Color accent;

  @override
  Widget build(BuildContext context) => Container(
        width: 230,
        height: 230,
        decoration: const BoxDecoration(
          shape: BoxShape.circle,
          color: Color(0xFF151515),
          boxShadow: [BoxShadow(color: Color(0x73000000), blurRadius: 40, offset: Offset(0, 20))],
        ),
        child: CustomPaint(
          painter: _GroovePainter(),
          child: Center(
            child: Container(
              width: 76,
              height: 76,
              decoration: BoxDecoration(color: accent, shape: BoxShape.circle),
              child: Center(child: Container(width: 10, height: 10, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle))),
            ),
          ),
        ),
      );
}

class _GroovePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1
      ..color = const Color(0xFF232323);
    for (var r = 40.0; r < size.width / 2; r += 5) {
      canvas.drawCircle(size.center(Offset.zero), r, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
