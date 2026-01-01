"use client";

import { useState } from "react";
import { Search, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    id: "side-school",
    title: "Side School",
    tag: "Live",
    description: "Platform teaching professionals to adopt AI. Bootstrapped to thousands of students in 2024.",
    fullContent: (
      <div className="space-y-8">
        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-muted/20">
          <img src="/images/side-school-hero.png" alt="Side School Concept" className="object-cover w-full h-full" />
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold tracking-tight">Side School</h1>
            <div className="h-[2px] w-12 bg-muted-foreground/30" />
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Side School is a school I started with <span className="text-foreground font-medium">Zineb Salamat</span> in 2024. Our bootstrapped team of 5 is based in Paris.
            </p>
            <p>We organize 1-month online bootcamps for french marketers to discover and adopt the best generative AI tools. Tools like Krea, Gamma, ChatGPT, V7 Go, Claude, Lindy.</p>
            <p>
              How does one understand tokens, LLMs, context windows and fine-tuning? Making complex topics simple to grasp with practice is a challenge I love to work on. Weve trained thousands of French employees. Our bootcamp price is
              $1900.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "supercreative",
    title: "Supercreative",
    tag: "Acquired",
    description: "Product studio building business apps for 50k+ freelancers. Started in 2020, acquired in 2023.",
  },
  {
    id: "instaprice",
    title: "Instaprice",
    tag: "Live",
    description: "Pricing calculator for freelancers. Designed and built in 2022. Still running.",
  },
  {
    id: "people-to-notion",
    title: "People to Notion",
    tag: "Acquired",
    description: "Chrome extension to save LinkedIn profiles to Notion CRMs in a click. Designed in 2022.",
  },
  {
    id: "notion-pack",
    title: "Notion Pack",
    tag: "Acquired",
    description: "All the freelancers docs you need, as Notion templates. Used by 10k+ freelancers.",
  },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState("side-school");
  const activeProject = PROJECTS.find((p) => p.id === selectedId) || PROJECTS[0];

  return (
    <>
      <aside className="w-[450px] border-r border-white/5 flex flex-col h-full bg-[#161616]">
        {/* header */}
        <div className="p-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-muted/20 border border-white/10">
              <img src="/abstract-profile.png" alt="Ben Issen" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-0.5">
              <h2 className="font-semibold text-sm tracking-tight text-white">Ben Issen</h2>
              <p className="text-muted-foreground text-[11px]">I design and build tools people love</p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-white transition-colors">
            <Info size={18} strokeWidth={1.5} />
          </button>
        </div>
        {/* Navigation Tabs */}
        <div className="px-8 pb-6">
          <nav className="flex items-center p-1 bg-[#222] rounded-full w-full justify-between">
            <div className="flex gap-1">
              <button className="px-4 py-1.5 text-xs font-medium rounded-full bg-[#333] text-white shadow-sm">Work</button>
              <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-white transition-colors">Articles</button>
              <button className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-white transition-colors">Contact</button>
            </div>
            <button className="p-1.5 text-muted-foreground hover:text-white transition-colors">
              <Search size={14} strokeWidth={2} />
            </button>
          </nav>
        </div>

        {/* Project Scroll List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1 custom-scrollbar">
          {PROJECTS.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              className={cn("w-full text-left p-4 rounded-2xl transition-all duration-300 group relative", selectedId === project.id ? "bg-[#252525] shadow-lg" : "hover:bg-white/5")}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className={cn("font-medium text-[13px] transition-colors", selectedId === project.id ? "text-white" : "text-white/80 group-hover:text-white")}>{project.title}</h3>
                <span className={cn("text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full", project.tag === "Live" ? "text-emerald-400 bg-emerald-500/10" : "text-white/40 bg-white/5")}>{project.tag}</span>
              </div>
              <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed font-light">{project.description}</p>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#1c1c1c] p-12 custom-scrollbar">
        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeProject.fullContent || (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                <ExternalLink size={28} className="text-muted-foreground/50" strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white">{activeProject.title}</h2>
                <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">This project showcase is currently being drafted. Check back soon for the full story.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
