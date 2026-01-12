export interface Item {
  id: string;
  slug: string;
  title: string;
  description: string;
  tag?: string;
  href?: string;
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
    slug: "ogtable",
    title: "OG Table",
    description: "A simple design tool for creating beautiful presentation tables. Customize themes, backgrounds, borders, corners, and export high-resolution images when you’re done.",
    tag: "Tool",
  },
  {
    id: "4",
    slug: "github",
    title: "Side Quests",
    description:
      "A collection of experiments, cloned repos, UI explorations, and half-serious ideas that shaped my programming journey.",
    tag: "Side Quest",
  },
];


export const ARTICLES: Item[] = [
  {
    id: "1",
    slug: "blurry-placeholders",
    title: "How to Generate Blurry Placeholders for Cloud Images (Automatically)",
    description: "Building an automated pipeline for instant visual feedback using tiny blurred placeholders.",
  },
];

export const CONTACT_ITEMS: Item[] = [
  {
    id: "chat",
    slug: "",
    title: "BrokarimGPT",
    description: "Chat directly with my personal AI assistant.",
  },
  {
    id: "twitter",
    slug: "",
    title: "Twitter / X",
    description: "Thoughts, updates, and random experiments.",
    href: "https://x.com/yourhandle",
  },
  {
    id: "threads",
    slug: "",
    title: "Threads",
    description: "Casual posts and side ideas.",
    href: "https://threads.net/@yourhandle",
  },
  {
    id: "email",
    slug: "",
    title: "Email",
    description: "Reach me directly for collaborations or work.",
    href: "mailto:you@email.com",
  },
];


export const SECTIONS = {
  work: { path: "/work", defaultSlug: "21oss", items: WORK_PROJECTS },
  articles: { path: "/articles", defaultSlug: "blurry-placeholders", items: ARTICLES },
  contact: { path: "/contact", defaultSlug: "", items: CONTACT_ITEMS },
} as const;
