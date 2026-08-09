"use client";

import {
  SplitSquareHorizontal,
  Merge,
  ArrowRightLeft,
  LockKeyhole,
  FilePenLine,
  ArrowRight,
  FileHeart,
} from "lucide-react";
import { MotionDiv } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NavbarSection from "@/components/NavbarSection";
import { FooterSection } from "@/components/FooterSection";
import Link from "next/link";

const features = [
  {
    icon: SplitSquareHorizontal,
    title: "Split with precision",
    description:
      "Divide subtitle files by duration, line count, or evenly across multiple files.",
  },
  {
    icon: Merge,
    title: "Merge without cleanup",
    description:
      "Combine translated subtitle parts back together while keeping original order and timing.",
  },
  {
    icon: ArrowRightLeft,
    title: "Convert with ease",
    description:
      "Switch seamlessly between SRT and ASS formats with no formatting loss.",
  },
  {
    icon: LockKeyhole,
    title: "Private by default",
    description:
      "Your files never leave your browser. Zero server uploads, completely local.",
  },
];

export default function AboutPage() {
  return (
    <>
      <NavbarSection />
      <main className="min-h-screen bg-background py-20 px-6 font-dmSans">
        <div
          id="about"
          className="max-w-4xl mx-auto space-y-20 relative z-10 scroll-mt-28"
        >
          {/* HEADER SECTION */}
          <section className="text-center space-y-6 max-w-2xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge
                variant="secondary"
                className="px-3.5 py-1 text-xs font-mono font-bold tracking-widest bg-primary/10 border border-primary/20 text-primary rounded-full mb-4 inline-flex items-center gap-1.5"
              >
                <FilePenLine className="size-3.5" />
                BUILT FOR SUBTITLE WORK
              </Badge>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight mb-4">
                Subtitles,{" "}
                <span className="text-primary">done in seconds.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                MergeIt gives editors, translators, and creators simple,
                lightning-fast tools for splitting, merging, and converting
                subtitle files directly in the browser.
              </p>
            </MotionDiv>
          </section>

          {/* FEATURES GRID */}
          <section>
            <div className="grid md:grid-cols-2 gap-5">
              {features.map((feature, idx) => (
                <MotionDiv
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="
                    bg-card
                    border border-border
                    rounded-2xl
                    p-6
                    transition-all duration-200
                    hover:border-primary/40
                    hover:shadow-sm
                  "
                >
                  <div className="size-10 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-4">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </MotionDiv>
              ))}
            </div>
          </section>

          
          <section className="space-y-8 text-center pt-4">
            {/* Header text above card */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto space-y-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Fix subtitles fast. Use{" "}
                <span className="text-primary">MergeIt.</span>
              </h2>

              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                Manual line splitting and file merging waste hours. MergeIt was
                built so Content creators and translators can handle SRT files
                in seconds.
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border border-border/80 rounded-[2.5rem] p-8 sm:p-12 md:p-14 text-center max-w-3xl mx-auto shadow-xl relative overflow-hidden"
            >
             
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 size-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-6 relative z-10">
                <FileHeart className="size-3.5" />
                <span>100% FREE & LOCAL</span>
              </div>

              {/* Main Card Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 relative z-10">
                One tool. All your subtitle needs.
              </h3>

              <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed relative z-10">
                Trusted by creators who need fast, reliable SRT handling—clean,
                convert, and manage subtitles directly in your browser.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/#features">
  <Button
    size="lg"
    className="rounded-full px-7 py-3 h-12 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer inline-flex items-center gap-2"
  >
    Start Our Tools now
    <ArrowRight className="size-4" />
  </Button>
</Link>

                <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                  Instant access • No account needed
                </span>
              </div>
            </MotionDiv>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
