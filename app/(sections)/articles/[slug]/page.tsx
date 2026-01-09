import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";
import { articlesSource } from "@/lib/source";
import { mdxComponents } from "@/components/mdx-components";
import { MediaPreview } from "@/components/media-preview";

export default async function ArticlesSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = SECTIONS.articles.items.find((item) => item.slug === slug);
  if (!project) notFound();

  const page = articlesSource.getPage([slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const { media } = page.data;

  return (
    <>
      <Sidebar items={SECTIONS.articles.items} basePath="/articles" />
      <main className="flex-1  px-4 overflow-y-scroll">
        <div className="max-w-xl mx-auto">
          {media && (
            <div className="sticky top-0 z-10 -mx-4 mb-4 bg-transparent ">
              <div className="px-4">
                <MediaPreview src={media} className="rounded-xl shadow-2xl" />
              </div>
            </div>
          )}
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <MDX components={mdxComponents} />
          </article>
        </div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  return SECTIONS.articles.items.map((item) => ({ slug: item.slug }));
}
