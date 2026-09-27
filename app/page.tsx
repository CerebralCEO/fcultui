import Intro from "@/components/Intro";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import Pagination from "@/components/Pagination";
import { PromoCard, ScreenCard } from "@/components/ScreenCards";
import { screenGrid, screenTags } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Intro />
      <Filters tags={screenTags} mode="screens" showPlatform />
      <PostsGrid className="posts screens">
        {screenGrid.map((item) =>
          "promo" in item ? <PromoCard key="promo" promo={item} /> : <ScreenCard key={item.slug} screen={item} />
        )}
      </PostsGrid>
      <Pagination base="/screens" last={48} nextLabel="Older" />
    </>
  );
}
