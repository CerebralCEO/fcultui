import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, motion, radius, space, type } from "../fcult/tokens";

type Props = { accent?: string; onSignIn?: (email: string, password: string) => Promise<void> };

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__", onSignIn }: Props) {
  const [email, setEmail] = useState("sara@nova.app");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const progress = useSharedValue(0);

  const submit = async () => {
    progress.value = withTiming(1, { duration: 1400, easing: motion.easeOutExpo });
    await onSignIn?.(email, password);
    progress.value = withTiming(0, { duration: motion.fast });
  };

  const sweep = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <SafeAreaView style={s.root}>
      <LinearGradient colors={[accent, shade(accent, 0.45)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[s.logo, { shadowColor: accent }]}>
        <View style={s.logoRing} />
      </LinearGradient>

      <Text style={s.title}>Welcome back</Text>
      <Text style={s.muted}>Sign in to continue to Nova</Text>

      <View style={{ marginTop: 26 }}>
        <Text style={s.label}>Email</Text>
        <TextInput style={s.field} value={email} onChangeText={setEmail} autoCapitalize="none" selectionColor={accent} />
        <Text style={s.label}>Password</Text>
        <TextInput
          style={[s.field, { borderColor: `${accent}B3` }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          selectionColor={accent}
        />
      </View>

      <View style={[s.row, { marginTop: 16 }]}>
        <Pressable onPress={() => setRemember((r) => !r)} style={[s.check, { borderColor: accent, backgroundColor: remember ? accent : "transparent" }]} />
        <Text style={[s.small, { marginLeft: 8, color: colors.nightMuted }]}>Remember me</Text>
        <View style={{ flex: 1 }} />
        <Text style={[s.small, { color: accent, fontWeight: "600" }]}>Forgot?</Text>
      </View>

      <Pressable onPress={submit} style={[s.button, { backgroundColor: accent }]}>
        <Animated.View style={[s.sweep, sweep]} />
        <Text style={s.buttonText}>Sign in</Text>
      </Pressable>

      <View style={[s.row, { marginTop: 28 }]}>
        <View style={s.line} />
        <Text style={[s.small, { marginHorizontal: 12, color: colors.nightMuted }]}>or continue with</Text>
        <View style={s.line} />
      </View>

      <View style={[s.row, { marginTop: 18, gap: 12 }]}>
        {["G", "X", "f"].map((p) => (
          <View key={p} style={s.social}>
            <Text style={s.socialText}>{p}</Text>
          </View>
        ))}
      </View>

      <Text style={s.foot}>
        New here? <Text style={{ color: "#fff", fontWeight: "600" }}>Create account</Text>
      </Text>
    </SafeAreaView>
  );
}

/** Mix a hex colour toward black (same maths as Color.lerp in Flutter). */
function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * (1 - amount));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0A0A0B", paddingHorizontal: space.lg, paddingTop: 34, paddingBottom: space.md },
  row: { flexDirection: "row", alignItems: "center" },
  logo: {
    width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 26,
    shadowOpacity: 0.7, shadowRadius: 20, shadowOffset: { width: 0, height: 16 },
  },
  logoRing: { width: 24, height: 24, borderRadius: 12, borderWidth: 4, borderColor: "#fff" },
  title: { ...type.title, color: "#fff" },
  muted: { ...type.body, color: colors.nightMuted, marginTop: 8 },
  label: { ...type.small, color: colors.nightMuted, marginTop: 16, marginBottom: 8 },
  field: {
    height: 54, paddingHorizontal: 16, borderRadius: radius.field, borderWidth: 1,
    borderColor: "#242427", backgroundColor: "#151517", color: "#fff", ...type.body,
  },
  small: { ...type.small },
  check: { width: 18, height: 18, borderRadius: 6, borderWidth: 1 },
  button: { height: 56, marginTop: 24, borderRadius: radius.button, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  sweep: { position: "absolute", left: 0, top: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.22)" },
  buttonText: { ...type.button, color: "#fff" },
  line: { flex: 1, height: 1, backgroundColor: "#232326" },
  social: {
    flex: 1, height: 54, borderRadius: radius.field, borderWidth: 1, borderColor: "#242427",
    backgroundColor: "#151517", alignItems: "center", justifyContent: "center",
  },
  socialText: { color: "#fff", fontSize: 19, fontWeight: "700" },
  foot: { ...type.body, fontSize: 14, marginTop: "auto", textAlign: "center", color: colors.nightMuted },
});
