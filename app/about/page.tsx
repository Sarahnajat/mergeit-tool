"use client";

import {
  SplitSquareHorizontal,
  Merge,
  ArrowRightLeft,
  LockKeyhole,
  FilePenLine,
  ArrowRight,
  FileHeart,
  FileText,
  Sparkles,
} from "lucide-react";
import { MotionDiv } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NavbarSection from "@/components/NavbarSection";
import { FooterSection } from "@/components/FooterSection";
import Link from "next/link";

const badgeClassName =
  "inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium tracking-wide bg-primary/10 border border-primary/20 text-primary rounded-full";

const features = [
  {
    icon: SplitSquareHorizontal,
    eyebrow: "Split",
    title: "Split with precision",
    description:
      "Divide subtitle files by duration, line count, or evenly across multiple files.",
  },
  {
    icon: Merge,
    eyebrow: "Merge",
    title: "Merge without cleanup",
    description:
      "Combine translated subtitle parts back together while keeping original order and timing.",
  },
  {
    icon: ArrowRightLeft,
    eyebrow: "Convert",
    title: "Convert with ease",
    description:
      "Switch seamlessly between SRT and ASS formats with no formatting loss.",
  },
  {
    icon: LockKeyhole,
    eyebrow: "Privacy",
    title: "Private by default",
    description:
      "Your files never leave your browser. Zero server uploads, completely local.",
  },
];

export default function AboutPage() {
  return (
    <>
      <NavbarSection />
      <main className="relative min-h-screen overflow-hidden bg-background px-6 py-20 font-dmSans">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-30 mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

        <div
          id="about"
          className="relative z-10 mx-auto max-w-5xl space-y-24 scroll-mt-28 sm:space-y-28"
        >
          <section className="mx-auto max-w-2xl space-y-6 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Badge variant="secondary" className={`${badgeClassName} mb-4`}>
                <FilePenLine className="size-3.5" aria-hidden="true" />
                Built for subtitle work
              </Badge>

              <h1 className="mb-4 text-4xl font-black leading-tight tracking-tighter text-foreground sm:text-5xl md:text-6xl">
                Subtitles,{" "}
                <span className="text-primary">done in seconds.</span>
              </h1>

              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                MergeIt gives editors, translators, and creators simple,
                lightning-fast tools for splitting, merging, and converting
                subtitle files directly in the browser.
              </p>
            </MotionDiv>
          </section>

          <section className="space-y-8">
           

            <div className="grid gap-5 md:grid-cols-2">
              {features.map((feature, idx) => (
                <MotionDiv
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 transition-colors group-hover:border-primary/30">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-primary">
                    {feature.eyebrow}
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </MotionDiv>
              ))}
            </div>
          </section>

          <section className="space-y-12 pt-4 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-2xl space-y-4"
            >
              <Badge variant="secondary" className={`${badgeClassName} mb-3`}>
                <FilePenLine className="size-3.5" aria-hidden="true" />
                Get started now
              </Badge>

              <h2 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                Fix subtitles fast. Use{" "}
                <span className="text-primary">MergeIt.</span>
              </h2>

              <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Manual line splitting and file merging waste hours. MergeIt was
                built so content creators and translators can handle subtitle
                files in seconds.
              </p>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-16 text-center shadow-2xl sm:px-10 sm:py-20"
            >
              <div className="pointer-events-none absolute -top-24 -left-24 size-56 rounded-full bg-primary/5 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 size-56 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center px-2">
                <Badge
                  variant="secondary"
                  className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium tracking-wide text-primary"
                >
                  <FileHeart className="size-3.5" aria-hidden="true" />
                  100% free & local
                </Badge>

                <h3 className="mb-4 max-w-3xl text-3xl font-black leading-tight tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                  One tool. All your{" "}
                  <span className="text-primary">subtitle</span> needs.
                </h3>

                <p className="mx-auto mb-8 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                Trusted by translators who need fast, reliable subtitle handling—clean, convert, and manage files directly in your browser.

                </p>

                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 cursor-pointer rounded-full px-6 py-3 text-xs font-bold tracking-wider shadow-sm transition-all duration-200 hover:scale-[1.02] sm:text-sm"
                  >
                    <Link
                      href="/#features"
                      aria-label="Go to upload section"
                      className="inline-flex items-center"
                    >
                      <FileText className="mr-2 size-4" aria-hidden="true" />
                      Upload subtitle file
                      <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-12 cursor-pointer rounded-full px-6 py-3 text-xs font-bold tracking-wider transition-colors duration-200 sm:text-sm"
                  >
                    <Link
                      href="/#usage-guide"
                      aria-label="See how it works"
                      className="inline-flex items-center"
                    >
                      See how it works
                      <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </MotionDiv>
          </section>
        </div>
      </main>
      <FooterSection />
    </>
  );
}
