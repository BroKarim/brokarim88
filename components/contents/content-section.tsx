"use client";


import { MediaPreview } from "@/components/media-preview";
interface ContentProps {
  media?: string;
  MDXContent: React.ReactNode;
}

export function Content({ media, MDXContent }: ContentProps) {

  return (
    <main className="flex-1 px-4 overflow-y-scroll h-screen md:h-auto">
      <div className="max-w-xl mx-auto">
        {media && (
          <div className="sticky top-0 z-10 -mx-4 mb-4 bg-transparent">
            <div className="px-4">
              <MediaPreview src={media} className="rounded-xl shadow-2xl" />
            </div>
          </div>
        )}
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          {MDXContent}
        </article>
      </div>
    </main>
  );
}
