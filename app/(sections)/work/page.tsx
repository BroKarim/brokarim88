import { redirect } from "next/navigation";
import { SECTIONS } from "@/constant/data";

export const metadata = {
  title: "Work",
  description: "Browse my projects and work.",
};

export default function WorkPage() {
  redirect(`/work/${SECTIONS.work.defaultSlug}`);
}
