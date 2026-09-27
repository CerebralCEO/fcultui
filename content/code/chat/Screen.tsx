import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from "react-native-reanimated";
import { colors, motion, space, type } from "../fcult/tokens";

export type ChatMessage = { text: string; mine?: boolean };

const DEFAULT_MESSAGES: ChatMessage[] = [
  { text: "Hey! Are we still on for tonight?" },
  { text: "Yes! 7pm at Lumen 🍜", mine: true },
  { text: "Perfect. I booked a table by the window" },
  { text: "You're the best", mine: true },
  { text: "Bringing the photos from the trip too", mine: true },
];

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({
  accent = "#__ACCENT__",
  messages = DEFAULT_MESSAGES,
  typing = true,
}: { accent?: string; messages?: ChatMessage[]; typing?: boolean }) {
  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <Ionicons name="chevron-back" size={20} color={colors.ink} />
        <View style={s.avatar} />
        <View>
          <Text style={s.strong}>Maya Chen</Text>
          <Text style={[type.small, { color: "#22C55E" }]}>Online</Text>
        </View>
        <View style={{ flex: 1 }} />
        <View style={s.action}><Ionicons name="call-outline" size={18} color={accent} /></View>
        <View style={s.action}><Ionicons name="videocam-outline" size={18} color={accent} /></View>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        <Text style={s.date}>Today</Text>
        {messages.map((m, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(i * 320).duration(550).easing(motion.easeOutExpo)}
            style={[s.bubble, m.mine ? [s.mine, { backgroundColor: accent }] : s.theirs]}
          >
            <Text style={[type.body, { color: m.mine ? "#fff" : colors.ink }]}>{m.text}</Text>
          </Animated.View>
        ))}
        {typing && (
          <Animated.View entering={FadeInDown.delay(messages.length * 320).duration(550)} style={[s.bubble, s.theirs, s.typing]}>
            {[0, 1, 2].map((d) => (
              <TypingDot key={d} index={d} />
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <View style={s.input}>
        <View style={s.plus}><Ionicons name="add" size={18} color={colors.ink} /></View>
        <Text style={[type.body, { flex: 1, color: colors.inkMuted }]}>Message</Text>
        <View style={[s.mic, { backgroundColor: accent }]}><Ionicons name="mic-outline" size={20} color="#fff" /></View>
      </View>
    </SafeAreaView>
  );
}

function TypingDot({ index }: { index: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      index * 150,
      withRepeat(withSequence(withTiming(-5, { duration: 300 }), withTiming(0, { duration: 300 }), withTiming(0, { duration: 400 })), -1),
    );
  }, [index, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[s.dot, style]} />;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingBottom: space.md },
  header: {
    flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: "#F0F0F2",
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#A78BFA" },
  strong: { ...type.body, fontWeight: "600", color: colors.ink },
  action: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#F2F3F5", alignItems: "center", justifyContent: "center" },
  body: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  date: {
    alignSelf: "center", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, overflow: "hidden",
    backgroundColor: "#F2F3F5", fontSize: 12, color: colors.inkMuted,
  },
  bubble: { maxWidth: "78%", paddingHorizontal: 15, paddingVertical: 11, borderRadius: 20 },
  theirs: { alignSelf: "flex-start", backgroundColor: "#F1F2F5", borderBottomLeftRadius: 6 },
  mine: { alignSelf: "flex-end", borderBottomRightRadius: 6 },
  typing: { flexDirection: "row", gap: 5, padding: 15 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#9CA3AF" },
  input: {
    height: 52, marginHorizontal: 16, paddingLeft: 8, paddingRight: 6, borderRadius: 26,
    backgroundColor: "#F2F3F5", flexDirection: "row", alignItems: "center", gap: 10,
  },
  plus: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  mic: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
});
