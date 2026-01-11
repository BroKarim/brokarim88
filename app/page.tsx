
import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";
import { ContentWrapper } from "@/components/contents/content-wrapper";

export default async function HomePage() {
  return (
    <>
      <Sidebar items={SECTIONS.work.items} basePath="/work" />
      <ContentWrapper />
    </>
  );
}
