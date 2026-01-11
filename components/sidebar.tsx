"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Item } from "@/constant/data";
import { useMode } from "@/context/mode";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarProps {
  items: Item[];
  basePath: string;
}

export function Sidebar({ items, basePath }: SidebarProps) {
  const pathname = usePathname();
  const { mode } = useMode();
  const currentSlug = pathname.split("/").pop();

  const activeTab = pathname.startsWith("/articles") ? "articles" : pathname.startsWith("/contact") ? "chat" : "work";

  const commonClasses =
    "shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.30)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.30)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_-8px_16px_-1px_rgba(0,0,0,0.16)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] ";

  const sidebarClasses = mode === "glassy" ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-[#161616]";

  return (
    <aside className={cn(commonClasses, "w-[450px] border-r flex flex-col h-full rounded-2xl", sidebarClasses)}>
      {/* Profile Header */}
      <div className="p-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 border border-white/10 bg-muted/20">
            <AvatarImage src="https://res.cloudinary.com/dctl5pihh/image/upload/v1768099687/brokarim-orange_zcfnek.png" alt="Ben Issen" />
            <AvatarFallback>DZ</AvatarFallback>
          </Avatar>

          <div className="space-y-0.5">
            <h2 className="font-semibold text-sm tracking-tight text-white">Brokarim</h2>
            <p className="text-[11px]">I design and build tools people love</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between rounded-full py-1 px-2 transition-all duration-700" style={{ backgroundColor: "var(--sidebar-tab-bg)", backdropFilter: "blur(8px)" }}>
          {/* <div className={cn("flex items-center justify-between rounded-full py-1 px-2", mode === "glassy" ? "bg-white/10 backdrop-blur-sm" : "bg-[#222]")}> */}
          <Tabs value={activeTab} className="w-full">
            <TabsList className={cn(commonClasses, "h-10 rounded-[99px] gap-1 w-full justify-center items-center inline-flex overflow-hidden", mode === "glassy" ? "bg-white/20" : "bg-[#131316]")}>
              <TabsTrigger value="work" asChild className="rounded-full w-full data-[state=active]:bg-[#7c5aff] data-[state=active]:shadow-[inset_0_1px_rgb(255_255_255/0.15)] transition-all">
                <Link href="/work" className="px-4 py-1.5 text-xs font-medium ">
                  Work
                </Link>
              </TabsTrigger>

              <TabsTrigger value="articles" asChild className="rounded-full w-full data-[state=active]:bg-[#7c5aff] data-[state=active]:shadow-[inset_0_1px_rgb(255_255_255/0.15)] transition-all">
                <Link href="/articles" className="px-4 py-1.5 text-xs font-medium ">
                  Articles
                </Link>
              </TabsTrigger>

              <TabsTrigger value="chat" asChild className="rounded-full w-full data-[state=active]:bg-[#7c5aff] data-[state=active]:shadow-[inset_0_1px_rgb(255_255_255/0.15)] transition-all">
                <Link href="/contact" className="px-4 py-1.5 text-xs font-medium ">
                  Contact
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 font-mono space-y-1 custom-scrollbar">
        {items.map((item) => {
          const isActive = basePath === "/contact" ? item.id === items[0]?.id : currentSlug === item.slug;

          return (
            <Link
              key={item.id}
              href={item.href ?? `${basePath}/${item.slug}`}
              target={item.href ? "_blank" : undefined}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all duration-300 group relative block",
                isActive
                  ? mode === "glassy"
                    ? "bg-white/20 shadow-lg backdrop-blur-sm"
                    : "bg-[#252525] shadow-[inset_0_1px_rgb(255_255_255/0.15)]"
                  : mode === "glassy"
                  ? "hover:bg-white/10 hover:backdrop-blur-sm"
                  : "hover:bg-white/5 hover:shadow-[inset_0_1px_rgb(255_255_255/0.15)]"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className={cn("font-medium text-[13px] transition-colors", currentSlug === item.slug ? "text-white" : "text-white/80 group-hover:text-white")}>{item.title}</h3>
                {item.tag && <span className={cn("text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full", item.tag === "Live" ? "text-emerald-400 bg-emerald-500/10" : "text-white/40 bg-white/5")}>{item.tag}</span>}
              </div>
              <p className="text-[12px] text-foreground line-clamp-2 leading-relaxed font-light">{item.description}</p>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
