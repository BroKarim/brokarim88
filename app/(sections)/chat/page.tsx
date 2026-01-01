import { Sidebar } from "@/components/sidebar";

export default function ChatPage() {
  return (
    <>
      <Sidebar items={[]} basePath="/chat" />
      <main className="flex-1 overflow-y-auto bg-[#1c1c1c] p-12 custom-scrollbar">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-muted-foreground">Contact content here...</p>
        </div>
      </main>
    </>
  );
}
