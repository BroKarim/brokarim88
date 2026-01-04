import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { mainSource } from "@/lib/source";
import { mdxComponents } from "@/components/mdx-components";
import { SECTIONS } from "@/constant/data";
import TVNoise from "@/components/tv-noise";
export default async function HomePage() {
  const page = mainSource.getPage(["main"]);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <>
      <Sidebar items={SECTIONS.work.items} basePath="/work" />
      <main className="flex-1 overflow-y-auto bg-[#222] p-12 relative custom-scrollbar">
        <div className="max-w-xl mx-auto relative">
        <TVNoise opacity={0.3} intensity={0.2} speed={40} />
          <MDX components={mdxComponents} />
        </div>
      </main>
    </>
  );
}
