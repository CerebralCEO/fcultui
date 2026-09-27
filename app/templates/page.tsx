import type { Metadata } from "next";
import PostsHeader from "@/components/PostsHeader";
import Filters from "@/components/Filters";
import PostsGrid from "@/components/PostsGrid";
import Pagination from "@/components/Pagination";
import { TemplateCard } from "@/components/Cards";
import { templates, templateTags } from "@/lib/data";

export const metadata: Metadata = { title: "The best website templates – Minimal Gallery" };

export default function TemplatesPage() {
  return (
    <>
      <PostsHeader
        title={["Website templates", "for creatives"]}
        subtitle="Discover professionally designed website templates for Framer, Webflow, WordPress and more."
      />
      <Filters tags={templateTags} mode="templates" showAll={false} />
      <PostsGrid className="posts templates">
        {templates.map((t) => (
          <TemplateCard key={t.title} post={t} />
        ))}
      </PostsGrid>
      <Pagination base="/templates" last={8} nextLabel="Next" />
    </>
  );
}
