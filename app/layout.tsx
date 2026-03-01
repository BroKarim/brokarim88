import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import TVNoise from "@/components/tv-noise";
import { ModeProvider } from "@/context/mode";
import { ModeSwitcher } from "@/components/mode/mode-switcher";
import { ModeWrapper } from "@/components/mode/mode-wrapper";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { BackgroundLoader } from "@/components/background-placeholder";

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
  const BACKGROUND_PLACEHOLDER = "https://res.cloudinary.com/dctl5pihh/image/upload/w_20,q_30,e_blur:200/v1768287477/background_valoru.jpg";
  const BACKGROUND_OPTIMIZED = "https://res.cloudinary.com/dctl5pihh/image/upload/f_auto,q_auto,w_1920/v1768287477/background_valoru.jpg";
  return (
    <html lang="en">
      <body className={` ${geistMono.variable} font-geist-mono antialiased`}>
        <ModeProvider defaultMode="realistic" storageKey="ui-mode">
          <BackgroundLoader placeholder={BACKGROUND_PLACEHOLDER} optimized={BACKGROUND_OPTIMIZED} className="min-h-screen text-foreground font-mono flex flex-col md:flex-row items-center justify-center p-2 md:p-8">
            <TVNoise opacity={1} intensity={0.2} speed={40} />
            <ModeWrapper>{children}</ModeWrapper>
          </BackgroundLoader>
          <ModeSwitcher />
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
