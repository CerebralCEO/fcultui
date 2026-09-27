import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { colors, motion, radius, space, type } from "../fcult/tokens";

const WEEK = [0.42, 0.68, 0.51, 0.9, 0.62, 0.76, 0.38];
const TX = [
  { name: "Spotify", sub: "Subscription", amount: "-$9.99", color: "#1DB954" },
  { name: "Salary", sub: "Acme Inc.", amount: "+$4,200", color: undefined },
  { name: "Blue Bottle", sub: "Coffee", amount: "-$6.50", color: "#C08457" },
];

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({ accent = "#__ACCENT__" }: { accent?: string }) {
  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.row}>
          <View style={[s.avatar, { backgroundColor: "#F472B6" }]} />
          <View style={{ marginLeft: 12 }}>
            <Text style={s.small}>Good morning</Text>
            <Text style={s.strong}>Sara Lee</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={[s.avatar, s.center, { backgroundColor: colors.nightCard }]}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
          </View>
        </View>

        <LinearGradient colors={[accent, shade(accent, 0.45)]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.card}>
          <View style={[s.circle, { width: 230, height: 230, top: -112, right: -92 }]} />
          <View style={[s.circle, { width: 160, height: 160, bottom: -118, right: 18 }]} />
          <Text style={[s.small, { color: "rgba(255,255,255,0.7)" }]}>Total balance</Text>
          <Text style={s.balance}>$24,830.50</Text>
          <View style={s.pill}>
            <Text style={s.pillText}>+2.4% this month</Text>
          </View>
          <View style={[s.row, { marginTop: "auto" }]}>
            <Text style={s.cardNum}>•••• 4291</Text>
            <View style={{ flex: 1 }} />
            <Text style={s.cardNum}>VISA</Text>
          </View>
        </LinearGradient>

        <View style={[s.row, { justifyContent: "space-between" }]}>
          {["Send", "Request", "Top up", "More"].map((label) => (
            <View key={label} style={{ alignItems: "center" }}>
              <View style={[s.action, s.center]}>
                <View style={[s.actionGlyph, { borderColor: accent }]} />
              </View>
              <Text style={[s.small, { fontSize: 12, marginTop: 8 }]}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={s.row}>
          <Text style={s.strong}>Spending</Text>
          <View style={{ flex: 1 }} />
          <Text style={s.small}>This week</Text>
        </View>

        <View style={s.chart}>
          {WEEK.map((v, i) => (
            <Bar key={i} value={v} index={i} label={"MTWTFSS"[i]} color={i === 3 ? accent : "#22242B"} />
          ))}
        </View>

        {TX.map((t) => (
          <View key={t.name} style={[s.row, { marginBottom: 14 }]}>
            <View style={[s.txIcon, { backgroundColor: t.color ?? accent }]} />
            <View style={{ marginLeft: 12 }}>
              <Text style={s.strong}>{t.name}</Text>
              <Text style={s.small}>{t.sub}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={[s.strong, t.amount.startsWith("+") && { color: colors.positive }]}>{t.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Bars grow in with a 70 ms stagger — same timing as the Flutter version. */
function Bar({ value, index, label, color }: { value: number; index: number; label: string; color: string }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(index * 70, withTiming(value, { duration: motion.medium, easing: motion.easeOutExpo }));
  }, [h, index, value]);
  const style = useAnimatedStyle(() => ({ height: `${h.value * 100}%` }));

  return (
    <View style={{ flex: 1, alignItems: "stretch" }}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View style={[{ borderRadius: 8, backgroundColor: color }, style]} />
      </View>
      <Text style={[s.small, { fontSize: 11, marginTop: 8, textAlign: "center" }]}>{label}</Text>
    </View>
  );
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.round(v * (1 - amount));
  return `rgb(${c(n >> 16)}, ${c((n >> 8) & 255)}, ${c(n & 255)})`;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D0E12" },
  content: { paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md, gap: 20 },
  row: { flexDirection: "row", alignItems: "center" },
  center: { alignItems: "center", justifyContent: "center" },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  small: { ...type.small, color: colors.nightMuted },
  strong: { ...type.body, fontWeight: "600", color: "#fff" },
  card: { height: 196, padding: 22, borderRadius: radius.card, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 999, backgroundColor: "rgba(255,255,255,0.1)" },
  balance: { ...type.display, fontSize: 36, color: "#fff", marginTop: 6, marginBottom: 8 },
  pill: { alignSelf: "flex-start", paddingHorizontal: 9, paddingVertical: 3, borderRadius: radius.pill, backgroundColor: "rgba(255,255,255,0.18)" },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  cardNum: { color: "rgba(255,255,255,0.7)", letterSpacing: 1.7 },
  action: { width: 56, height: 56, borderRadius: 18, borderWidth: 1, borderColor: "#23252B", backgroundColor: "#16171C" },
  actionGlyph: { width: 20, height: 20, borderRadius: 6, borderWidth: 2 },
  chart: { height: 128, flexDirection: "row", gap: 12 },
  txIcon: { width: 44, height: 44, borderRadius: 14 },
});
