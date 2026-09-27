import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing, cancelAnimation, interpolate, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withRepeat, withTiming,
} from "react-native-reanimated";
import { colors, space, type } from "../fcult/tokens";

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__", sessionSeconds = 272 }: { accent?: string; sessionSeconds?: number }) {
  const breath = useSharedValue(0);
  const [inhaling, setInhaling] = useState(true);
  const [left, setLeft] = useState(sessionSeconds);
  const [paused, setPaused] = useState(false);

  // One inhale (4 s) + one exhale (4 s).
  useEffect(() => {
    if (paused) cancelAnimation(breath);
    else breath.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [breath, paused]);

  useEffect(() => {
    const id = setInterval(() => !paused && setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => clearInterval(id);
  }, [paused]);

  useAnimatedReaction(
    () => breath.value,
    (now, prev) => {
      if (prev !== null && now !== prev) runOnJS(setInhaling)(now > prev);
    },
  );

  const pulse = useAnimatedStyle(() => ({ transform: [{ scale: interpolate(breath.value, [0, 1], [0.82, 1.06]) }] }));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <LinearGradient colors={[mix("#062A28", accent, 0.38), "#041514"]} style={{ flex: 1 }}>
      <SafeAreaView style={s.root}>
        <View style={s.row}>
          <Ionicons name="close" size={22} color="#fff" />
          <Text style={s.caps}>BREATHE</Text>
          <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
        </View>

        <View style={s.stage}>
          {[
            [300, 0.08],
            [240, 0.14],
            [184, 0.24],
          ].map(([size, alpha]) => (
            <Animated.View key={size} style={[s.ring, { width: size, height: size, backgroundColor: accent, opacity: alpha }, pulse]} />
          ))}
          <Animated.View style={[s.core, { backgroundColor: accent }, pulse]}>
            <Text style={s.coreText}>{inhaling ? "Breathe in" : "Breathe out"}</Text>
          </Animated.View>
        </View>

        <Text style={s.time}>{mm}:{ss}</Text>
        <Text style={s.hint}>Relax your shoulders and follow the circle</Text>

        <View style={s.controls}>
          <Pressable style={s.ghost} onPress={() => setLeft(sessionSeconds)}>
            <Ionicons name="refresh" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
          <Pressable style={s.pause} onPress={() => setPaused((p) => !p)}>
            <Ionicons name={paused ? "play" : "pause"} size={32} color={colors.ink} />
          </Pressable>
          <Pressable style={s.ghost}>
            <Ionicons name="musical-note" size={20} color="rgba(255,255,255,0.7)" />
          </Pressable>
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
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  caps: { ...type.small, color: "#fff", letterSpacing: 1.3, fontWeight: "600" },
  stage: { flex: 1, alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", borderRadius: 999 },
  core: { width: 132, height: 132, borderRadius: 66, alignItems: "center", justifyContent: "center" },
  coreText: { ...type.body, fontSize: 17, fontWeight: "700", color: "#042220" },
  time: { textAlign: "center", fontSize: 46, fontWeight: "300", letterSpacing: -1.8, color: "#fff", fontVariant: ["tabular-nums"] },
  hint: { ...type.body, textAlign: "center", color: colors.nightMuted, marginTop: 8 },
  controls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 40, marginTop: 26 },
  ghost: { width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center" },
  pause: { width: 74, height: 74, borderRadius: 37, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
});
