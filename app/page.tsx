import Intro from "@/components/Intro";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import Pagination from "@/components/Pagination";
import { WebsiteCard } from "@/components/Cards";
import { websites, websiteTags } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Intro />
      <Filters tags={websiteTags} mode="websites" />
      <PostsGrid className="posts websites">
        {websites.map((w) => (
          <WebsiteCard key={w.title} post={w} />
        ))}
      </PostsGrid>
      <Pagination base="/websites" last={131} nextLabel="Older" />
    </>
  );
}
