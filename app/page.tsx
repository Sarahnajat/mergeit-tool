import NavbarSection from "@/components/NavbarSection";
import { HeroSection } from "@/components/HeroSection";
import { FooterSection } from "@/components/FooterSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import PreviewSection from "@/components/PreviewSection";
import { HeroVisual } from "@/components/HeroVisual";

export const metadata = {
  title: "MergeIt — Subtitle Tools for SRT & ASS",
  description:
    "Split, merge, and convert subtitle files directly in your browser. Fast, simple, and no downloads required.",
  keywords: [
    "MergeIt",
    "subtitle tools",
    "SRT",
    "ASS",
    "split subtitles",
    "merge subtitles",
    "convert subtitles",
    "subtitle editor",
    "subtitle converter",
    "online subtitle tool",
  ],
};

export default function Home() {
  return (
    <>
      <NavbarSection />
      <HeroSection
        title="Merge it, Split it, Convert it"
        description="Professional subtitle management reimagined. Split, merge, and optimize your SRT and ASS files with precision timing and perfect formatting."
        features={[
          "Split SRT and ASS files into multiple parts",
          "Merge multiple SRT and ASS files into one",
          "Convert between SRT and ASS formats",
        ]}
        primaryButton={{ text: "Explore Features", href: "#features" }}
        secondaryButton={{ text: "How It Works", href: "/how-it-works" }}
        visualContent={<HeroVisual />}
      />
      <FeaturesSection />
      <PreviewSection />
      <FooterSection />
    </>
  );
}
