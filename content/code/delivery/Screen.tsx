import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Ellipse, Path, Rect } from "react-native-svg";
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import { colors, motion, radius, space, type } from "../fcult/tokens";

// Same 390 × 520 map space as the Flutter CustomPainter.
const ROUTE = "M96 438 C 90 360, 150 330, 200 300 S 270 200, 285 120";

// The route as two cubic segments ("S" reflects the previous control point), sampled once on the JS thread
// so the courier worklet only has to interpolate numbers.
type P = [number, number];
const SEGMENTS: [P, P, P, P][] = [
  [[96, 438], [90, 360], [150, 330], [200, 300]],
  [[200, 300], [250, 270], [270, 200], [285, 120]],
];
const cubic = (a: number, b: number, c: number, d: number, t: number) =>
  (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
const SAMPLES = SEGMENTS.flatMap(([p0, p1, p2, p3]) =>
  Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    return [cubic(p0[0], p1[0], p2[0], p3[0], t), cubic(p0[1], p1[1], p2[1], p3[1], t)] as P;
  }),
);
const STOPS = SAMPLES.map((_, i) => i / (SAMPLES.length - 1));
const XS = SAMPLES.map((p) => p[0]);
const YS = SAMPLES.map((p) => p[1]);

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({
  accent = "#__ACCENT__",
  minutesLeft = 12,
  step = 2,
}: {
  accent?: string;
  minutesLeft?: number;
  /** 0 = placed, 1 = picked up, 2 = on the way, 3 = delivered. */
  step?: number;
}) {
  const travel = useSharedValue(0);
  useEffect(() => {
    travel.value = withRepeat(withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [travel]);

  const courier = useAnimatedStyle(() => {
    const t = 0.04 + travel.value * 0.92;
    return { transform: [{ translateX: interpolate(t, STOPS, XS) - 13 }, { translateY: interpolate(t, STOPS, YS) - 13 }] };
  });

  return (
    <View style={s.root}>
      <View style={s.map}>
        <Svg width="100%" height="100%" viewBox="0 0 390 520" preserveAspectRatio="none">
          <Rect width={390} height={520} fill="#E8EDF1" />
          <Path d="M-10 140 C 120 120, 220 190, 400 150" stroke="#fff" strokeWidth={18} fill="none" />
          <Path d="M60 -10 L 110 540" stroke="#fff" strokeWidth={14} fill="none" />
          <Path d="M-10 360 C 150 330, 260 420, 400 380" stroke="#fff" strokeWidth={16} fill="none" />
          <Path d="M290 -10 L 250 540" stroke="#fff" strokeWidth={12} fill="none" />
          <Ellipse cx={185} cy={265} rx={62} ry={44} fill="#CFE8D3" />
          <Ellipse cx={340} cy={470} rx={70} ry={50} fill="#CFE8D3" />
          <Path d={ROUTE} stroke={accent} strokeWidth={6} strokeLinecap="round" strokeDasharray="8 10" fill="none" />
        </Svg>
        <Pin x={96} y={438} color={accent} />
        <Pin x={285} y={120} color={colors.ink} square />
        <Animated.View style={[s.courier, { backgroundColor: accent, shadowColor: accent }, courier]} />
      </View>

      <SafeAreaView edges={["top"]} style={s.top}>
        <View style={s.round}><Ionicons name="chevron-back" size={16} color={colors.ink} /></View>
        <View style={s.pill}><Text style={[type.small, { fontWeight: "600" }]}>Order #4821</Text></View>
      </SafeAreaView>

      <SafeAreaView edges={["bottom"]} style={s.sheet}>
        <View style={s.grab} />
        <Text style={[type.small, { color: colors.inkMuted, marginTop: 18 }]}>Arriving in</Text>
        <Text style={[type.title, { fontSize: 32 }]}>{minutesLeft} min</Text>

        <View style={s.steps}>
          {[0, 1, 2, 3].map((i) => (
            <Step key={i} index={i} fill={i < step ? 1 : i === step ? 0.45 : 0} color={accent} />
          ))}
        </View>
        <View style={s.labels}>
          {["Picked up", "On the way", "Delivered"].map((l) => (
            <Text key={l} style={[type.small, { color: colors.inkMuted }]}>{l}</Text>
          ))}
        </View>

        <View style={s.courierRow}>
          <View style={s.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={[type.body, { fontWeight: "600" }]}>Daniel K.</Text>
            <Text style={[type.small, { color: colors.inkMuted }]}>★ 4.9 · Courier</Text>
          </View>
          <View style={s.action}><Ionicons name="chatbubble-outline" size={18} color={colors.ink} /></View>
          <View style={[s.action, { backgroundColor: accent }]}><Ionicons name="call" size={18} color="#fff" /></View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Pin({ x, y, color, square }: { x: number; y: number; color: string; square?: boolean }) {
  return (
    <View style={[s.pin, { left: x - 14, top: y - 14 }]}>
      <View style={{ width: 12, height: 12, borderRadius: square ? 3 : 6, backgroundColor: color }} />
    </View>
  );
}

function Step({ index, fill, color }: { index: number; fill: number; color: string }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(index * 500, withTiming(fill, { duration: 900, easing: motion.easeOutExpo }));
  }, [fill, index, w]);
  const style = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={s.track}>
      <Animated.View style={[{ height: "100%", backgroundColor: color }, style]} />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  map: { position: "absolute", top: 0, left: 0, right: 0, height: 520 },
  pin: {
    position: "absolute", width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 6 },
  },
  courier: { position: "absolute", left: 0, top: 0, width: 26, height: 26, borderRadius: 13, borderWidth: 5, borderColor: "#fff", shadowOpacity: 0.4, shadowRadius: 8 },
  top: { position: "absolute", left: 20, right: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 6 },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  pill: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: "#fff",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 7, shadowOffset: { width: 0, height: 4 },
  },
  sheet: {
    position: "absolute", left: 0, right: 0, bottom: 0, height: 360, paddingHorizontal: space.lg, paddingTop: 12,
    borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: "#fff",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 15, shadowOffset: { width: 0, height: -10 },
  },
  grab: { alignSelf: "center", width: 40, height: 5, borderRadius: 3, backgroundColor: "#DDD" },
  steps: { flexDirection: "row", gap: 6, marginTop: 18 },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden", backgroundColor: "#EEE" },
  labels: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  courierRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: "auto", marginBottom: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#14B8A6" },
  action: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#F2F3F5", alignItems: "center", justifyContent: "center" },
});
