import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type SharedValue,
} from "react-native-reanimated";
import { colors, radius, space, type } from "../fcult/tokens";

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__", playing: initial = true }: { accent?: string; playing?: boolean }) {
  const [playing, setPlaying] = useState(initial);
  const spin = useSharedValue(0);
  const eq = useSharedValue(0);
  const progress = useSharedValue(0.36);

  useEffect(() => {
    if (playing) {
      spin.value = withRepeat(withTiming(spin.value + 1, { duration: 3200, easing: Easing.linear }), -1);
      eq.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
      progress.value = withTiming(0.78, { duration: 5000, easing: Easing.linear });
    } else {
      cancelAnimation(spin);
      cancelAnimation(eq);
      cancelAnimation(progress);
    }
  }, [playing, spin, eq, progress]);

  const vinyl = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));
  const bar = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <LinearGradient colors={[mix(accent, 0.4), "#0A0A0B"]} locations={[0, 0.62]} style={{ flex: 1 }}>
      <SafeAreaView style={s.root}>
        <View style={s.row}>
          <Ionicons name="chevron-down" size={22} color="#fff" />
          <Text style={s.caps}>NOW PLAYING</Text>
          <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
        </View>

        <View style={[s.art, { backgroundColor: accent }]}>
          <Animated.View style={[s.vinyl, vinyl]}>
            {Array.from({ length: 15 }, (_, i) => (
              <View key={i} style={[s.groove, { width: 80 + i * 10, height: 80 + i * 10 }]} />
            ))}
            <View style={[s.label, { backgroundColor: accent }]}>
              <View style={s.hole} />
            </View>
          </Animated.View>
        </View>

        <View style={s.row}>
          <View>
            <Text style={s.title}>Midnight Drive</Text>
            <Text style={s.muted}>Neon Coast</Text>
          </View>
          <Ionicons name="heart" size={26} color={accent} />
        </View>

        <View style={s.track}>
          <Animated.View style={[s.fill, bar]} />
        </View>
        <View style={[s.row, { marginTop: -8 }]}>
          <Text style={s.small}>1:24</Text>
          <Text style={s.small}>3:48</Text>
        </View>

        <View style={s.row}>
          <Ionicons name="shuffle" size={22} color="rgba(255,255,255,0.55)" />
          <Ionicons name="play-skip-back" size={30} color="#fff" />
          <Pressable style={s.play} onPress={() => setPlaying((p) => !p)}>
            <Ionicons name={playing ? "pause" : "play"} size={34} color={colors.ink} />
          </Pressable>
          <Ionicons name="play-skip-forward" size={30} color="#fff" />
          <Ionicons name="repeat" size={22} color="rgba(255,255,255,0.55)" />
        </View>

        <View style={s.eq}>
          {Array.from({ length: 28 }, (_, i) => (
            <EqBar key={i} index={i} eq={eq} />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function EqBar({ index, eq }: { index: number; eq: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    height: `${(0.25 + 0.75 * ((Math.sin(eq.value * Math.PI + index * 0.9) + 1) / 2)) * 100}%`,
  }));
  return <Animated.View style={[s.eqBar, style]} />;
}

function mix(hex: string, towardBlack: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * (1 - towardBlack));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md, gap: 18 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  caps: { ...type.small, color: "rgba(255,255,255,0.7)", letterSpacing: 1.3, fontWeight: "600" },
  art: {
    width: "100%", aspectRatio: 1, borderRadius: radius.card, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.7, shadowRadius: 30, shadowOffset: { width: 0, height: 30 },
  },
  vinyl: { width: 230, height: 230, borderRadius: 115, backgroundColor: "#151515", alignItems: "center", justifyContent: "center" },
  groove: { position: "absolute", borderRadius: 999, borderWidth: 1, borderColor: "#232323" },
  label: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center" },
  hole: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" },
  title: { ...type.title, fontSize: 26, color: "#fff" },
  muted: { ...type.body, color: colors.nightMuted },
  small: { ...type.small, color: colors.nightMuted },
  track: { height: 5, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.2)", overflow: "hidden" },
  fill: { height: "100%", borderRadius: 3, backgroundColor: "#fff" },
  play: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  eq: { height: 44, marginTop: "auto", flexDirection: "row", alignItems: "flex-end", gap: 4 },
  eqBar: { flex: 1, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.35)" },
});
