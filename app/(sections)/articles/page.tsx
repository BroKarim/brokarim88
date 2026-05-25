import { redirect } from "next/navigation";
import { SECTIONS } from "@/constant/data";

export const metadata = {
  title: "Articles",
  description: "Read my articles and tutorials.",
};

export default function ArticlesPage() {
  redirect(`/articles/${SECTIONS.articles.defaultSlug}`);
}
