import type { Metadata } from "next";
import PostsHeader from "@/components/PostsHeader";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import Pagination from "@/components/Pagination";
import { ToolCard } from "@/components/ToolCard";
import { site } from "@/lib/site";
import { tools, toolTags } from "@/lib/data";

export const metadata: Metadata = { title: `Tools for mobile developers – ${site.name}` };

export default function ToolsPage() {
  return (
    <>
      <PostsHeader
        title={["Better tools for", "creative work"]}
        subtitle="Hand-picked tools for Flutter and React Native designers and developers that help you ship what you love."
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
