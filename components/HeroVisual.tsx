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
  Sticker
} from "lucide-react";
import { Badge } from "./ui/badge";

function FauxFileCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xl w-full max-w-[420px] space-y-3.5 text-left">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-mono font-bold tracking-widest text-muted-foreground">
          UPLOADED FILES (2)
        </h3>
        <span className="text-[11px] font-mono text-muted-foreground">
          228.12 KB
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between p-3 bg-background/80 border border-border/80 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center size-9 shrink-0 rounded-full bg-primary/10 border border-primary/20">
              <FileText className="size-4 text-primary" />
              <span className="absolute -bottom-1 text-[7px] font-mono font-bold text-primary bg-background px-1 rounded-sm border border-primary/30">
                SRT
              </span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                The Odyssey.srt
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                146.27 KB
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center size-7 shrink-0 text-destructive bg-destructive/10 rounded-full">
            <Trash2 className="size-3.5" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-background/80 border border-border/80 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center size-9 shrink-0 rounded-full bg-primary/10 border border-primary/20">
              <FileText className="size-4 text-primary" />
              <span className="absolute -bottom-1 text-[7px] font-mono font-bold text-primary bg-background px-1 rounded-sm border border-primary/30">
                SRT
              </span>
            </div>
            <div className="min-w-0 text-left">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                The Batman (2022).srt
              </p>
              <p className="text-[10px] font-mono text-muted-foreground">
                81.85 KB
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center size-7 shrink-0 text-destructive bg-destructive/10 rounded-full">
            <Trash2 className="size-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FauxMergeConfig() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xl w-full max-w-[420px] space-y-4 text-left">
      <h3 className="text-xs font-bold tracking-wider text-foreground">
        Merge Configuration
      </h3>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-background border border-border rounded-full text-xs font-medium text-foreground">
          <GripHorizontal className="size-3.5 text-muted-foreground" />
          <span className="truncate">The.Last.of.Us.S01E03.Part1.srt</span>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-background border border-border rounded-full text-xs font-medium text-foreground">
          <GripHorizontal className="size-3.5 text-muted-foreground" />
          <span className="truncate">The.Last.of.Us.S01E03.Part2.srt</span>
        </div>
      </div>
      <div className="pt-1 flex justify-center">
        <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest rounded-full shadow-md">
          <MergeIcon className="size-3.5" /> Merge Files
        </div>
      </div>
    </div>
  );
}

function FauxMergeResults() {
  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-5 shadow-xl w-full max-w-[420px] space-y-4 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 size-36 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
      <h3 className="text-lg font-bold text-primary tracking-tight">
        Merge Results
      </h3>
      <div className="space-y-2 text-xs text-foreground font-medium relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-14">File:</span>{" "}
          <span className="truncate font-semibold">Dune.Part.Three.merged.srt</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-14">Lines:</span>{" "}
          <span>5,716</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground w-14">Size:</span>{" "}
          <span>104.35 KB</span>
        </div>
      </div>
      <div className="pt-1 flex justify-center relative z-10">
        <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest rounded-full shadow-md">
          <Download className="size-3.5" /> Download Merged File
        </div>
      </div>
    </div>
  );
}

function FauxConvertConfig() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-xl w-full max-w-[420px] space-y-4 text-left">
      <h3 className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground">
        CONVERT CONFIGURATION
      </h3>
      <div className="flex items-center gap-3 p-3 bg-background border border-border/80 rounded-xl">
        <div className="relative flex items-center justify-center size-9 rounded-full bg-primary/10 border border-primary/20 shrink-0">
          <FileText className="size-4 text-primary" />
          <span className="absolute -bottom-1 text-[7px] font-mono font-bold text-primary bg-background px-1 rounded-sm border border-primary/30">
            SRT
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
            Interstellar (2014).srt
          </p>
          <p className="text-[10px] font-mono text-muted-foreground">
            146.27 KB
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-muted-foreground tracking-widest block">
            Target Format
          </span>
          <div className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg text-xs font-medium text-foreground">
            <span>.ass</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-muted-foreground tracking-widest block">
            Preserve Styling
          </span>
          <div className="flex items-center justify-between px-3 py-2 bg-background border border-border rounded-lg text-xs font-medium text-foreground">
            <span>yes</span>
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="pt-1 flex justify-center">
        <div className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest rounded-full shadow-md">
          <ArrowRightLeft className="size-3.5" /> Convert to ASS
        </div>
      </div>
    </div>
  );
}

function FauxConvertResults() {
  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-5 shadow-xl w-full max-w-[420px] space-y-4 relative overflow-hidden text-left">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 size-36 bg-primary/10 blur-2xl rounded-full pointer-events-none" />
      <h3 className="text-base font-black text-primary tracking-tight">
        Convert Results
      </h3>
      <div className="flex items-center gap-3 p-3 bg-background/80 border border-border/60 rounded-xl relative z-10">
        <div className="relative flex items-center justify-center size-9 rounded-full bg-primary/10 border border-primary/20 shrink-0">
          <FileText className="size-4 text-primary" />
          <span className="absolute -bottom-1 text-[7px] font-mono font-bold text-primary bg-background px-1 rounded-sm border border-primary/30">
            ASS
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
            Interstellar (2014).ass
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
            <span className="font-mono">146.27 KB</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <CheckCircle2 className="size-3.5 text-primary" /> Converted
            </span>
          </div>
        </div>
      </div>
      <div className="pt-1 flex justify-center relative z-10">
        <div className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold tracking-widest rounded-full shadow-md">
          <Download className="size-3.5" /> Download Converted File
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
    <div className="relative w-full max-w-[480px] mx-auto flex flex-col items-center justify-center gap-5 p-6 rounded-[32px] border border-border/60 bg-gradient-to-b from-card/80 to-card/30 backdrop-blur-xl shadow-2xl overflow-hidden">
      
      {/*  Header Badge */}
      <Badge
        variant="secondary"
        className="px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest bg-primary/10 border border-primary/20 text-primary rounded-full inline-flex items-center gap-1.5 z-20 shadow-xs uppercase"
      >
        <Sticker className="size-3.5" />
        ALL YOUR FILES, ONE PLACE
      </Badge>

      {/*  Stacked Cards Container */}
      <div className="relative w-full h-[260px] flex items-start justify-center pt-2">
        {cards.map((card, i) => {
          const offset = (i - currentIndex + cards.length) % cards.length;

          if (offset > 2) return null;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                y: offset * 18,
                scale: 1 - offset * 0.04,
                zIndex: cards.length - offset,
                opacity: offset === 0 ? 1 : offset === 1 ? 0.5 : 0.2,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              className="absolute top-0 left-0 right-0 flex justify-center cursor-pointer origin-top"
              onClick={() => setCurrentIndex(i)}
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>

      {/* 3. Stats Boxes Bottom */}
      <div className="w-full grid grid-cols-3 gap-2.5 z-20 pt-2">
        {[
          { value: "100%", label: "Client-Side" },
          { value: "0ms", label: "Latency" },
          { value: "SRT / ASS", label: "Formats" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border/70 bg-background/80 px-2.5 py-2.5 text-center shadow-sm backdrop-blur-md"
          >
            <p className="text-xs sm:text-sm font-black tracking-tight text-primary truncate">
              {item.value}
            </p>
            <p className="mt-0.5 text-[8px] font-mono uppercase tracking-wider text-muted-foreground truncate">
              {item.label}
            </p>
          </div>
        ))}
      </div>

  
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 -z-10 mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  );
}