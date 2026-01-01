import { redirect } from "next/navigation";
import { SECTIONS } from "@/constant/data";

export default function WorkPage() {
  redirect(`/work/${SECTIONS.work.defaultSlug}`);
}
