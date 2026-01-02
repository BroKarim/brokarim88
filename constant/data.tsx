export interface Item {
  id: string;
  slug: string;
  title: string;
  description: string;
  tag?: string;
}

export const WORK_PROJECTS: Item[] = [
  {
    id: "1",
    slug: "side-school",
    title: "Side School",
    description: "Educational platform for side hustlers",
    tag: "Live",
  },
  {
    id: "2",
    slug: "konten2",
    title: "Project Two",
    description: "Another amazing project",
    tag: "Draft",
  },
];

export const ARTICLES: Item[] = [
  {
    id: "1",
    slug: "design",
    title: "Design Systems",
    description: "Building scalable design systems",
  },
  {
    id: "2",
    slug: "development",
    title: "Modern Development",
    description: "Best practices in web development",
  },
];

export const SECTIONS = {
  work: { path: "/work", defaultSlug: "side-school", items: WORK_PROJECTS },
  ideas: { path: "/ideas", defaultSlug: "design", items: ARTICLES },
} as const;
