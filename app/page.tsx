import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { mainSource } from "@/lib/source";
import { SECTIONS } from "@/constant/data";
import { ContentWrapper } from "@/components/contents/content-wrapper";

export default async function HomePage() {
  const page = mainSource.getPage(["main"]);

  if (!page) notFound();

  const MDX = page.data.body;
  const { media } = page.data;

  return (
    <>
      <Sidebar items={SECTIONS.work.items} basePath="/work" />
      <ContentWrapper media={media} MDX={MDX} />
    </>
  );
}
