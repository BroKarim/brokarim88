import { redirect } from "next/navigation";
import { SECTIONS } from "@/constant/data";

export default function ArticlesPage() {
  redirect(`/articles/${SECTIONS.articles.defaultSlug}`);
}
