import Intro from "@/components/Intro";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import { PromoCard, ScreenCard } from "@/components/ScreenCards";
import { promo } from "@/lib/data";
import { getCategories, getScreens } from "@/lib/content";

export default async function Home() {
  const [screens, categories] = await Promise.all([getScreens(), getCategories()]);
  // The promo occupies slot 4 (pinned to the last column of row 1 by CSS, like the original sponsor)
  const grid = [...screens.slice(0, 3), promo, ...screens.slice(3)];

  return (
    <>
      <Intro />
      <Filters tags={categories} mode="screens" showPlatform />
      {screens.length === 0 ? (
        <section className="posts-empty">
          <strong>Fresh screens are on the way</strong>
          <p>Every screen ships with Flutter and React Native code that renders pixel-identical UI. The first ones land here soon.</p>
        </section>
      ) : (
        <PostsGrid className="posts screens">
          {grid.map((item) =>
            "promo" in item ? <PromoCard key="promo" promo={item} /> : <ScreenCard key={item.slug} screen={item} />,
          )}
        </PostsGrid>
      )}
    </>
  );
}
