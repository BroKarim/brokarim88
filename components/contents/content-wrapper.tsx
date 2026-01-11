// components/main-page-wrapper.tsx (Server Component - NO "use client")
import { Content } from "./content-section";
import { mdxComponents } from "@/components/mdx-components";
import { notFound } from "next/navigation";
import { mainSource } from "@/lib/source";

export function ContentWrapper() {
  const page = mainSource.getPage(["main"]);
  if (!page) notFound();

  const MDX = page.data.body;
  const { media } = page.data;

  return <Content media={media} MDXContent={<MDX components={mdxComponents} />} />;
}
