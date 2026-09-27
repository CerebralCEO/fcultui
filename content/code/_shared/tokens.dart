// lib/fcult/tokens.dart — shared by every FCult UI screen.
// Mirrors react-native/tokens.ts 1:1 so both frameworks render identical UI.
import 'package:flutter/animation.dart';
import 'package:flutter/painting.dart';

abstract final class FcColors {
  static const ink = Color(0xFF111111);
  static const inkMuted = Color(0x80000000);
  static const paper = Color(0xFFFFFFFF);
  static const night = Color(0xFF0B0B0D);
  static const nightMuted = Color(0x8CFFFFFF);
  static const nightCard = Color(0x14FFFFFF);
  static const positive = Color(0xFF3DDC97);
}

abstract final class FcSpace {
  static const xs = 6.0;
  static const sm = 10.0;
  static const md = 16.0;
  static const lg = 24.0;
  static const xl = 32.0;
}

abstract final class FcRadius {
  static const field = 16.0;
  static const button = 18.0;
  static const card = 28.0;
  static const pill = 999.0;
}

abstract final class FcMotion {
  /// cubic-bezier(0.16, 1, 0.3, 1) — the FCult "expo out" curve.
  static const easeOutExpo = Cubic(0.16, 1, 0.3, 1);
  static const fast = Duration(milliseconds: 350);
  static const medium = Duration(milliseconds: 1100);
}

abstract final class FcType {
  static const family = 'Inter';
  static const display = TextStyle(fontFamily: family, fontSize: 34, fontWeight: FontWeight.w600, letterSpacing: -1.2, height: 1.1);
  static const title = TextStyle(fontFamily: family, fontSize: 27, fontWeight: FontWeight.w600, letterSpacing: -0.9, height: 1.1);
  static const body = TextStyle(fontFamily: family, fontSize: 15, height: 1.35, letterSpacing: -0.15);
  static const small = TextStyle(fontFamily: family, fontSize: 13, height: 1.35);
  static const button = TextStyle(fontFamily: family, fontSize: 16, fontWeight: FontWeight.w600);
}
