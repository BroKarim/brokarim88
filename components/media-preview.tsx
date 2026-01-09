import { cn } from "@/lib/utils";
import { getMediaPlaceholder } from "@/lib/media-placeholder";

type MediaPreviewProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function MediaPreview({ src, alt = "", className }: MediaPreviewProps) {
  const isVideo = /\.(mp4|mov)$/i.test(src);
  const isImage = /\.(png|jpe?g|jpg|webp)$/i.test(src);
  const placeholder = getMediaPlaceholder(src);

  return (
    <div
      className={cn("relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-muted/20", className)}
      style={
        placeholder
          ? {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {isVideo && (
        <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover pointer-events-none">
          <source src={src} type="video/mp4" />
          <source src={src} type="video/quicktime" />
        </video>
      )}
      {isImage && <img src={src} alt={alt} className="w-full h-full object-cover" />}

      {isVideo && !placeholder && <div className="absolute inset-0 animate-pulse bg-muted/40" />}
    </div>
  );
}
