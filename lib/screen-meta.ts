import type { ScreenDesign } from "./data";

export type PropRow = {
  name: string;
  flutter: string;
  rn: string;
  default: string;
  description: string;
};

export type DesignMeta = {
  /** Human label used for flow steps / examples ("Sign in", "Dashboard"...). */
  label: string;
  description: string;
  tags: string[];
  rnDeps: string[];
  props: PropRow[];
};

const accent: PropRow = {
  name: "accent",
  flutter: "Color",
  rn: "string",
  default: "Screen accent",
  description: "Brand colour used for highlights, buttons and charts.",
};

const RN_BASE = ["react-native-reanimated", "react-native-safe-area-context"];

export const designMeta: Record<ScreenDesign, DesignMeta> = {
  onboarding: {
    label: "Welcome",
    description: "An onboarding hero with a morphing gradient orb, orbiting ring, floating habit chips and paged progress.",
    tags: ["Onboarding", "Hero", "Animation"],
    rnDeps: [...RN_BASE, "expo-linear-gradient"],
    props: [accent, { name: "onGetStarted", flutter: "VoidCallback?", rn: "() => void", default: "—", description: "Called when the primary button is pressed." }],
  },
  auth: {
    label: "Sign in",
    description: "A focused sign-in form with animated password entry, a progress-sweep submit button and social login.",
    tags: ["Authentication", "Form", "Dark"],
    rnDeps: [...RN_BASE, "expo-linear-gradient"],
    props: [
      accent,
      { name: "onSignIn", flutter: "Future<void> Function(String, String)?", rn: "(email, password) => Promise<void>", default: "—", description: "Async sign-in handler; the button sweep runs while it resolves." },
    ],
  },
  finance: {
    label: "Dashboard",
    description: "A banking overview with a gradient balance card, quick actions, a staggered spending chart and recent transactions.",
    tags: ["Finance", "Dashboard", "Chart"],
    rnDeps: [...RN_BASE, "expo-linear-gradient", "@expo/vector-icons"],
    props: [accent],
  },
  music: {
    label: "Now playing",
    description: "A now-playing screen with a spinning vinyl, live progress, transport controls and an animated equaliser.",
    tags: ["Music", "Player", "Animation"],
    rnDeps: [...RN_BASE, "expo-linear-gradient", "@expo/vector-icons"],
    props: [accent, { name: "playing", flutter: "bool", rn: "boolean", default: "true", description: "Initial playback state; the play button toggles it." }],
  },
  shop: {
    label: "Product detail",
    description: "A product page with a floating 3D-ish bottle, swatch picker, quantity stepper and add-to-bag action.",
    tags: ["E-commerce", "Product", "Light"],
    rnDeps: [...RN_BASE, "expo-linear-gradient", "@expo/vector-icons"],
    props: [
      accent,
      { name: "onAddToBag", flutter: "void Function(int, int)?", rn: "(swatch, quantity) => void", default: "—", description: "Receives the selected swatch index and quantity." },
    ],
  },
  chat: {
    label: "Chat thread",
    description: "A one-to-one conversation with sequential bubble entrances, a bouncing typing indicator and a composer bar.",
    tags: ["Chat", "Messaging", "Light"],
    rnDeps: [...RN_BASE, "@expo/vector-icons"],
    props: [
      accent,
      { name: "messages", flutter: "List<ChatMessage>", rn: "ChatMessage[]", default: "Demo thread", description: "Messages to render; `mine` aligns a bubble to the right." },
      { name: "typing", flutter: "bool", rn: "boolean", default: "true", description: "Shows the animated typing indicator." },
    ],
  },
  fitness: {
    label: "Activity",
    description: "Daily activity rings that draw in sequence, goal stats and a weekly bar chart.",
    tags: ["Fitness", "Health", "Chart"],
    rnDeps: [...RN_BASE, "react-native-svg"],
    props: [
      accent,
      { name: "rings", flutter: "List<ActivityRing>", rn: "ActivityRing[]", default: "Move / Exercise / Stand", description: "Label, value, goal, unit and colour per ring." },
      { name: "week", flutter: "List<double>", rn: "number[]", default: "7 values", description: "Weekly bar heights from 0 to 1." },
    ],
  },
  travel: {
    label: "Explore",
    description: "A destination feed with an illustrated hero (rising sun, drifting clouds), category chips and a popular carousel.",
    tags: ["Travel", "Feed", "Illustration"],
    rnDeps: [...RN_BASE, "expo-linear-gradient", "@expo/vector-icons", "react-native-svg"],
    props: [accent],
  },
  meditation: {
    label: "Breathe",
    description: "A guided breathing session: concentric circles expand and contract with the breath and a live countdown.",
    tags: ["Meditation", "Wellness", "Animation"],
    rnDeps: [...RN_BASE, "expo-linear-gradient", "@expo/vector-icons"],
    props: [
      accent,
      { name: "session", flutter: "Duration", rn: "sessionSeconds: number", default: "4:32", description: "Length of the session countdown." },
    ],
  },
  weather: {
    label: "Forecast",
    description: "Current conditions with a rotating sun, drifting cloud, glass stat cards and an hourly forecast strip.",
    tags: ["Weather", "Glass", "Illustration"],
    rnDeps: [...RN_BASE, "expo-linear-gradient", "react-native-svg"],
    props: [
      accent,
      { name: "city", flutter: "String", rn: "string", default: "San Francisco", description: "Location heading." },
      { name: "temp", flutter: "int", rn: "number", default: "24", description: "Current temperature in °C." },
      { name: "hourly", flutter: "List<HourlyForecast>", rn: "HourlyForecast[]", default: "5 hours", description: "Hourly strip items." },
    ],
  },
  settings: {
    label: "Settings",
    description: "An iOS-style grouped settings list with a profile row, coloured icons and platform-adaptive switches.",
    tags: ["Settings", "List", "Light"],
    rnDeps: [...RN_BASE, "@expo/vector-icons"],
    props: [
      { ...accent, description: "Tint used for switch tracks." },
      { name: "onChanged", flutter: "void Function(String, bool)?", rn: "(label, value) => void", default: "—", description: "Called whenever a switch changes." },
    ],
  },
  delivery: {
    label: "Order tracking",
    description: "Live courier tracking: a map with a dashed route and moving courier, plus a bottom sheet with ETA and steps.",
    tags: ["Delivery", "Maps", "Bottom sheet"],
    rnDeps: [...RN_BASE, "@expo/vector-icons", "react-native-svg"],
    props: [
      accent,
      { name: "minutesLeft", flutter: "int", rn: "number", default: "12", description: "ETA shown in the sheet." },
      { name: "step", flutter: "int", rn: "number", default: "2", description: "0 placed · 1 picked up · 2 on the way · 3 delivered." },
    ],
  },
};

export const pascal = (s: string) =>
  s
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

export const snake = (s: string) => pascal(s).replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
