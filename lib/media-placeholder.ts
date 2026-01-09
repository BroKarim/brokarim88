import rawMetadata from "@/constant/placeholders/metadata.json";

type MediaMeta = {
  type: "image" | "video";
  placeholder: string;
  hash?: string;
};

const metadata = rawMetadata as Record<string, MediaMeta>;

export function getMediaPlaceholder(src: string): string | null {
  const key = src.split("?")[0];
  return metadata[key]?.placeholder ?? null;
}
