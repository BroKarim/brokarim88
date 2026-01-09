import { cn } from "@/lib/utils";

type MediaPreviewProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function MediaPreview({ src, alt = "", className }: MediaPreviewProps) {
  const isVideo = /\.(mp4|mov)$/i.test(src);
  const isImage = /\.(png|jpe?g|jpg|webp)$/i.test(src);

  return (
    <div className={cn("relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-muted/20", className)}>
      {isVideo && (
        <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover pointer-events-none">
          <source src={src} type="video/mp4" />
          <source src={src} type="video/quicktime" /> {/* untuk .mov */}
        </video>
      )}
      {isImage && <img src={src} alt={alt} className="w-full h-full object-cover" />}

      {isVideo && <div className="absolute inset-0 animate-pulse bg-muted/40" />}
    </div>
  );
}
