import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Polygon } from "react-native-svg";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors, motion, radius, space, type } from "../fcult/tokens";

const CHIPS = ["Mountains", "Beaches", "Cities", "Forests"];
const POPULAR: { name: string; colors: [string, string] }[] = [
  { name: "Lofoten", colors: ["#A5B4FC", "#1E3A8A"] },
  { name: "Dolomites", colors: ["#FDE68A", "#B45309"] },
  { name: "Patagonia", colors: ["#99F6E4", "#115E59"] },
  { name: "Kyoto", colors: ["#FBCFE8", "#9D174D"] },
];

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__" }: { accent?: string }) {
  const [chip, setChip] = useState(0);
  const drift = useSharedValue(0);
  const rise = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 6000 }), -1, true);
    rise.value = withTiming(1, { duration: 2400, easing: motion.easeOutExpo });
  }, [drift, rise]);

  const sun = useAnimatedStyle(() => ({ transform: [{ translateY: interpolate(rise.value, [0, 1], [70, 0]) }] }));
  const cloudA = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(drift.value, [0, 1], [-14, 22]) }] }));
  const cloudB = useAnimatedStyle(() => ({ transform: [{ translateX: interpolate(drift.value, [0, 1], [22, -14]) }] }));

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.md }}>
        <View style={s.pad}>
          <View style={s.row}>
            <View>
              <Text style={[type.small, { color: colors.inkMuted }]}>Where to next?</Text>
              <Text style={type.title}>Explore</Text>
            </View>
            <View style={s.avatar} />
          </View>

          <View style={s.search}>
            <Ionicons name="search" size={18} color="rgba(0,0,0,0.38)" />
            <Text style={[type.body, { color: colors.inkMuted }]}>Search destinations</Text>
          </View>

          <View style={s.hero}>
            <LinearGradient colors={["#FBD9A8", "#F5AB8C", "#E88F7D"]} style={StyleSheet.absoluteFill} />
            <Animated.View style={[s.sun, sun]} />
            <Animated.View style={[s.cloud, { left: 62, top: 44, width: 90 }, cloudA]} />
            <Animated.View style={[s.cloud, { left: 220, top: 92, width: 70, opacity: 0.7 }, cloudB]} />
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 342 250" preserveAspectRatio="none">
              <Polygon points="-41,250 90,70 239,250" fill={tint(accent, 0.4)} />
              <Polygon points="123,250 266,95 383,250" fill={tint(accent, 0.12)} />
              <Polygon points="0,250 0,193 82,172 157,198 239,164 342,200 342,250" fill={shade(accent, 0.3)} />
            </Svg>
            <Ionicons name="heart" size={26} color="#fff" style={{ position: "absolute", top: 18, right: 20 }} />
            <View style={s.heroLabel}>
              <Text style={[type.title, { fontSize: 22, color: "#fff" }]}>Iceland</Text>
              <Text style={[type.small, { color: "rgba(255,255,255,0.9)", marginTop: 4 }]}>12 trips · from $890</Text>
            </View>
          </View>

          <View style={[s.row, { justifyContent: "flex-start", gap: 8 }]}>
            {CHIPS.map((c, i) => (
              <Pressable key={c} onPress={() => setChip(i)} style={[s.chip, i === chip && { backgroundColor: colors.ink }]}>
                <Text style={[type.body, { fontSize: 14, color: i === chip ? "#fff" : colors.ink }]}>{c}</Text>
              </Pressable>
            ))}
          </View>

          <View style={s.row}>
            <Text style={[type.body, { fontWeight: "600" }]}>Popular</Text>
            <Text style={[type.small, { color: accent, fontWeight: "600" }]}>See all</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.lg, gap: 12 }}>
          {POPULAR.map((p) => (
            <View key={p.name} style={{ width: 150 }}>
              <LinearGradient colors={p.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.popular} />
              <Text style={[type.body, { fontSize: 14, fontWeight: "600", marginTop: 8 }]}>{p.name}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const channel = (hex: string, fn: (v: number) => number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${fn(n >> 16)}, ${fn((n >> 8) & 255)}, ${fn(n & 255)})`;
};
const tint = (hex: string, a: number) => channel(hex, (v) => Math.round(v + (255 - v) * a));
const shade = (hex: string, a: number) => channel(hex, (v) => Math.round(v * (1 - a)));

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F6F4F0" },
  pad: { paddingHorizontal: space.lg, paddingTop: space.sm, gap: 16, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FB7185" },
  search: { height: 50, paddingHorizontal: 16, borderRadius: radius.field, backgroundColor: "#fff", flexDirection: "row", alignItems: "center", gap: 10 },
  hero: { height: 250, borderRadius: radius.card, overflow: "hidden" },
  sun: {
    position: "absolute", top: 58, left: 200, width: 66, height: 66, borderRadius: 33, backgroundColor: "#FFF4C9",
    shadowColor: "#FFF0BE", shadowOpacity: 0.7, shadowRadius: 30,
  },
  cloud: { position: "absolute", height: 22, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.85)" },
  heroLabel: { position: "absolute", left: 20, bottom: 18 },
  chip: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: "#fff" },
  popular: { height: 112, borderRadius: 20 },
});
