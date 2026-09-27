import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Line } from "react-native-svg";
import Animated, { Easing, FadeInDown, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { motion, space, type } from "../fcult/tokens";

export type HourlyForecast = { hour: string; temp: number };

const DEFAULT_HOURLY: HourlyForecast[] = [
  { hour: "Now", temp: 24 },
  { hour: "14", temp: 25 },
  { hour: "15", temp: 26 },
  { hour: "16", temp: 24 },
  { hour: "17", temp: 22 },
];

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({
  accent = "#__ACCENT__",
  city = "San Francisco",
  temp = 24,
  hourly = DEFAULT_HOURLY,
}: { accent?: string; city?: string; temp?: number; hourly?: HourlyForecast[] }) {
  const rays = useSharedValue(0);
  const cloud = useSharedValue(0);

  useEffect(() => {
    rays.value = withRepeat(withTiming(1, { duration: 12000, easing: Easing.linear }), -1);
    cloud.value = withRepeat(withTiming(1, { duration: 4000 }), -1, true);
  }, [rays, cloud]);

  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${rays.value * 360}deg` }] }));
  const drift = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(cloud.value, [0, 1], [-14, 22]) }] }));

  return (
    <LinearGradient colors={[accent, mix(accent, "#0B1B3A", 0.6)]} style={{ flex: 1 }}>
      <SafeAreaView style={s.root}>
        <Text style={[type.body, s.center, { color: "#fff", fontWeight: "600" }]}>{city}</Text>
        <Text style={[type.small, s.center, { color: "rgba(255,255,255,0.7)" }]}>Tue, 18 June</Text>

        <View style={s.art}>
          <View style={s.sun}>
            <Animated.View style={[StyleSheet.absoluteFill, spin]}>
              <Svg width={150} height={150}>
                {Array.from({ length: 12 }, (_, i) => {
                  const a = (i * Math.PI) / 6;
                  return (
                    <Line
                      key={i}
                      x1={75 + Math.cos(a) * 54} y1={75 + Math.sin(a) * 54}
                      x2={75 + Math.cos(a) * 70} y2={75 + Math.sin(a) * 70}
                      stroke="rgba(255,222,120,0.9)" strokeWidth={7} strokeLinecap="round"
                    />
                  );
                })}
              </Svg>
            </Animated.View>
            <View style={s.disc} />
          </View>
          <Animated.View style={[s.cloud, drift]}>
            <View style={s.cloudBump} />
          </Animated.View>
        </View>

        <Text style={s.temp}>{temp}°</Text>
        <Text style={[type.body, s.center, { color: "rgba(255,255,255,0.7)", marginTop: 8 }]}>Partly cloudy · H 26° L 17°</Text>

        <View style={s.stats}>
          {[
            ["Wind", "12 km/h"],
            ["Humidity", "48%"],
            ["UV", "5 Mod"],
          ].map(([label, value]) => (
            <View key={label} style={s.stat}>
              <Text style={[type.small, { color: "rgba(255,255,255,0.7)" }]}>{label}</Text>
              <Text style={[type.body, { color: "#fff", fontWeight: "600" }]}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={s.hours}>
          {hourly.map((h, i) => (
            <Animated.View
              key={h.hour}
              entering={FadeInDown.delay(i * 90).duration(600).easing(motion.easeOutExpo)}
              style={[s.hour, i === 0 && { backgroundColor: "rgba(255,255,255,0.3)" }]}
            >
              <Text style={[type.small, { color: "#fff" }]}>{h.hour}</Text>
              <View style={s.dot} />
              <Text style={[type.body, { color: "#fff", fontWeight: "600" }]}>{h.temp}°</Text>
            </Animated.View>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md },
  center: { textAlign: "center" },
  art: { height: 196 },
  sun: { position: "absolute", top: 18, left: 64, width: 150, height: 150, alignItems: "center", justifyContent: "center" },
  disc: { width: 84, height: 84, borderRadius: 42, backgroundColor: "#FFD76A", shadowColor: "#FFD76A", shadowOpacity: 0.8, shadowRadius: 25 },
  cloud: {
    position: "absolute", right: 44, top: 134, width: 170, height: 62, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.96)",
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 20 },
  },
  cloudBump: { position: "absolute", left: 34, top: -38, width: 78, height: 78, borderRadius: 39, backgroundColor: "rgba(255,255,255,0.96)" },
  temp: { textAlign: "center", fontSize: 100, fontWeight: "200", letterSpacing: -6, color: "#fff", lineHeight: 100 },
  stats: { flexDirection: "row", gap: 10, marginTop: 14 },
  stat: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.14)" },
  hours: { flexDirection: "row", gap: 8, marginTop: "auto" },
  hour: { flex: 1, alignItems: "center", gap: 8, paddingVertical: 14, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.1)" },
  dot: { width: 18, height: 18, borderRadius: 9, backgroundColor: "#FFD76A" },
});
