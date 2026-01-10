"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Item } from "@/constant/data";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SidebarProps {
  items: Item[];
  basePath: string;
}

export function Sidebar({ items, basePath }: SidebarProps) {
  const pathname = usePathname();
  const currentSlug = pathname.split("/").pop();
  const isContact = basePath === "/contact";

  const activeTab = pathname.startsWith("/articles") ? "articles" : pathname.startsWith("/contact") ? "chat" : "work";

  const commonClasses =
    "shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.30)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.30)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_-8px_16px_-1px_rgba(0,0,0,0.16)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] ";

  return (
    <aside className={cn(commonClasses, "w-[450px] border-r  flex flex-col h-full bg-[#161616] rounded-2xl ")}>
      {/* Profile Header */}
      <div className="p-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 border border-white/10 bg-muted/20">
            <AvatarImage src="https://github.com/BroKarim.png" alt="Ben Issen" />
            <AvatarFallback>DZ</AvatarFallback>
          </Avatar>

          <div className="space-y-0.5">
            <h2 className="font-semibold text-sm tracking-tight text-white">Brokarim</h2>
            <p className="text-[11px]">I design and build tools people love</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
          <Info size={18} strokeWidth={1.5} />
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between bg-[#222]  rounded-full py-1 px-2">
          <Tabs value={activeTab} className="w-full">
            <TabsList className={cn(commonClasses, "h-10 bg-[#131316] rounded-[99px] gap-1 w-full justify-center items-center inline-flex overflow-hidden")}>
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
                isActive ? "bg-[#252525] shadow-lg shadow-[inset_0_1px_rgb(255_255_255/0.15)]" : "hover:bg-white/5 hover:shadow-[inset_0_1px_rgb(255_255_255/0.15)]"
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
