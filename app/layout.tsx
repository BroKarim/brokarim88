import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import SuminagashiBackground from "@/components/suminagashi-background";
import { ModeProvider } from "@/context/mode";
import { ModeSwitcher } from "@/components/mode/mode-switcher";
import { ModeWrapper } from "@/components/mode/mode-wrapper";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Next.js", "React", "Tailwind CSS", "Frontend Developer", "Portfolio"],
  authors: [{ name: "Brokarim" }],
  creator: "Brokarim",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@brokarim",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${geistMono.variable} font-geist-mono root antialiased`}>
        <ModeProvider defaultMode="realistic" storageKey="ui-mode">
          <SuminagashiBackground />
          <div className="pointer-events-none relative z-10 min-h-screen text-foreground font-mono flex flex-col md:flex-row items-center justify-center p-2 md:p-8">
            <div className="pointer-events-auto"><ModeWrapper>{children}</ModeWrapper></div>
          </div>
          <ModeSwitcher />
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
