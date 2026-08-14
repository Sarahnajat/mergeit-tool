"use client"

import React from "react"
import { RadialNav, type RadialNavItem } from "@/components/animated/RadialNav"
import {
  AlignLeft,
  ArrowRightLeft,
  ChevronDown,
  Merge,
  ScanEye,
  SplitSquareHorizontal,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MotionDiv } from "@/lib/motion"

const items: RadialNavItem[] = [
  { id: 1, icon: SplitSquareHorizontal, label: "Split", angle: 0 },
  { id: 2, icon: Merge, label: "Merge", angle: 120 },
  { id: 3, icon: ArrowRightLeft, label: "Convert", angle: 240 },
]

type ActiveSection = "split" | "merge" | "convert"

const sectionMap: Record<1 | 2 | 3, ActiveSection> = {
  1: "split",
  2: "merge",
  3: "convert",
}

export default function PreviewSection() {
  const [activeSection, setActiveSection] = React.useState<ActiveSection>("split")

  const openFeature = (tool: ActiveSection) => {
    window.dispatchEvent(
      new CustomEvent("mergeit:select-tool", {
        detail: tool,
      }),
    )
  }

  const handleActiveChange = (id: number) => {
    const section = sectionMap[id as 1 | 2 | 3]
    if (!section) return

    setActiveSection(section)
  }

  return (
    <section
      id="preview"
      className="relative w-full overflow-hidden bg-background px-4 py-16 font-dmSans sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex max-w-xl flex-col items-center gap-3 px-2 text-center"
        >
          <Badge
            variant="secondary"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-primary"
          >
            <ScanEye className="size-4" aria-hidden="true" />
            Discover What MergeIt Can Do
          </Badge>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Split, <span className="text-primary">merge</span>, or convert.
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base max-w-lg font-medium leading-relaxed">
          See a preview of MergeIt in action — split, merge, or convert subtitle files. This preview shows how MergeIt works with your files: splitting them into parts, merging multiple into one, or converting formats while keeping timing intact.
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.36, delay: 0.08 }}
          className="mb-6 flex items-center justify-center py-4"
        >
          <RadialNav
            items={items}
            defaultActiveId={1}
            onActiveChange={handleActiveChange}
          />
        </MotionDiv>

        <MotionDiv
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          className="w-full max-w-3xl"
        >
          {activeSection === "split" && (
            <SplitPanel onOpenFeature={() => openFeature("split")} />
          )}
          {activeSection === "merge" && (
            <MergePanel onOpenFeature={() => openFeature("merge")} />
          )}
          {activeSection === "convert" && (
            <ConvertPanel onOpenFeature={() => openFeature("convert")} />
          )}
        </MotionDiv>
      </div>
    </section>
  )
}

function SplitPanel({ onOpenFeature }: { onOpenFeature: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 px-2 font-mono text-xs tracking-wider text-muted-foreground sm:flex-row sm:items-center">
        <span>Files: 2</span>
        <span>Total Size: 85.94 KB</span>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-sm font-bold tracking-wider text-foreground">
            Split Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-4 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Split Method
              </label>
              <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
                <span>By Time Duration</span>
                <ChevronDown className="size-5 text-muted-foreground" aria-hidden="true" />
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
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
                aria-label="Duration per file in minutes"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onOpenFeature}
              className="flex rounded-xl bg-primary px-6 py-3 text-white shadow-md transition-colors hover:bg-primary/90"
            >
              <SplitSquareHorizontal className="mr-2 size-5" aria-hidden="true" />
              Split Files
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MergePanel({ onOpenFeature }: { onOpenFeature: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 px-2 font-mono text-xs tracking-wider text-muted-foreground sm:flex-row sm:items-center">
        <span>Files: 2</span>
        <span>Total Size: 104.35 KB</span>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-sm font-bold tracking-wider text-foreground">
            Merge Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-4 py-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 text-xs font-medium text-foreground sm:text-sm">
              <AlignLeft className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">The.Last.of.Us.S01E03.Part1.srt</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 text-xs font-medium text-foreground sm:text-sm">
              <AlignLeft className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">The.Last.of.Us.S01E03.Part2.srt</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={onOpenFeature}
              className="flex rounded-xl bg-primary px-6 py-3 text-white shadow-md transition-colors hover:bg-primary/90"
            >
              <Merge className="mr-2 size-5" aria-hidden="true" />
              Merge Files
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConvertPanel({ onOpenFeature }: { onOpenFeature: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 px-2 font-mono text-xs tracking-wider text-muted-foreground sm:flex-row sm:items-center">
        <span>Files: 1</span>
        <span>Total Size: 48.20 KB</span>
      </div>

      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-sm font-bold tracking-wider text-foreground">
            Convert Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 px-4 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Target Format
              </label>
              <Select defaultValue="ass">
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ass">Advanced SubStation (.ass)</SelectItem>
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
            <button
              type="button"
              onClick={onOpenFeature}
              className="flex rounded-xl bg-primary px-6 py-3 text-white shadow-md transition-colors hover:bg-primary/90"
            >
              <ArrowRightLeft className="mr-2 size-5" aria-hidden="true" />
              Convert
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

