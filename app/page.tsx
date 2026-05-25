import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";
import { ContentWrapper } from "@/components/contents/content-wrapper";

export const metadata = {
  title: "Brokarim",
  description: "Portfolio of Brokarim — explore my projects, articles, and get in touch.",
};

export default async function HomePage() {
  return (
    <>
      <div className="md:block hidden">
        <Sidebar items={SECTIONS.work.items} basePath="/work" />
      </div>
      <ContentWrapper />

    </>
  );
}
