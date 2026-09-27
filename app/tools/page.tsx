import type { Metadata } from "next";
import PostsHeader from "@/components/PostsHeader";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import Pagination from "@/components/Pagination";
import { ToolCard } from "@/components/Cards";
import { tools, toolTags } from "@/lib/data";

export const metadata: Metadata = { title: "Tools for creatives – Minimal Gallery" };

export default function ToolsPage() {
  return (
    <>
      <PostsHeader
        title={["Better tools for", "creative work"]}
        subtitle="Discover professional tools for designers, developers and agencies that help you create what you love."
      />
      <Filters tags={toolTags} mode="tools" />
      <PostsGrid className="posts tools">
        {tools.map((t) => (
          <ToolCard key={t.title} post={t} />
        ))}
      </PostsGrid>
      <Pagination base="/tools" last={5} nextLabel="Next" />
    </>
  );
}
