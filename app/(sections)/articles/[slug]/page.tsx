import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";

export default async function ArticlesSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = SECTIONS.articles.items.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <Sidebar items={SECTIONS.articles.items} basePath="/articles" />
      <main className="flex-1 overflow-y-auto bg-[#1c1c1c] p-12 custom-scrollbar">
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">{article.content}</div>
      </main>
    </>
  );
}

export async function generateStaticParams() {
  return SECTIONS.articles.items.map((item) => ({ slug: item.slug }));
}
