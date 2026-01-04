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
    slug: "21oss",
    title: "21OSS",
    description: "An open-source catalog that actually ships. A curated hub of templates, components, tools, and assets to help developers and creators move from idea to production—without noise or fluff.",
    tag: "Live",
  },
  {
    id: "2",
    slug: "zonapetik",
    title: "ZonaPetik",
    description:
      "A data-driven, climate-based planting calendar built for my undergraduate thesis. It integrates historical and forecast data from BMKG and NASA using the Holt-Winters method to determine optimal planting periods and planting risk through an interactive web app.",
    tag: "Research",
  },
  {
    id: "3",
    slug: "og-table",
    title: "OG Table",
    description: "A simple design tool for creating beautiful presentation tables. Customize themes, backgrounds, borders, corners, and export high-resolution images when you’re done.",
    tag: "Tool",
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
