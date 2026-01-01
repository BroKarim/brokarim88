export interface Item {
  id: string;
  slug: string;
  title: string;
  description: string;
  tag?: string;
  content: React.ReactNode; // Hardcoded content
}

export const WORK_PROJECTS: Item[] = [
  {
    id: "1",
    slug: "side-school",
    title: "Side School",
    description: "Educational platform for side hustlers",
    tag: "Live",
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Side School</h1>
        <p className="text-muted-foreground leading-relaxed">
          Side School is an educational platform designed to help aspiring entrepreneurs build and grow their side hustles. The platform combines structured courses with community support.
        </p>
        <h2 className="text-2xl font-semibold text-white mt-8">Key Features</h2>
        <p className="text-muted-foreground leading-relaxed">Interactive lessons, progress tracking, and peer networking make learning practical and engaging.</p>
        <h2 className="text-2xl font-semibold text-white mt-8">Tech Stack</h2>
        <p className="text-muted-foreground leading-relaxed">Built with Next.js, TypeScript, and Tailwind CSS for a modern, fast experience.</p>
      </div>
    ),
  },
  {
    id: "2",
    slug: "konten2",
    title: "Project Two",
    description: "Another amazing project",
    tag: "Draft",
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Project Two</h1>
        <p className="text-muted-foreground leading-relaxed">This is the second project placeholder content.</p>
      </div>
    ),
  },
];

export const ARTICLES: Item[] = [
  {
    id: "1",
    slug: "design",
    title: "Design Systems",
    description: "Building scalable design systems",
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">konten 1 article</h1>
        <p className="text-muted-foreground leading-relaxed">Building a design system requires careful planning and execution. This article explores the fundamentals of creating scalable design systems that grow with your product.</p>
        <h2 className="text-2xl font-semibold text-white mt-8">Why Design Systems Matter</h2>
        <p className="text-muted-foreground leading-relaxed">Consistency, efficiency, and collaboration are the core benefits of implementing a robust design system in your organization.</p>
      </div>
    ),
  },
  {
    id: "2",
    slug: "development",
    title: "Modern Development",
    description: "Best practices in web development",
    content: (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Modern Development</h1>
        <p className="text-muted-foreground leading-relaxed">Article 2 placeholder content.</p>
      </div>
    ),
  },
];

export const SECTIONS = {
  work: { path: "/work", defaultSlug: "side-school", items: WORK_PROJECTS },
  articles: { path: "/articles", defaultSlug: "design", items: ARTICLES },
} as const;
