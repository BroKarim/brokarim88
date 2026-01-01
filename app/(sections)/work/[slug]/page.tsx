import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";

export default async function WorkSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = SECTIONS.work.items.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <>
      <Sidebar items={SECTIONS.work.items} basePath="/work" />
      <main className="flex-1 overflow-y-auto bg-[#1c1c1c] p-12 custom-scrollbar">
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">{project.content}</div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  return SECTIONS.work.items.map((item) => ({ slug: item.slug }));
}
