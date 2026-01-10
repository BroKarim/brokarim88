import { Sidebar } from "@/components/sidebar";
import { SECTIONS } from "@/constant/data";
import { Chat } from "@/components/chat";
export default function ContactPage() {
  return (
    <>
      <Sidebar items={SECTIONS.contact.items} basePath="/contact" />
      <main className="flex-1 px-4 overflow-y-scroll">
        <div className="max-w-xl mx-auto">
          <Chat />
        </div>
      </main>
    </>
  );
}
