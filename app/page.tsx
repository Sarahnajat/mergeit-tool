"use client"


import { HeroSection } from "@/components/HeroSection";
import NavbarSection from "@/components/NavbarSection";
import { FooterSection } from "@/components/FooterSection"; 
import { FeaturesSection } from "@/components/FeaturesSection";

import PreviewSection from "@/components/PreviewSection";
import {CtaSection} from "@/components/CtaSection"
import { UsageGuide } from "@/components/UsageGuide";
import { HeroVisual } from "@/components/HeroVisual";
export default function Home() {
  return (
   <>
   <NavbarSection />
   <HeroSection 
   title="Merge it, Split it, Convert it"
   description="Professional subtitle management reimagined. Split, merge, and optimize your SRT and ASS files with precision timing and perfect formatting."
   features={["Split SRT and ASS files into multiple parts", "Merge multiple SRT and ASS files into one", "Convert between SRT and ASS formats"]}
   primaryButton={{
    text: "Explore Features",
    href: "#features",
  }}
  secondaryButton={{
    text: "How It Works",
    href: "#usage-guide",
  }}
    visualContent={<HeroVisual />}
    />
    <UsageGuide />
    <FeaturesSection />
 
     <PreviewSection />
   <CtaSection />
   <FooterSection />

 </>
  );
}
