"use client";

import React from "react";
import { RadialNav, type RadialNavItem } from "@/components/animated/RadialNav";
import {
  SplitSquareHorizontal,
  Merge,
  ChevronDown,
  AlignLeft,
  ArrowRightLeft,
  ScanEye
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import { MotionDiv } from "@/lib/motion";

const items: RadialNavItem[] = [
  { id: 1, icon: SplitSquareHorizontal, label: "Split", angle: 0 },
  { id: 2, icon: Merge, label: "Merge", angle: 120 },
  { id: 3, icon: ArrowRightLeft, label: "Convert", angle: 240 },
];

export default function PreviewSection() {
  const [activeSection, setActiveSection] = React.useState<
    "split" | "merge" | "convert"
  >("split");

  return (
    <section id="preview" className="bg-background py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 font-dmSans relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-20 mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center gap-3 mb-8 max-w-xl px-2"
        >
    <Badge
                variant="secondary"
                className="px-3.5 py-1 text-xs font-mono font-bold tracking-widest bg-primary/10 border border-primary/20 text-primary rounded-full mb-4 inline-flex items-center gap-1.5"
              >
                <ScanEye size="4" />
  Discover What MergeIt Can Do
</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight  leading-tight">
            Split, <span className="text-primary">merge</span>, or convert.
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg font-medium leading-relaxed">
            Pick a tool below. merge combines multiple SRT files into one,
            keeping timing intact so nothing overlaps or drifts.
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.36, delay: 0.08 }}
          className="flex items-center justify-center py-4 mb-6"
        >
          <RadialNav
            items={items}
            defaultActiveId={1}
            onActiveChange={(id) => {
              const map = { 1: "split", 2: "merge", 3: "convert" } as const;
              setActiveSection(map[id as 1 | 2 | 3]);
            }}
          />
        </MotionDiv>

        <MotionDiv
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          className="w-full max-w-3xl"
        >
          {activeSection === "split" && <SplitPanel />}
          {activeSection === "merge" && <MergePanel />}
          {activeSection === "convert" && <ConvertPanel />}
        </MotionDiv>
      </div>
    </section>
  );
}

function SplitPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 text-xs font-mono text-muted-foreground  tracking-wider gap-2">
        <span>Files: 2</span>
        <span>Total Size: 85.94 KB</span>
      </div>

      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-sm font-bold  tracking-wider text-foreground">
            Split Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Split Method
              </label>
              <div className="flex items-center justify-between border border-border bg-card rounded-xl px-4 py-3 text-sm text-foreground">
                <span>By Time Duration</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Duration per File (minutes)
              </label>
              <input
                type="number"
                defaultValue={10}
                min={1}
                className="w-full border border-border bg-background rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/40 transition-colors"
                aria-label="Duration per file in minutes"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="px-6 py-3 bg-primary  flex text-white rounded-xl shadow-md"
              aria-label="Split files"
            >
              <SplitSquareHorizontal className="h-5 w-5 mr-2" />
              Split Files
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MergePanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 text-xs font-mono text-muted-foreground  tracking-wider gap-2">
        <span>Files: 2</span>
        <span>Total Size: 104.35 KB</span>
      </div>

      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-sm font-bold  tracking-wider text-foreground">
            Merge Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 py-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3.5 bg-background border border-border rounded-xl text-xs sm:text-sm text-foreground font-medium">
              <AlignLeft className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="truncate">The.Last.of.Us.S01E03.Part1.srt</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-background border border-border rounded-xl text-xs sm:text-sm text-foreground font-medium">
              <AlignLeft className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="truncate">The.Last.of.Us.S01E03.Part2.srt</span>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="px-6 py-3 flex bg-primary text-white rounded-xl shadow-md"
              aria-label="Merge files"
            >
              <Merge className="h-5 w-5 mr-2" />
              Merge Files
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConvertPanel() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 text-xs font-mono text-muted-foreground  tracking-wider gap-2">
        <span>Files: 1</span>
        <span>Total Size: 48.20 KB</span>
      </div>

      <Card className="rounded-2xl shadow-sm border-border">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-sm font-bold  tracking-wider">
            Convert Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Target Format
              </label>
              <Select defaultValue="ass">
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ass">
                    Advanced SubStation (.ass)
                  </SelectItem>
                  <SelectItem value="srt">SubRip (.srt)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Preserve Styling
              </label>
              <Select defaultValue="yes">
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes (Default)</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <div
              className="px-6 flex py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md"
              aria-label="Convert to selected format"
            >
              <ArrowRightLeft className="h-5 w-5 mr-2" />
              Convert
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
