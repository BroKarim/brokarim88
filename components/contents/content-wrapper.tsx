// components/main-page-wrapper.tsx (Server Component - NO "use client")
import { Content } from "./content-section";

interface ContentWrapperProps {
  media?: string;
  MDX: React.ComponentType<any>;
}

export function ContentWrapper({ media, MDX }: ContentWrapperProps) {
  return <Content media={media} MDXContent={<MDX components={{}} />} />;
}
