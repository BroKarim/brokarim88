"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Item } from "@/constant/data";

interface SidebarProps {
  items: Item[];
  basePath: string;
}

export function Sidebar({ items, basePath }: SidebarProps) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").pop();

  return (
    <aside className="w-[450px] border-r border-white/5 flex flex-col h-full bg-[#161616]">
      {/* Profile Header */}
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
            <Link href="/work" className={cn("px-4 py-1.5 text-xs font-medium rounded-full transition-colors", pathname.startsWith("/work") ? "bg-[#333] text-white shadow-sm" : "text-muted-foreground hover:text-white")}>
              Work
            </Link>
            <Link href="/articles" className={cn("px-4 py-1.5 text-xs font-medium rounded-full transition-colors", pathname.startsWith("/articles") ? "bg-[#333] text-white shadow-sm" : "text-muted-foreground hover:text-white")}>
              Articles
            </Link>
            <Link href="/chat" className={cn("px-4 py-1.5 text-xs font-medium rounded-full transition-colors", pathname.startsWith("/chat") ? "bg-[#333] text-white shadow-sm" : "text-muted-foreground hover:text-white")}>
              Contact
            </Link>
          </div>
          <button className="p-1.5 text-muted-foreground hover:text-white transition-colors">
            <Search size={14} strokeWidth={2} />
          </button>
        </nav>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1 custom-scrollbar">
        {items.map((item) => (
          <Link key={item.id} href={`${basePath}/${item.slug}`} className={cn("w-full text-left p-4 rounded-2xl transition-all duration-300 group relative block", currentSlug === item.slug ? "bg-[#252525] shadow-lg" : "hover:bg-white/5")}>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className={cn("font-medium text-[13px] transition-colors", currentSlug === item.slug ? "text-white" : "text-white/80 group-hover:text-white")}>{item.title}</h3>
              {item.tag && <span className={cn("text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full", item.tag === "Live" ? "text-emerald-400 bg-emerald-500/10" : "text-white/40 bg-white/5")}>{item.tag}</span>}
            </div>
            <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed font-light">{item.description}</p>
          </Link>
        ))}
      </div>
    </aside>
  );
}
