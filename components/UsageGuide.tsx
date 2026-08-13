"use client";

import { cn } from "@/lib/utils";
import {
  UploadCloud,
  Wrench,
  Download,
  SplitSquareHorizontal,
  Merge,
  ArrowRightLeft,
  FileText,
  CheckCircle2,
  SlidersHorizontal,
 
  FootprintsIcon
} from "lucide-react";
import { MotionDiv } from "@/lib/motion";
import { Badge } from "./ui/badge";
const steps = [
  {
    step: "STEP 01",
    title: "Pick your tool",
    description:
      "Choose between Split, Merge, or Convert. Switch tools anytime.",
    icon: Wrench,
  },
  {
    step: "STEP 02",
    title: "Upload files",
    description:
      "Drop in your SRT, ASS files. Everything stays private in your browser.",
    icon: UploadCloud,
  },
  {
    step: "STEP 03",
    title: "Configure options",
    description:
      "Set target formats, durations, or file merge order with ease.",
    icon: SlidersHorizontal,
  },
  {
    step: "STEP 04",
    title: "Download instantly",
    description:
      "Your files are processed in milliseconds. No email or account required.",
    icon: Download,
  },
];

export const UsageGuide = () => {
  return (
    <section id="usage-guide" className="bg-background py-24 sm:py-32 px-4 sm:px-6 font-dmSans relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-40 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Part 1: Header Animation */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl text-left"
        >
          <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium tracking-wide bg-primary/10 border border-primary/20 text-primary rounded-full mb-3"
            >
            <FootprintsIcon size="4" />
            How it works
          </Badge>
          <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tighter  leading-tight">
            Four simple steps. Done in <span className="text-primary">seconds.</span>
          </h2>
        </MotionDiv>

        {/* Part 2: Staggered Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((s, i) => (
            <MotionDiv
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl border border-primary/20 flex items-center justify-center bg-primary/10 shrink-0 shadow-xs">
                    <s.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-muted-foreground  tracking-[0.3em]">
                      {s.step}
                    </span>
                    <span className="block text-base font-bold text-foreground">
                      {s.title}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-5 min-h-[190px] shadow-xs flex flex-col justify-center">
                  {i === 0 && <ToolPreview />}
                  {i === 1 && <UploadPreview />}
                  {i === 2 && <ConfigPreview />}
                  {i === 3 && <DownloadPreview />}
                </div>
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                {s.description}
              </p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
};

function ToolPreview() {
  const tools = [
    { label: "Split", icon: SplitSquareHorizontal, color: "bg-primary" },
    { label: "Merge", icon: Merge, color: "bg-primary/70" },
    { label: "Convert", icon: ArrowRightLeft, color: "bg-primary/40" },
  ];
  return (
    <div className="space-y-2.5">
      <span className="text-[10px] font-mono text-muted-foreground  tracking-[0.3em] block text-left">
        Toolkit
      </span>
      {tools.map((t) => (
        <div
          key={t.label}
          className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-background px-3 py-2"
        >
          <span className={cn("size-1.5 rounded-full shrink-0", t.color)} />
          <t.icon className="size-3.5 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground">
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function UploadPreview() {
  return (
    <div className="space-y-3.5 text-left">
      <span className="text-[10px] font-mono text-muted-foreground  tracking-[0.3em] block">
        Subtitle File
      </span>
      <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-background px-3 py-2.5">
        <div className="relative flex items-center justify-center size-7 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <FileText className="size-3.5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-foreground truncate">
            the-odyssey.srt
          </p>
          <p className="text-[10px] font-mono text-muted-foreground">
            112.85 KB
          </p>
        </div>
        <CheckCircle2 className="size-3.5 text-primary shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        Ready to process
      </div>
    </div>
  );
}

function ConfigPreview() {
  return (
    <div className="space-y-3 text-left">
      <span className="text-[10px] font-mono text-muted-foreground  tracking-[0.3em] block">
        Options
      </span>
      <div className="p-3 bg-background border border-border/80 rounded-xl space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-muted-foreground font-mono">
            Target Format:
          </span>
          <span className="font-semibold text-primary  font-mono text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">
            .ASS
          </span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-muted-foreground font-mono">
            Preserve Style:
          </span>
          <span className="font-medium text-foreground">Yes</span>
        </div>
      </div>
    </div>
  );
}

function DownloadPreview() {
  return (
    <div className="space-y-3.5 text-left">
      <span className="text-[10px] font-mono text-muted-foreground  tracking-[0.3em] block">
        Output Ready
      </span>
      <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
        <FileText className="size-4 text-primary shrink-0" />
        <span className="text-xs font-semibold text-foreground truncate">
          the-odyssey.ass
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
        <CheckCircle2 className="size-3.5" />
        Instant Download
      </div>
    </div>
  );
}
