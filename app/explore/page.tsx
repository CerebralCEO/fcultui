import type { Metadata } from "next";
import ExploreWall from "@/components/explore/ExploreWall";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Explore every screen – ${site.name}`,
  description: "An endless wall of every Flutter & React Native screen. Scroll forever in either direction, search, and open any screen.",
};

export default function ExplorePage() {
  return <ExploreWall />;
}
