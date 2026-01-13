import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunshareenergy.ph"),
  title: {
    default: "SunShare Philippines | Smarter, Cheaper, Cleaner Energy",
    template: "%s | SunShare Philippines",
  },
  description:
    "SunShare Philippines helps Filipino communities and businesses access affordable, reliable, and sustainable clean energy through demand aggregation, rooftop solar, and battery storage solutions.",
  keywords: [
    "solar energy",
    "Philippines",
    "retail electricity supplier",
    "clean energy",
    "rooftop solar",
    "energy savings",
    "renewable energy",
    "SunShare",
  ],
  authors: [{ name: "SunShare Philippines Inc." }],
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "https://sunshareenergy.ph",
    siteName: "SunShare Philippines",
    title: "SunShare Philippines | Smarter, Cheaper, Cleaner Energy",
    description:
      "Powering Filipinos with smarter, cheaper, and cleaner energy.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SunShare Philippines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SunShare Philippines",
    description:
      "Powering Filipinos with smarter, cheaper, and cleaner energy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
