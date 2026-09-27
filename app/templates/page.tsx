import type { Metadata } from "next";
import PostsHeader from "@/components/PostsHeader";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import Pagination from "@/components/Pagination";
import { KitCard } from "@/components/ScreenCards";
import { appKits, kitTags } from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `App templates – ${site.name}` };

export default function TemplatesPage() {
  return (
    <>
      <PostsHeader
        title={["App templates", "for creatives"]}
        subtitle="Complete multi-screen app kits, each shipped in both Flutter and React Native with identical UI."
      />
      <Filters tags={kitTags} mode="templates" showAll={false} showPlatform />
      <PostsGrid className="posts templates">
        {appKits.map((k) => (
          <KitCard key={k.slug} kit={k} />
        ))}
      </PostsGrid>
      <Pagination base="/templates" last={8} nextLabel="Next" />
    </>
  );
}
