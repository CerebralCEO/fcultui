import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type SharedValue } from "react-native-reanimated";
import { colors, radius, space, type } from "../fcult/tokens";

/** Gentle vertical float, phase-shifted per chip. */
function useFloat(loop: SharedValue<number>, phase: number) {
  return useAnimatedStyle(() => ({ transform: [{ translateY: Math.sin(loop.value * Math.PI * 2 + phase) * -6 }] }));
}

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__", onGetStarted }: { accent?: string; onGetStarted?: () => void }) {
  const loop = useSharedValue(0);

  useEffect(() => {
    loop.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1);
  }, [loop]);

  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${loop.value * 360}deg` }] }));
  const orb = useAnimatedStyle(() => {
    const t = loop.value * Math.PI * 2;
    return { transform: [{ rotate: `${Math.sin(t) * 20}deg` }, { scale: 1 + Math.sin(t) * 0.04 }] };
  });
  const float0 = useFloat(loop, 0);
  const float1 = useFloat(loop, 2);
  const float2 = useFloat(loop, 4);

  return (
    <SafeAreaView style={s.root}>
      <View style={s.row}>
        <View style={[s.logo, { backgroundColor: accent }]} />
        <Text style={s.brand}>Bloom</Text>
        <View style={{ flex: 1 }} />
        <Text style={s.muted}>Skip</Text>
      </View>

      <View style={s.art}>
        <Animated.View style={[s.ringWrap, ring]}>
          <LinearGradient colors={[accent, "#FFD166", "transparent", accent]} style={s.ring}>
            <View style={s.ringHole} />
          </LinearGradient>
        </Animated.View>
        <Animated.View style={[s.orb, { backgroundColor: accent, shadowColor: accent }, orb]} />
        <Animated.View style={[s.chip, { top: 40, left: -4 }, float0]}>
          <View style={[s.dot, { backgroundColor: accent }]} />
          <Text style={s.chipText}>12-day streak</Text>
        </Animated.View>
        <Animated.View style={[s.chip, { top: 170, right: -4 }, float1]}>
          <Text style={s.chipText}>+ Morning run</Text>
        </Animated.View>
        <Animated.View style={[s.chip, { bottom: 20, left: 14 }, float2]}>
          <Text style={s.chipText}>Read 20 pages ✓</Text>
        </Animated.View>
      </View>

      <Text style={s.title}>{"Grow a little\nevery day"}</Text>
      <Text style={s.copy}>Build habits that stick with gentle reminders and beautiful progress.</Text>

      <View style={[s.row, { marginVertical: space.md }]}>
        <View style={[s.pageDot, s.pageDotOn]} />
        <View style={s.pageDot} />
        <View style={s.pageDot} />
      </View>

      <Pressable style={s.button} onPress={onGetStarted}>
        <Text style={s.buttonText}>Get started</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F0E8", paddingHorizontal: space.lg, paddingBottom: space.md },
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 22, height: 22, borderRadius: 7, marginRight: 8 },
  brand: { ...type.body, fontSize: 17, fontWeight: "700", color: colors.ink },
  muted: { ...type.body, color: colors.inkMuted },
  art: { flex: 1, alignItems: "center", justifyContent: "center" },
  ringWrap: { position: "absolute" },
  ring: { width: 290, height: 290, borderRadius: 145, padding: 2.5 },
  ringHole: { flex: 1, borderRadius: 145, backgroundColor: "#F5F0E8" },
  orb: { width: 214, height: 214, borderRadius: 107, shadowOpacity: 0.6, shadowRadius: 30, shadowOffset: { width: 0, height: 30 } },
  chip: {
    position: "absolute", flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.pill, backgroundColor: colors.paper,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 8 },
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  chipText: { ...type.small, fontWeight: "600", color: colors.ink },
  title: { ...type.display, fontSize: 36, color: colors.ink },
  copy: { ...type.body, fontSize: 16, color: colors.inkMuted, marginTop: 12 },
  pageDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6, backgroundColor: "rgba(0,0,0,0.15)" },
  pageDotOn: { width: 26, backgroundColor: colors.ink },
  button: { height: 56, borderRadius: radius.button, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  buttonText: { ...type.button, color: colors.paper },
});

