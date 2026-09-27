import 'package:flutter/material.dart';
import '../fcult/tokens.dart';

/// __TITLE__ — FCult UI. Pixel-identical to the React Native version.
class __NAME__Screen extends StatefulWidget {
  const __NAME__Screen({super.key, this.accent = const Color(0xFF__ACCENT__), this.onSignIn});

  final Color accent;
  final Future<void> Function(String email, String password)? onSignIn;

  @override
  State<__NAME__Screen> createState() => ___NAME__ScreenState();
}

class ___NAME__ScreenState extends State<__NAME__Screen> {
  final _email = TextEditingController(text: 'sara@nova.app');
  final _password = TextEditingController();
  bool _remember = true;
  bool _loading = false;

  Future<void> _submit() async {
    setState(() => _loading = true);
    await widget.onSignIn?.call(_email.text, _password.text);
    if (mounted) setState(() => _loading = false);
  }

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final accent = widget.accent;
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0B),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(FcSpace.lg, 34, FcSpace.lg, FcSpace.md),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: LinearGradient(colors: [accent, Color.lerp(accent, Colors.black, 0.45)!]),
                  boxShadow: [BoxShadow(color: accent.withValues(alpha: 0.7), blurRadius: 40, offset: const Offset(0, 16), spreadRadius: -10)],
                ),
                child: Center(
                  child: Container(width: 24, height: 24, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 4))),
                ),
              ),
              const SizedBox(height: 26),
              Text('Welcome back', style: FcType.title.copyWith(color: Colors.white)),
              const SizedBox(height: 8),
              Text('Sign in to continue to Nova', style: FcType.body.copyWith(color: FcColors.nightMuted)),
              const SizedBox(height: 26),
              _Field(label: 'Email', controller: _email, accent: accent),
              _Field(label: 'Password', controller: _password, accent: accent, obscure: true, focused: true),
              const SizedBox(height: 16),
              Row(children: [
                GestureDetector(
                  onTap: () => setState(() => _remember = !_remember),
                  child: AnimatedContainer(
                    duration: FcMotion.fast,
                    width: 18,
                    height: 18,
                    decoration: BoxDecoration(color: _remember ? accent : Colors.transparent, borderRadius: BorderRadius.circular(6), border: Border.all(color: accent)),
                  ),
                ),
                const SizedBox(width: 8),
                Text('Remember me', style: FcType.small.copyWith(color: FcColors.nightMuted)),
                const Spacer(),
                Text('Forgot?', style: FcType.small.copyWith(color: accent, fontWeight: FontWeight.w600)),
              ]),
              const SizedBox(height: 24),
              _PrimaryButton(label: 'Sign in', accent: accent, loading: _loading, onTap: _submit),
              const SizedBox(height: 28),
              Row(children: [
                const Expanded(child: Divider(color: Color(0xFF232326))),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text('or continue with', style: FcType.small.copyWith(color: FcColors.nightMuted)),
                ),
                const Expanded(child: Divider(color: Color(0xFF232326))),
              ]),
              const SizedBox(height: 18),
              Row(children: [
                for (final p in ['G', 'X', 'f']) ...[
                  Expanded(child: _Social(label: p)),
                  if (p != 'f') const SizedBox(width: 12),
                ],
              ]),
              const Spacer(),
              Center(
                child: Text.rich(TextSpan(
                  style: FcType.body.copyWith(fontSize: 14, color: FcColors.nightMuted),
                  children: const [
                    TextSpan(text: 'New here? '),
                    TextSpan(text: 'Create account', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                  ],
                )),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Field extends StatelessWidget {
  const _Field({required this.label, required this.controller, required this.accent, this.obscure = false, this.focused = false});
  final String label;
  final TextEditingController controller;
  final Color accent;
  final bool obscure, focused;

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 16, bottom: 8),
            child: Text(label, style: FcType.small.copyWith(color: FcColors.nightMuted)),
          ),
          TextField(
            controller: controller,
            obscureText: obscure,
            obscuringCharacter: '●',
            cursorColor: accent,
            style: FcType.body.copyWith(color: Colors.white),
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFF151517),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 17),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(FcRadius.field),
                borderSide: BorderSide(color: focused ? accent.withValues(alpha: 0.7) : const Color(0xFF242427)),
              ),
              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(FcRadius.field), borderSide: BorderSide(color: accent)),
            ),
          ),
        ],
      );
}

class _PrimaryButton extends StatelessWidget {
  const _PrimaryButton({required this.label, required this.accent, required this.loading, required this.onTap});
  final String label;
  final Color accent;
  final bool loading;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: loading ? null : onTap,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(FcRadius.button),
          child: Container(
            height: 56,
            color: accent,
            child: Stack(fit: StackFit.expand, children: [
              // Progress sweep while signing in
              TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: loading ? 1 : 0),
                duration: const Duration(milliseconds: 1400),
                curve: FcMotion.easeOutExpo,
                builder: (context, v, _) => FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: v,
                  child: Container(color: Colors.white.withValues(alpha: 0.22)),
                ),
              ),
              Center(child: Text(label, style: FcType.button.copyWith(color: Colors.white))),
            ]),
          ),
        ),
      );
}

class _Social extends StatelessWidget {
  const _Social({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) => Container(
        height: 54,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: const Color(0xFF151517),
          borderRadius: BorderRadius.circular(FcRadius.field),
          border: Border.all(color: const Color(0xFF242427)),
        ),
        child: Text(label, style: const TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.w700)),
      );
}
