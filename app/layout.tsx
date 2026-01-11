import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import TVNoise from "@/components/tv-noise";
import { ModeProvider } from "@/context/mode";
import { ModeSwitcher } from "@/components/mode/mode-switcher";
import { ModeWrapper } from "@/components/mode/mode-wrapper";
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
      <body className={` ${geistMono.variable} font-geist-mono antialiased`}>
        <ModeProvider defaultMode="realistic" storageKey="ui-mode">
          <main
            className="min-h-screen text-foreground font-mono flex items-center justify-center p-4 md:p-8"
            style={{
              backgroundImage: "url(/images/background.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <TVNoise opacity={1} intensity={0.2} speed={40} />
            <ModeWrapper>{children}</ModeWrapper>
          </main>
          <ModeSwitcher />
        </ModeProvider>
      </body>
    </html>
  );
}
