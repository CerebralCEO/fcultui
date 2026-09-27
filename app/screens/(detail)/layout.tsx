import ScreenNav from "@/components/detail/ScreenNav";

/**
 * Persistent shell for every /screens/[slug] page (route group, so /screens itself is untouched).
 * Because this layout does not remount between screens, the rail keeps its scroll position and the
 * active pill springs from item to item.
 */
export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="detail">
      <ScreenNav />
      {children}
    </div>
  );
}
