import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.onAddToBag});

  final Color accent;
  final void Function(int swatch, int quantity)? onAddToBag;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with SingleTickerProviderStateMixin {
  late final _bob = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400))..repeat(reverse: true);
  int _swatch = 0;
  int _qty = 1;
  int _bag = 2;

  List<Color> get _swatches => [widget.accent, const Color(0xFF1C1C1C), const Color(0xFFD9D4CC), const Color(0xFF7C9A8B)];

  @override
  void dispose() {
    _bob.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = _swatches[_swatch];
    return Scaffold(
      backgroundColor: const Color(0xFFEFEBE4),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, FcSpace.sm, FcSpace.lg, FcSpace.md),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const _RoundIcon(icon: Icons.arrow_back_ios_new_rounded),
              const Spacer(),
              Text('Details', style: FcType.body.copyWith(fontWeight: FontWeight.w600)),
              const Spacer(),
              Badge(
                label: Text('$_bag'),
                backgroundColor: widget.accent,
                child: const _RoundIcon(icon: Icons.shopping_bag_outlined),
              ),
            ]),
            Expanded(
              child: AnimatedBuilder(
                animation: _bob,
                builder: (context, _) {
                  final t = FcMotion.easeOutExpo.transform(_bob.value);
                  return Stack(alignment: Alignment.center, children: [
                    Container(width: 270, height: 270, decoration: BoxDecoration(shape: BoxShape.circle, color: Color.lerp(Colors.white, color, 0.22))),
                    Positioned(
                      bottom: 18,
                      child: Transform.scale(
                        scale: 1.05 - t * 0.3,
                        child: Container(width: 130, height: 16, decoration: BoxDecoration(borderRadius: BorderRadius.circular(99), color: Colors.black12)),
                      ),
                    ),
                    Transform.translate(
                      offset: Offset(0, 6 - t * 20),
                      child: Transform.rotate(angle: -0.05 + t * 0.12, child: _Bottle(color: color)),
                    ),
                  ]);
                },
              ),
            ),
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Aura Bottle', style: FcType.title),
                const SizedBox(height: 4),
                Text('★ 4.9 · 2.1k reviews', style: FcType.body.copyWith(color: FcColors.inkMuted)),
              ]),
              const Spacer(),
              Text('\$38', style: FcType.title.copyWith(fontSize: 28)),
            ]),
            const SizedBox(height: 10),
            Text('Double-walled steel keeps drinks cold for 24 hours and hot for 12.',
                style: FcType.body.copyWith(fontSize: 14, color: FcColors.inkMuted)),
            const SizedBox(height: FcSpace.md),
            Row(children: [
              for (var i = 0; i < _swatches.length; i++)
                GestureDetector(
                  onTap: () => setState(() => _swatch = i),
                  child: AnimatedContainer(
                    duration: FcMotion.fast,
                    curve: FcMotion.easeOutExpo,
                    margin: const EdgeInsets.only(right: 14),
                    padding: const EdgeInsets.all(3),
                    decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: i == _swatch ? FcColors.ink : Colors.transparent, width: 2)),
                    child: CircleAvatar(radius: 17, backgroundColor: _swatches[i]),
                  ),
                ),
            ]),
            const SizedBox(height: FcSpace.md),
            Row(children: [
              Container(
                width: 118,
                height: 56,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(borderRadius: BorderRadius.circular(FcRadius.button), border: Border.all(color: Colors.black12)),
                child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  GestureDetector(onTap: () => setState(() => _qty = (_qty - 1).clamp(1, 9)), child: const Text('−', style: TextStyle(fontSize: 18, color: FcColors.inkMuted))),
                  Text('$_qty', style: FcType.button),
                  GestureDetector(onTap: () => setState(() => _qty = (_qty + 1).clamp(1, 9)), child: const Text('+', style: TextStyle(fontSize: 18, color: FcColors.inkMuted))),
                ]),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: FilledButton(
                    style: FilledButton.styleFrom(backgroundColor: FcColors.ink, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(FcRadius.button))),
                    onPressed: () {
                      setState(() => _bag += _qty);
                      widget.onAddToBag?.call(_swatch, _qty);
                    },
                    child: const Text('Add to bag', style: FcType.button),
                  ),
                ),
              ),
            ]),
          ]),
        ),
      ),
    );
  }
}

class _Bottle extends StatelessWidget {
  const _Bottle({required this.color});
  final Color color;

  @override
  Widget build(BuildContext context) => Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 58,
          height: 42,
          decoration: const BoxDecoration(
            borderRadius: BorderRadius.vertical(top: Radius.circular(12), bottom: Radius.circular(6)),
            gradient: LinearGradient(colors: [Color(0xFF111111), Color(0xFF3A3A3A), Color(0xFF111111)]),
          ),
        ),
        Transform.translate(
          offset: const Offset(0, -4),
          child: Container(
            width: 98,
            height: 210,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(34),
              gradient: LinearGradient(colors: [
                Color.lerp(color, Colors.black, 0.28)!, color, Color.lerp(color, Colors.white, 0.3)!, color, Color.lerp(color, Colors.black, 0.32)!,
              ], stops: const [0, 0.32, 0.52, 0.72, 1]),
            ),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 6),
              color: Colors.white.withValues(alpha: 0.9),
              child: Text('AURA', textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 3.6, color: Color.lerp(color, Colors.black, 0.4))),
            ),
          ),
        ),
      ]);
}

class _RoundIcon extends StatelessWidget {
  const _RoundIcon({required this.icon});
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
        width: 44,
        height: 44,
        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Color(0x0F000000), blurRadius: 10, offset: Offset(0, 2))]),
        child: Icon(icon, size: 18, color: FcColors.ink),
      );
}
