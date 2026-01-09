import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { mainSource } from "@/lib/source";
import { mdxComponents } from "@/components/mdx-components";
import { SECTIONS } from "@/constant/data";
import TVNoise from "@/components/tv-noise";
import { MediaPreview } from "@/components/media-preview";


export default async function HomePage() {
  const page = mainSource.getPage(["main"]);

  if (!page) notFound();

  const MDX = page.data.body;
   const { media } = page.data;

  return (
    <>
      <Sidebar items={SECTIONS.work.items} basePath="/work" />
      <main className="flex-1 overflow-y-auto bg-[#222] px-4  relative custom-scrollbar">
        <div className="max-w-xl mx-auto relative">
          {media && (
            <div className="sticky top-0 z-10 -mx-4 mb-4 bg-transparent ">
              <div className="px-4">
                <MediaPreview src={media} className="rounded-xl shadow-2xl" />
              </div>
            </div>
          )}
          <TVNoise opacity={0.3} intensity={0.2} speed={40} />
          <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <MDX components={mdxComponents} />
          </article>
        </div>
      </main>
    </>
  );
}
