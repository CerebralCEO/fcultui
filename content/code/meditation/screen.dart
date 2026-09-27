import 'dart:async';
import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.session = const Duration(minutes: 4, seconds: 32)});

  final Color accent;
  final Duration session;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with SingleTickerProviderStateMixin {
  // One inhale (4 s) + one exhale (4 s).
  late final _breath = AnimationController(vsync: this, duration: const Duration(seconds: 4))..repeat(reverse: true);
  late Duration _left = widget.session;
  Timer? _timer;
  bool _paused = false;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!_paused && _left > Duration.zero) setState(() => _left -= const Duration(seconds: 1));
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _breath.dispose();
    super.dispose();
  }

  void _toggle() {
    setState(() => _paused = !_paused);
    _paused ? _breath.stop() : _breath.repeat(reverse: true);
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    final mm = _left.inMinutes.toString().padLeft(2, '0');
    final ss = (_left.inSeconds % 60).toString().padLeft(2, '0');

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: const Alignment(0, -0.24),
            radius: 1.1,
            colors: [Color.lerp(const Color(0xFF062A28), accent, 0.38)!, const Color(0xFF041514)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
            child: Column(children: [
              Row(children: [
                const Icon(Icons.close_rounded, color: Colors.white),
                const Spacer(),
                Text('BREATHE', style: FcType.small.copyWith(color: Colors.white, letterSpacing: 1.3, fontWeight: FontWeight.w600)),
                const Spacer(),
                const Icon(Icons.more_horiz_rounded, color: Colors.white),
              ]),
              Expanded(
                child: AnimatedBuilder(
                  animation: _breath,
                  builder: (context, _) {
                    final t = Curves.easeInOut.transform(_breath.value);
                    final scale = 0.82 + t * 0.24;
                    final inhaling = _breath.status == AnimationStatus.forward;
                    return Stack(alignment: Alignment.center, children: [
                      for (final (size, alpha) in const [(300.0, 0.08), (240.0, 0.14), (184.0, 0.24)])
                        Transform.scale(
                          scale: scale,
                          child: Container(width: size, height: size, decoration: BoxDecoration(shape: BoxShape.circle, color: accent.withValues(alpha: alpha))),
                        ),
                      Transform.scale(
                        scale: scale,
                        child: Container(
                          width: 132,
                          height: 132,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(shape: BoxShape.circle, color: accent),
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 600),
                            child: Text(
                              inhaling ? 'Breathe in' : 'Breathe out',
                              key: ValueKey(inhaling),
                              style: FcType.body.copyWith(fontSize: 17, fontWeight: FontWeight.w700, color: const Color(0xFF042220)),
                            ),
                          ),
                        ),
                      ),
                    ]);
                  },
                ),
              ),
              Text('$mm:$ss', style: const TextStyle(fontSize: 46, fontWeight: FontWeight.w300, letterSpacing: -1.8, color: Colors.white, fontFeatures: [FontFeature.tabularFigures()])),
              const SizedBox(height: 8),
              Text('Relax your shoulders and follow the circle', textAlign: TextAlign.center, style: FcType.body.copyWith(color: FcColors.nightMuted)),
              const SizedBox(height: 26),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                _ghost(Icons.replay_rounded, () => setState(() => _left = widget.session)),
                const SizedBox(width: 40),
                GestureDetector(
                  onTap: _toggle,
                  child: Container(
                    width: 74,
                    height: 74,
                    decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                    child: Icon(_paused ? Icons.play_arrow_rounded : Icons.pause_rounded, size: 34, color: FcColors.ink),
                  ),
                ),
                const SizedBox(width: 40),
                _ghost(Icons.music_note_rounded, () {}),
              ]),
            ]),
          ),
        ),
      ),
    );
  }

  Widget _ghost(IconData icon, VoidCallback onTap) => GestureDetector(
        onTap: onTap,
        child: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white24, width: 1.5)),
          child: Icon(icon, color: Colors.white70, size: 20),
        ),
      );
}
