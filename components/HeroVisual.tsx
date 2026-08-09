"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FileText,
  Trash2,
  CheckCircle2,
  GripHorizontal,
  Merge as MergeIcon,
  Download,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";

function FauxFileCard() {
  return (
    <div className="bg-card border border-border rounded-[24px] p-6 shadow-2xl w-[380px] sm:w-[440px] md:w-[460px] space-y-4 text-left">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-mono font-bold  tracking-widest text-muted-foreground">
          UPLOADED FILES (2)
        </h3>
        <span className="text-xs font-mono text-muted-foreground">
          228.12 KB
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between p-3.5 bg-background border border-border/80 rounded-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex items-center justify-center size-10 shrink-0 rounded-full bg-primary/10 border border-primary/20">
              <FileText className="size-5 text-primary" />
              <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary  bg-background px-1 rounded-sm border border-primary/30">
                SRT
              </span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-foreground truncate">
                The Odyssey.srt
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                146.27 KB
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center size-8 shrink-0 text-destructive bg-destructive/10 rounded-full">
            <Trash2 className="size-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-background border border-border/80 rounded-2xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative flex items-center justify-center size-10 shrink-0 rounded-full bg-primary/10 border border-primary/20">
              <FileText className="size-5 text-primary" />
              <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary  bg-background px-1 rounded-sm border border-primary/30">
                SRT
              </span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-foreground truncate">
                The Batman (2022).srt
              </p>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                81.85 KB
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center size-8 shrink-0 text-destructive bg-destructive/10 rounded-full">
            <Trash2 className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FauxMergeConfig() {
  return (
    <div className="bg-card border border-border rounded-[24px] p-6.5 sm:p-7 shadow-2xl w-[380px] sm:w-[440px] md:w-[460px] space-y-5 text-left">
      <h3 className="text-xs font-bold  tracking-wider text-foreground">
        Merge Configuration
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-full text-xs font-medium text-foreground">
          <GripHorizontal className="size-4 text-muted-foreground" />
          <span className="truncate">The.Last.of.Us.S01E03.Part1.srt</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-full text-xs font-medium text-foreground">
          <GripHorizontal className="size-4 text-muted-foreground" />
          <span className="truncate">The.Last.of.Us.S01E03.Part2.srt</span>
        </div>
      </div>
      <div className="pt-2 flex justify-center">
        <div className="flex items-center justify-center gap-2 px-8 py-3.5 bg-purple-600 text-white text-xs font-bold tracking-widest rounded-full shadow-md shadow-purple-950/20">
          <MergeIcon className="size-4" /> Merge Files
        </div>
      </div>
    </div>
  );
}

function FauxMergeResults() {
  return (
    <div className="bg-card border border-primary/30 rounded-[24px] p-6.5 sm:p-7 shadow-2xl w-[380px] sm:w-[440px] md:w-[460px] space-y-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 size-40 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
      <h3 className="text-xl font-bold text-primary tracking-tight">
        Merge Results
      </h3>
      <div className="space-y-3 text-xs sm:text-sm text-foreground font-medium relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-16">File:</span>{" "}
          <span>Dune.Part.Three.merged.srt</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-16">Lines:</span>{" "}
          <span>5,716</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-16">Size:</span>{" "}
          <span>104.35 KB</span>
        </div>
      </div>
      <div className="pt-2 flex justify-center relative z-10">
        <div className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest rounded-full shadow-md shadow-primary/20">
          <Download className="size-4" /> Download Merged File
        </div>
      </div>
    </div>
  );
}

function FauxConvertConfig() {
  return (
    <div className="bg-card border border-border rounded-[24px] p-6.5 sm:p-7 shadow-2xl w-[380px] sm:w-[440px] md:w-[460px] space-y-5 text-left">
      <h3 className="text-[11px] font-mono font-bold  tracking-[0.2em] text-muted-foreground">
        CONVERT CONFIGURATION
      </h3>
      <div className="flex items-center gap-3.5 p-3.5 bg-background border border-border/80 rounded-2xl">
        <div className="relative flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 shrink-0">
          <FileText className="size-5 text-primary" />
          <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary  bg-background px-1 rounded-sm border border-primary/30">
            SRT
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
            Interstellar (2014).srt
          </p>
          <p className="text-xs font-mono text-muted-foreground mt-0.5">
            146.27 KB
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-muted-foreground  tracking-widest block">
            Target Format
          </span>
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground">
            <span>.ass</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-muted-foreground  tracking-widest block">
            Preserve Styling
          </span>
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground">
            <span>yes</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="pt-1 flex justify-center">
        <div className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs font-bold  tracking-widest rounded-full shadow-md shadow-primary/20">
          <ArrowRightLeft className="size-4" /> Convert to ASS
        </div>
      </div>
    </div>
  );
}

function FauxConvertResults() {
  return (
    <div className="bg-card border border-primary/30 rounded-[24px] p-6.5 sm:p-7 shadow-2xl w-[380px] sm:w-[440px] md:w-[460px] space-y-5 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 size-40 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
      <h3 className="text-lg font-black text-primary tracking-tight">
        Convert Results
      </h3>
      <div className="flex items-center gap-3.5 p-3.5 bg-background/80 border border-border/60 rounded-2xl relative z-10">
        <div className="relative flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 shrink-0">
          <FileText className="size-5 text-primary" />
          <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary  bg-background px-1 rounded-sm border border-primary/30">
            ASS
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
            Interstellar (2014).ass
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <span className="font-mono">146.27 KB</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <CheckCircle2 className="size-3.5 text-primary" /> Converted
            </span>
          </div>
        </div>
      </div>
      <div className="pt-1 flex justify-center relative z-10">
        <div className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-xs font-bold  tracking-widest rounded-full shadow-md shadow-primary/20">
          <Download className="size-4" /> Download Converted File
        </div>
      </div>
    </div>
  );
}

const cards = [
  { id: 1, content: <FauxConvertConfig /> },
  { id: 2, content: <FauxConvertResults /> },
  { id: 3, content: <FauxMergeConfig /> },
  { id: 4, content: <FauxMergeResults /> },
  { id: 5, content: <FauxFileCard /> },
];

export function HeroVisual() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[520px] w-full flex items-center justify-center overflow-hidden">
      <div className="relative w-[380px] sm:w-[440px] md:w-[460px] h-[380px] flex items-center justify-center">
        {cards.map((card, i) => {
          const offset = (i - currentIndex + cards.length) % cards.length;

          if (offset > 2) return null;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                y: offset * -28,
                scale: 1 - offset * 0.05,
                zIndex: cards.length - offset,
                opacity: offset === 0 ? 1 : offset === 1 ? 0.4 : 0.15,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              className="absolute top-0 left-0 right-0 cursor-pointer origin-top"
              onClick={() => setCurrentIndex(i)}
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40 -z-10 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
  );
}
