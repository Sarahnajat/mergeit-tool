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
   description="Professional subtitle management reimagined. Split, merge, and optimize your SRT files with precision timing and perfect formatting."
   features={["Split SRT files into multiple parts", "Merge multiple SRT files into one", "Convert SRT files to different Formats"]}
    primaryButton={{
      text: "Get Started",
      href: "/",
    
    }}
    secondaryButton={{
      text: "Upload SRT File",
      href: "/",
    
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
