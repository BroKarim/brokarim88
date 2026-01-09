import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";
import { workSource } from "@/lib/source";
import { mdxComponents } from "@/components/mdx-components";
import { MediaPreview } from "@/components/media-preview";

export default async function WorkSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = SECTIONS.work.items.find((item) => item.slug === slug);
  if (!project) notFound();

  const page = workSource.getPage([slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const { media } = page.data;

  return (
    <>
      <Sidebar items={SECTIONS.work.items} basePath="/work" />
      <main className="flex-1  px-4 overflow-y-scroll">
        <div className="max-w-xl mx-auto">
          {media && (
            <div className="sticky top-0 z-10 -mx-4 mb-4 bg-transparent ">
              <div className="px-4">
                <MediaPreview src={media} className="rounded-xl shadow-2xl"/>
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
  return SECTIONS.work.items.map((item) => ({ slug: item.slug }));
}
