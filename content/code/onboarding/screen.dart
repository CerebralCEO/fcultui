import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.onGetStarted});

  final Color accent;
  final VoidCallback? onGetStarted;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with SingleTickerProviderStateMixin {
  late final _loop = AnimationController(vsync: this, duration: const Duration(seconds: 6))..repeat();

  @override
  void dispose() {
    _loop.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    return Scaffold(
      backgroundColor: const Color(0xFFF5F0E8),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Container(width: 22, height: 22, decoration: BoxDecoration(color: accent, borderRadius: BorderRadius.circular(7))),
                const SizedBox(width: 8),
                Text('Bloom', style: FcType.body.copyWith(fontSize: 17, fontWeight: FontWeight.w700)),
                const Spacer(),
                Text('Skip', style: FcType.body.copyWith(color: FcColors.inkMuted)),
              ]),
              Expanded(
                child: AnimatedBuilder(
                  animation: _loop,
                  builder: (context, _) {
                    final t = _loop.value * 2 * math.pi;
                    return Stack(alignment: Alignment.center, children: [
                      Transform.rotate(angle: t, child: _Ring(accent: accent)),
                      Transform.rotate(
                        angle: math.sin(t) * 0.35,
                        child: Transform.scale(scale: 1 + math.sin(t) * 0.04, child: _Orb(accent: accent)),
                      ),
                      _Chip(label: '12-day streak', dot: accent, top: 40, left: -4, float: math.sin(t)),
                      _Chip(label: '+ Morning run', top: 170, right: -4, float: math.sin(t + 2)),
                      _Chip(label: 'Read 20 pages ✓', bottom: 20, left: 14, float: math.sin(t + 4)),
                    ]);
                  },
                ),
              ),
              Text('Grow a little\nevery day', style: FcType.display.copyWith(fontSize: 36)),
              const SizedBox(height: 12),
              Text('Build habits that stick with gentle reminders and beautiful progress.',
                  style: FcType.body.copyWith(fontSize: 16, color: FcColors.inkMuted)),
              const SizedBox(height: FcSpace.md),
              const _Dots(active: 0, count: 3),
              const SizedBox(height: FcSpace.md),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: FilledButton(
                  onPressed: widget.onGetStarted,
                  style: FilledButton.styleFrom(
                    backgroundColor: FcColors.ink,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(FcRadius.button)),
                  ),
                  child: const Text('Get started', style: FcType.button),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Orb extends StatelessWidget {
  const _Orb({required this.accent});
  final Color accent;

  @override
  Widget build(BuildContext context) => Container(
        width: 214,
        height: 214,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            center: const Alignment(0.2, 0.4),
            colors: [Color.lerp(accent, const Color(0xFFFFD166), 0.55)!, accent],
          ),
          boxShadow: [BoxShadow(color: accent.withValues(alpha: 0.6), blurRadius: 60, offset: const Offset(0, 30), spreadRadius: -12)],
        ),
      );
}

class _Ring extends StatelessWidget {
  const _Ring({required this.accent});
  final Color accent;

  @override
  Widget build(BuildContext context) => Container(
        width: 290,
        height: 290,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(width: 2.5, color: Colors.transparent),
          gradient: SweepGradient(colors: [accent, const Color(0xFFFFD166), Colors.transparent, accent]),
        ),
        child: Container(margin: const EdgeInsets.all(2.5), decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFF5F0E8))),
      );
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, this.dot, this.top, this.left, this.right, this.bottom, this.float = 0});
  final String label;
  final Color? dot;
  final double? top, left, right, bottom;
  final double float;

  @override
  Widget build(BuildContext context) => Positioned(
        top: top, left: left, right: right, bottom: bottom,
        child: Transform.translate(
          offset: Offset(0, float * -6),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
            decoration: BoxDecoration(
              color: FcColors.paper,
              borderRadius: BorderRadius.circular(FcRadius.pill),
              boxShadow: const [BoxShadow(color: Color(0x14000000), blurRadius: 24, offset: Offset(0, 8))],
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              if (dot != null) ...[
                Container(width: 8, height: 8, decoration: BoxDecoration(color: dot, shape: BoxShape.circle)),
                const SizedBox(width: 6),
              ],
              Text(label, style: FcType.small.copyWith(fontWeight: FontWeight.w600)),
            ]),
          ),
        ),
      );
}

class _Dots extends StatelessWidget {
  const _Dots({required this.active, required this.count});
  final int active, count;

  @override
  Widget build(BuildContext context) => Row(
        children: List.generate(count, (i) {
          final on = i == active;
          return AnimatedContainer(
            duration: FcMotion.fast,
            curve: FcMotion.easeOutExpo,
            margin: const EdgeInsets.only(right: 6),
            width: on ? 26 : 8,
            height: 8,
            decoration: BoxDecoration(color: on ? FcColors.ink : const Color(0x26000000), borderRadius: BorderRadius.circular(4)),
          );
        }),
      );
}
