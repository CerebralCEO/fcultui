import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

class ChatMessage {
  const ChatMessage(this.text, {this.mine = false});
  final String text;
  final bool mine;
}

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({
    super.key,
    this.accent = const Color(0xFF__ACCENT__),
    this.messages = const [
      ChatMessage('Hey! Are we still on for tonight?'),
      ChatMessage('Yes! 7pm at Lumen 🍜', mine: true),
      ChatMessage('Perfect. I booked a table by the window'),
      ChatMessage("You're the best", mine: true),
      ChatMessage('Bringing the photos from the trip too', mine: true),
    ],
    this.typing = true,
  });

  final Color accent;
  final List<ChatMessage> messages;
  final bool typing;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> with SingleTickerProviderStateMixin {
  late final _dots = AnimationController(vsync: this, duration: const Duration(seconds: 1))..repeat();

  @override
  void dispose() {
    _dots.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(children: [
          Container(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 14),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0xFFF0F0F2)))),
            child: Row(children: [
              const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
              const SizedBox(width: 12),
              const CircleAvatar(radius: 22, backgroundColor: Color(0xFFA78BFA)),
              const SizedBox(width: 12),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Maya Chen', style: FcType.body.copyWith(fontWeight: FontWeight.w600)),
                Text('Online', style: FcType.small.copyWith(color: const Color(0xFF22C55E))),
              ]),
              const Spacer(),
              _HeaderAction(icon: Icons.call_outlined, color: accent),
              const SizedBox(width: 12),
              _HeaderAction(icon: Icons.videocam_outlined, color: accent),
            ]),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              children: [
                Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFF2F3F5), borderRadius: BorderRadius.circular(10)),
                    child: Text('Today', style: FcType.small.copyWith(fontSize: 12, color: FcColors.inkMuted)),
                  ),
                ),
                for (var i = 0; i < widget.messages.length; i++)
                  _Bubble(message: widget.messages[i], accent: accent, delay: Duration(milliseconds: 320 * i)),
                if (widget.typing)
                  _Bubble.typing(
                    delay: Duration(milliseconds: 320 * widget.messages.length),
                    child: AnimatedBuilder(
                      animation: _dots,
                      builder: (context, _) => Row(mainAxisSize: MainAxisSize.min, children: [
                        for (var d = 0; d < 3; d++)
                          Transform.translate(
                            offset: Offset(0, _bounce((_dots.value - d * 0.15) % 1) * -5),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 2.5),
                              width: 7,
                              height: 7,
                              decoration: const BoxDecoration(color: Color(0xFF9CA3AF), shape: BoxShape.circle),
                            ),
                          ),
                      ]),
                    ),
                  ),
              ],
            ),
          ),
          Container(
            height: 52,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            padding: const EdgeInsets.fromLTRB(8, 0, 6, 0),
            decoration: BoxDecoration(color: const Color(0xFFF2F3F5), borderRadius: BorderRadius.circular(26)),
            child: Row(children: [
              const CircleAvatar(radius: 18, backgroundColor: Colors.white, child: Icon(Icons.add, color: FcColors.ink, size: 18)),
              const SizedBox(width: 10),
              Expanded(child: Text('Message', style: FcType.body.copyWith(color: FcColors.inkMuted))),
              CircleAvatar(radius: 20, backgroundColor: accent, child: const Icon(Icons.mic_none_rounded, color: Colors.white, size: 20)),
            ]),
          ),
          const SizedBox(height: FcSpace.md),
        ]),
      ),
    );
  }

  static double _bounce(double t) => t < 0.3 ? t / 0.3 : (t < 0.6 ? 1 - (t - 0.3) / 0.3 : 0);
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.message, required this.accent, required this.delay}) : child = null;
  const _Bubble.typing({required this.delay, required this.child})
      : message = const ChatMessage(''),
        accent = Colors.transparent;

  final ChatMessage message;
  final Color accent;
  final Duration delay;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final mine = message.mine;
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: const Duration(milliseconds: 550) + delay,
      curve: Interval(delay.inMilliseconds / (550 + delay.inMilliseconds), 1, curve: FcMotion.easeOutExpo),
      builder: (context, t, c) => Opacity(
        opacity: t,
        child: Transform.translate(offset: Offset(0, 10 * (1 - t)), child: Transform.scale(scale: 0.9 + 0.1 * t, child: c)),
      ),
      child: Align(
        alignment: mine ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          margin: const EdgeInsets.only(top: 10),
          constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.78),
          padding: child != null ? const EdgeInsets.all(15) : const EdgeInsets.symmetric(horizontal: 15, vertical: 11),
          decoration: BoxDecoration(
            color: mine ? accent : const Color(0xFFF1F2F5),
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(20),
              topRight: const Radius.circular(20),
              bottomLeft: Radius.circular(mine ? 20 : 6),
              bottomRight: Radius.circular(mine ? 6 : 20),
            ),
          ),
          child: child ?? Text(message.text, style: FcType.body.copyWith(color: mine ? Colors.white : FcColors.ink)),
        ),
      ),
    );
  }
}

class _HeaderAction extends StatelessWidget {
  const _HeaderAction({required this.icon, required this.color});
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) =>
      CircleAvatar(radius: 19, backgroundColor: const Color(0xFFF2F3F5), child: Icon(icon, color: color, size: 18));
}
