
import NavbarSection from "@/components/NavbarSection";
import { FooterSection } from "@/components/FooterSection";
import { UsageGuide } from "@/components/UsageGuide";
import CtaSection from "@/components/CtaSection"
export const metadata = { 
  title: "How It Works — MergeIt Subtitle Tools",
  description:
    "Learn how MergeIt helps you split, merge, and convert SRT and ASS subtitle files directly in your browser. A simple guide to get started.",
  keywords: [
    "MergeIt",
    "subtitle tools",
    "SRT",
    "ASS",
    "split subtitles",
    "merge subtitles",
    "convert subtitles",
    "how it works",
  ],
  openGraph: {
    title: "How It Works — MergeIt Subtitle Tools",
    description:
      "Step-by-step guide showing how to split, merge, and convert subtitle files with MergeIt.",
    url: "https://yourdomain.com/how-it-works",
    siteName: "MergeIt",
    images: [
      {
        url: "https://mergeittool.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "MergeIt Subtitle Tools Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works — MergeIt Subtitle Tools",
    description:
      "Discover how MergeIt works with subtitle files: split, merge, and convert SRT & ASS formats.",
    images: ["https://mergeittool.vercel.app/og-image.png"],
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <NavbarSection />
      <UsageGuide />
      <CtaSection />
      <FooterSection />
    </>
  );
}
