import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { colors, motion, space, type } from "../fcult/tokens";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type ActivityRing = { label: string; value: number; goal: number; unit: string; color: string };

const DEFAULT_RINGS: ActivityRing[] = [
  { label: "Move", value: 420, goal: 500, unit: "KCAL", color: "#FA114F" },
  { label: "Exercise", value: 32, goal: 30, unit: "MIN", color: "#A6FF00" },
  { label: "Stand", value: 9, goal: 12, unit: "HRS", color: "#00D8FF" },
];

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({
  accent = "#__ACCENT__",
  rings = DEFAULT_RINGS,
  week = [0.6, 0.8, 0.45, 0.95, 0.7, 0.3, 0.84],
}: { accent?: string; rings?: ActivityRing[]; week?: number[] }) {
  return (
    <SafeAreaView style={s.root}>
      <Text style={s.caps}>TUESDAY, JUN 18</Text>
      <Text style={[type.display, { color: "#fff" }]}>Activity</Text>

      <View style={s.rings}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          {rings.map((ring, i) => (
            <Ring key={ring.label} ring={ring} index={i} />
          ))}
        </Svg>
      </View>

      <View style={s.stats}>
        {rings.map((ring) => (
          <View key={ring.label} style={s.stat}>
            <Text style={[type.small, { color: "#fff" }]}>{ring.label}</Text>
            <Text style={[s.value, { color: ring.color }]}>
              {ring.value}/{ring.goal}
              <Text style={{ fontSize: 11, fontWeight: "400" }}> {ring.unit}</Text>
            </Text>
          </View>
        ))}
      </View>

      <View style={s.week}>
        {week.map((v, i) => (
          <WeekBar key={i} value={v} index={i} color={accent} />
        ))}
      </View>
    </SafeAreaView>
  );
}

/** Each ring draws in 150 ms after the previous one. */
function Ring({ ring, index }: { ring: ActivityRing; index: number }) {
  const r = 118 - index * 26;
  const len = 2 * Math.PI * r;
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(index * 150, withTiming(Math.min(ring.value / ring.goal, 1.5), { duration: 1800, easing: motion.easeOutExpo }));
  }, [index, ring.goal, ring.value, t]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - t.value) }));

  return (
    <>
      <Circle cx={140} cy={140} r={r} stroke={ring.color} strokeOpacity={0.22} strokeWidth={22} fill="none" />
      <AnimatedCircle
        cx={140} cy={140} r={r}
        stroke={ring.color} strokeWidth={22} strokeLinecap="round" fill="none"
        strokeDasharray={len} animatedProps={props}
        transform="rotate(-90 140 140)"
      />
    </>
  );
}

function WeekBar({ value, index, color }: { value: number; index: number; color: string }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(400 + index * 60, withTiming(value, { duration: motion.medium, easing: motion.easeOutExpo }));
  }, [h, index, value]);
  const style = useAnimatedStyle(() => ({ height: `${h.value * 100}%` }));
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View style={[{ borderRadius: 6, backgroundColor: color, opacity: 0.85 }, style]} />
      </View>
      <Text style={s.day}>{"MTWTFSS"[index]}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000", paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md },
  caps: { ...type.small, color: colors.nightMuted, letterSpacing: 1.3, fontWeight: "600" },
  rings: { alignItems: "center", marginVertical: 20 },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, padding: 12, borderRadius: 16, backgroundColor: "#141416" },
  value: { marginTop: 4, fontSize: 20, fontWeight: "700", letterSpacing: -0.6 },
  week: { height: 96, marginTop: "auto", flexDirection: "row", gap: 10 },
  day: { ...type.small, fontSize: 11, marginTop: 6, textAlign: "center", color: colors.nightMuted },
});
