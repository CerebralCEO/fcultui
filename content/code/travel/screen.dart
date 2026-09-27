import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__)});

  final Color accent;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with TickerProviderStateMixin {
  late final _drift = AnimationController(vsync: this, duration: const Duration(seconds: 6))..repeat(reverse: true);
  late final _rise = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400))..forward();
  int _chip = 0;

  static const _chips = ['Mountains', 'Beaches', 'Cities', 'Forests'];
  static const _popular = [
    ('Lofoten', [Color(0xFFA5B4FC), Color(0xFF1E3A8A)]),
    ('Dolomites', [Color(0xFFFDE68A), Color(0xFFB45309)]),
    ('Patagonia', [Color(0xFF99F6E4), Color(0xFF115E59)]),
    ('Kyoto', [Color(0xFFFBCFE8), Color(0xFF9D174D)]),
  ];

  @override
  void dispose() {
    _drift.dispose();
    _rise.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    return Scaffold(
      backgroundColor: const Color(0xFFF6F4F0),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, 0, FcSpace.md),
          children: [
            Padding(
              padding: const EdgeInsets.only(right: FcSpace.lg),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Where to next?', style: FcType.small.copyWith(color: FcColors.inkMuted)),
                    Text('Explore', style: FcType.title),
                  ]),
                  const Spacer(),
                  const CircleAvatar(radius: 22, backgroundColor: Color(0xFFFB7185)),
                ]),
                const SizedBox(height: 16),
                Container(
                  height: 50,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(FcRadius.field)),
                  child: Row(children: [
                    const Icon(Icons.search_rounded, size: 18, color: Colors.black38),
                    const SizedBox(width: 10),
                    Text('Search destinations', style: FcType.body.copyWith(color: FcColors.inkMuted)),
                  ]),
                ),
                const SizedBox(height: 16),
                ClipRRect(
                  borderRadius: BorderRadius.circular(FcRadius.card),
                  child: SizedBox(
                    height: 250,
                    child: AnimatedBuilder(
                      animation: Listenable.merge([_drift, _rise]),
                      builder: (context, _) => Stack(children: [
                        Positioned.fill(
                          child: DecoratedBox(
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFFFBD9A8), Color(0xFFF5AB8C), Color(0xFFE88F7D)]),
                            ),
                          ),
                        ),
                        Positioned(
                          top: 58 + 70 * (1 - FcMotion.easeOutExpo.transform(_rise.value)),
                          left: 200,
                          child: Container(
                            width: 66,
                            height: 66,
                            decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFFFF4C9), boxShadow: [BoxShadow(color: Color(0xB3FFF0BE), blurRadius: 60, spreadRadius: 20)]),
                          ),
                        ),
                        _cloud(left: 62 + _drift.value * 36 - 14, top: 44, width: 90),
                        _cloud(left: 220 - _drift.value * 36 + 14, top: 92, width: 70, opacity: 0.7),
                        _mountain(Color.lerp(accent, Colors.white, 0.4)!, const [Offset(0, 1), Offset(0.46, 0.08), Offset(1, 1)], left: -0.12, width: 0.82, height: 0.72),
                        _mountain(Color.lerp(accent, Colors.white, 0.12)!, const [Offset(0, 1), Offset(0.55, 0.06), Offset(1, 1)], left: 0.36, width: 0.76, height: 0.62),
                        _mountain(Color.lerp(accent, Colors.black, 0.3)!, const [
                          Offset(0, 1), Offset(0, 0.46), Offset(0.24, 0.22), Offset(0.46, 0.52), Offset(0.7, 0.14), Offset(1, 0.56), Offset(1, 1),
                        ], left: 0, width: 1, height: 0.42),
                        const Positioned(top: 18, right: 20, child: Icon(Icons.favorite_rounded, color: Colors.white, size: 26)),
                        Positioned(
                          left: 20,
                          bottom: 18,
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('Iceland', style: FcType.title.copyWith(fontSize: 22, color: Colors.white)),
                            const SizedBox(height: 4),
                            Text('12 trips · from \$890', style: FcType.small.copyWith(color: Colors.white.withValues(alpha: 0.9))),
                          ]),
                        ),
                      ]),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(spacing: 8, children: [
                  for (var i = 0; i < _chips.length; i++)
                    ChoiceChip(
                      label: Text(_chips[i]),
                      selected: i == _chip,
                      onSelected: (_) => setState(() => _chip = i),
                      showCheckmark: false,
                      side: BorderSide.none,
                      shape: const StadiumBorder(),
                      backgroundColor: Colors.white,
                      selectedColor: FcColors.ink,
                      labelStyle: FcType.body.copyWith(fontSize: 14, color: i == _chip ? Colors.white : FcColors.ink),
                    ),
                ]),
                const SizedBox(height: 16),
                Row(children: [
                  Text('Popular', style: FcType.body.copyWith(fontWeight: FontWeight.w600)),
                  const Spacer(),
                  Text('See all', style: FcType.small.copyWith(color: accent, fontWeight: FontWeight.w600)),
                ]),
                const SizedBox(height: 12),
              ]),
            ),
            SizedBox(
              height: 142,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.only(right: FcSpace.lg),
                itemCount: _popular.length,
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemBuilder: (context, i) => SizedBox(
                  width: 150,
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Container(
                      height: 112,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: _popular[i].$2),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(_popular[i].$1, style: FcType.body.copyWith(fontSize: 14, fontWeight: FontWeight.w600)),
                  ]),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _cloud({required double left, required double top, required double width, double opacity = 0.85}) => Positioned(
        left: left,
        top: top,
        child: Container(width: width, height: 22, decoration: BoxDecoration(color: Colors.white.withValues(alpha: opacity), borderRadius: BorderRadius.circular(20))),
      );

  Widget _mountain(Color color, List<Offset> points, {required double left, required double width, required double height}) =>
      Positioned.fill(
        child: LayoutBuilder(
          builder: (context, c) => Stack(children: [
            Positioned(
              left: c.maxWidth * left,
              bottom: 0,
              width: c.maxWidth * width,
              height: c.maxHeight * height,
              child: ClipPath(clipper: _PolygonClipper(points), child: ColoredBox(color: color)),
            ),
          ]),
        ),
      );
}

class _PolygonClipper extends CustomClipper<Path> {
  const _PolygonClipper(this.points);
  final List<Offset> points;

  @override
  Path getClip(Size size) => Path()..addPolygon([for (final p in points) Offset(p.dx * size.width, p.dy * size.height)], true);

  @override
  bool shouldReclip(covariant CustomClipper<Path> oldClipper) => false;
}
