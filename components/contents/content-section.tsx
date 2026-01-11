"use client";
import { useMode } from "@/context/mode";
import TVNoise from "@/components/tv-noise";
import { MediaPreview } from "@/components/media-preview";
import { GlassEffect } from "@/components/glass-effect";
interface ContentProps {
  media?: string;
  MDXContent: React.ReactNode;
}

export function Content({ media, MDXContent }: ContentProps) {
  const { mode } = useMode();

  const Wrapper = mode === "glassy" ? GlassEffect : "div";
  const wrapperProps = mode === "glassy" ? { className: "flex-1 overflow-y-auto px-4 relative custom-scrollbar bg-transparent" } : { className: "flex-1 overflow-y-auto px-4 relative custom-scrollbar bg-[#222]" };

  return (
    <Wrapper {...wrapperProps}>
      <div className="max-w-xl mx-auto ">
        {media && (
          <div className="sticky top-0 z-10 -mx-4 mb-4 bg-transparent">
            <div className="px-4">
              <MediaPreview src={media} className="rounded-xl shadow-2xl" />
            </div>
          </div>
        )}
        <TVNoise opacity={0.3} intensity={0.2} speed={40} />
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">{MDXContent}</article>
      </div>
    </Wrapper>
  );
}
