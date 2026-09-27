import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, space, type } from "../fcult/tokens";

type Row = { label: string; color: string; value?: string; toggle?: boolean };

const GROUPS: Row[][] = [
  [
    { label: "Airplane Mode", color: "#FF9500", toggle: false },
    { label: "Wi-Fi", color: "#0A84FF", value: "Home" },
    { label: "Bluetooth", color: "#0A84FF", value: "On" },
  ],
  [
    { label: "Notifications", color: "#FF3B30", toggle: true },
    { label: "Focus", color: "#5E5CE6", toggle: false },
    { label: "Dark Mode", color: "#1C1C1E", toggle: false },
    { label: "Haptics", color: "#FF2D55", toggle: true },
  ],
];

/** __TITLE__ — FCult UI. Pixel-identical to the Flutter version. */
export function __NAME__Screen({
  accent = "#__ACCENT__",
  onChanged,
}: {
  /** Tint used for switches (defaults to the iOS system green). */
  accent?: string;
  onChanged?: (label: string, value: boolean) => void;
}) {
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(GROUPS.flat().filter((r) => r.toggle !== undefined).map((r) => [r.label, r.toggle!])),
  );

  return (
    <SafeAreaView style={s.root}>
      <ScrollView contentContainerStyle={s.content}>
        <Text style={[type.display, { fontWeight: "700" }]}>Settings</Text>
        <View style={s.search}>
          <Ionicons name="search" size={18} color="rgba(60,60,67,0.6)" />
          <Text style={{ color: "rgba(60,60,67,0.6)", fontSize: 15 }}>Search</Text>
        </View>

        <View style={s.group}>
          <View style={[s.row, { height: 76 }]}>
            <View style={s.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={[type.body, { fontWeight: "600" }]}>Sara Lee</Text>
              <Text style={[type.small, { color: colors.inkMuted }]}>Account, sync & more</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#C4C4C7" />
          </View>
        </View>

        {GROUPS.map((group, gi) => (
          <View key={gi} style={s.group}>
            {group.map((row, i) => (
              <View key={row.label} style={[s.row, i > 0 && s.divider]}>
                <View style={[s.icon, { backgroundColor: row.color }]} />
                <Text style={[type.body, { flex: 1 }]}>{row.label}</Text>
                {row.toggle !== undefined ? (
                  <Switch
                    value={state[row.label]}
                    trackColor={{ true: accent, false: "#E9E9EB" }}
                    ios_backgroundColor="#E9E9EB"
                    onValueChange={(v) => {
                      setState((prev) => ({ ...prev, [row.label]: v }));
                      onChanged?.(row.label, v);
                    }}
                  />
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={[type.body, { color: colors.inkMuted }]}>{row.value}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#C4C4C7" />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F2F7" },
  content: { paddingHorizontal: space.lg, paddingTop: space.sm, paddingBottom: space.md, gap: 14 },
  search: {
    height: 38, marginTop: -4, paddingHorizontal: 12, borderRadius: 12,
    backgroundColor: "rgba(118,118,128,0.12)", flexDirection: "row", alignItems: "center", gap: 6,
  },
  group: { borderRadius: 14, backgroundColor: "#fff", paddingHorizontal: 16, overflow: "hidden" },
  row: { height: 50, flexDirection: "row", alignItems: "center", gap: 12 },
  divider: { borderTopWidth: 1, borderTopColor: "#ECECF0" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#6366F1" },
  icon: { width: 30, height: 30, borderRadius: 8 },
});
