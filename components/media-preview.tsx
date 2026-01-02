// components/media-preview.tsx
"use client";

import { cn } from "@/lib/utils";

type MediaPreviewProps = {
  src: string;
  alt?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
};

export function MediaPreview({ src, alt = "", className, autoPlay = true, controls = true }: MediaPreviewProps) {
  const isVideo = src.endsWith(".mp4");
  const isImage = /\.(png|jpe?g|jpg|webp)$/i.test(src);

  return (
    <div className={cn("relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-muted/20", className)}>
      {isVideo && <video src={src} autoPlay={autoPlay} muted loop controls={controls} className="w-full h-full object-cover" />}

      {isImage && <img src={src} alt={alt} className="w-full h-full object-cover" />}
    </div>
  );
}
