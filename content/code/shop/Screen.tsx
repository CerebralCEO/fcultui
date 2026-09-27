import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors, motion, radius, space, type } from "../fcult/tokens";

type Props = { accent?: string; onAddToBag?: (swatch: number, quantity: number) => void };

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__", onAddToBag }: Props) {
  const swatches = [accent, "#1C1C1C", "#D9D4CC", "#7C9A8B"];
  const [swatch, setSwatch] = useState(0);
  const [qty, setQty] = useState(1);
  const [bag, setBag] = useState(2);
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 2400, easing: motion.easeOutExpo }), -1, true);
  }, [bob]);

  const bottle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(bob.value, [0, 1], [6, -14]) }, { rotate: `${interpolate(bob.value, [0, 1], [-3, 4])}deg` }],
  }));
  const shadow = useAnimatedStyle(() => ({ transform: [{ scaleX: interpolate(bob.value, [0, 1], [1.05, 0.75]) }] }));
  const color = swatches[swatch];

  return (
    <SafeAreaView style={s.root}>
      <View style={s.row}>
        <View style={s.round}><Ionicons name="chevron-back" size={18} color={colors.ink} /></View>
        <Text style={s.strong}>Details</Text>
        <View style={s.round}>
          <Ionicons name="bag-outline" size={18} color={colors.ink} />
          <View style={[s.badge, { backgroundColor: accent }]}><Text style={s.badgeText}>{bag}</Text></View>
        </View>
      </View>

      <View style={s.stage}>
        <View style={[s.disc, { backgroundColor: `${color}38` }]} />
        <Animated.View style={[s.shadow, shadow]} />
        <Animated.View style={[{ alignItems: "center" }, bottle]}>
          <LinearGradient colors={["#111", "#3A3A3A", "#111"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cap} />
          <LinearGradient
            colors={[color, color, "#ffffff66", color, color]}
            locations={[0, 0.32, 0.52, 0.72, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.body}
          >
            <View style={s.label}><Text style={s.labelText}>AURA</Text></View>
          </LinearGradient>
        </Animated.View>
      </View>

      <View style={[s.row, { alignItems: "flex-start" }]}>
        <View>
          <Text style={type.title}>Aura Bottle</Text>
          <Text style={[s.muted, { marginTop: 4 }]}>★ 4.9 · 2.1k reviews</Text>
        </View>
        <Text style={[type.title, { fontSize: 28 }]}>$38</Text>
      </View>
      <Text style={[s.muted, { fontSize: 14 }]}>Double-walled steel keeps drinks cold for 24 hours and hot for 12.</Text>

      <View style={[s.row, { justifyContent: "flex-start", gap: 14 }]}>
        {swatches.map((c, i) => (
          <Pressable key={c} onPress={() => setSwatch(i)} style={[s.swatchRing, i === swatch && { borderColor: colors.ink }]}>
            <View style={[s.swatch, { backgroundColor: c }]} />
          </Pressable>
        ))}
      </View>

      <View style={[s.row, { gap: 12 }]}>
        <View style={s.qty}>
          <Text style={s.qtyBtn} onPress={() => setQty((q) => Math.max(1, q - 1))}>−</Text>
          <Text style={type.button}>{qty}</Text>
          <Text style={s.qtyBtn} onPress={() => setQty((q) => Math.min(9, q + 1))}>+</Text>
        </View>
        <Pressable
          style={s.cta}
          onPress={() => {
            setBag((b) => b + qty);
            onAddToBag?.(swatch, qty);
          }}
        >
          <Text style={[type.button, { color: "#fff" }]}>Add to bag</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EFEBE4", paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md, gap: 16 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  strong: { ...type.body, fontWeight: "600", color: colors.ink },
  muted: { ...type.body, color: colors.inkMuted },
  round: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  badge: { position: "absolute", top: -3, right: -3, width: 19, height: 19, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  stage: { flex: 1, minHeight: 280, alignItems: "center", justifyContent: "center" },
  disc: { position: "absolute", width: 270, height: 270, borderRadius: 135 },
  shadow: { position: "absolute", bottom: 18, width: 130, height: 16, borderRadius: 99, backgroundColor: "rgba(0,0,0,0.12)" },
  cap: { width: 58, height: 42, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  body: { width: 98, height: 210, marginTop: -4, borderRadius: 34, justifyContent: "center", overflow: "hidden" },
  label: { paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.9)" },
  labelText: { textAlign: "center", fontSize: 12, fontWeight: "700", letterSpacing: 3.6, color: "#5a3a26" },
  swatchRing: { padding: 3, borderRadius: 99, borderWidth: 2, borderColor: "transparent" },
  swatch: { width: 34, height: 34, borderRadius: 17 },
  qty: {
    width: 118, height: 56, paddingHorizontal: 16, borderRadius: radius.button, borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  qtyBtn: { fontSize: 18, color: colors.inkMuted },
  cta: { flex: 1, height: 56, borderRadius: radius.button, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
});
