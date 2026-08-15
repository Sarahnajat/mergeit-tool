"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SplitSquareHorizontal, Merge, ArrowRightLeft, SquareStack } from "lucide-react";
import { FileDropzone } from "./FileDropzone";
import { MotionDiv } from "@/lib/motion";
import SplitFilesPanel from "@/components/features/SplitFilesPanel";
import { UploadedFileList } from "./UploadFileList";
import MergeFilesPanel from "./features/MergeFilesPanel";
import ConvertFilesPanel from "./features/ConvertFilesPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {Badge} from "@/components/ui/badge"
import Link from "next/link";
import { ArrowRight, FootprintsIcon } from "lucide-react";
type ToolId = "split" | "merge" | "convert";

function hashToTool(hash: string): ToolId | null {
  switch (hash.replace("#", "").toLowerCase()) {
    case "split":
      return "split";
    case "merge":
      return "merge";
    case "convert":
      return "convert";
    default:
      return null;
  }
}

function toolToHash(id: ToolId): string {
  return `#${id.toLowerCase()}`;
}

const tools: {
  id: ToolId;
  title: string;
  label: string;
  color: string;
  icon: typeof SplitSquareHorizontal;
  dropzoneLabel: string;
  multiple: boolean;
}[] = [
  {
    id: "split",
    title: "Split",
    label: "Break Files Apart",
    color: "from-chart-1/20",
    icon: SplitSquareHorizontal,
    dropzoneLabel: "Upload an SRT or ASS file to split",
    multiple: false,
  },
  {
    id: "merge",
    title: "Merge",
    label: "Combine Into One",
    color: "from-chart-1/20",
    icon: Merge,
    dropzoneLabel: "Upload SRT or ASS files to merge",
    multiple: true,
  },
  {
    id: "convert",
    title: "Convert",
    label: "ASS ↔ SRT Converter",
    color: "from-chart-1/20",
    icon: ArrowRightLeft,
    dropzoneLabel: "Upload a subtitle file to switch formats",
    multiple: false,
  },
];

export const FeaturesSection = () => {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [clickingId, setClickingId] = useState<ToolId | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolButtonRefs = useRef<
  Partial<Record<ToolId, HTMLButtonElement | null>>
>({});

  const active = tools.find((t) => t.id === activeTool);

  const selectTool = (id: ToolId) => {
    setActiveTool(id);
    setFiles([]);
    window.history.replaceState(null, "", toolToHash(id));
    requestAnimationFrame(() => toolButtonRefs.current[id]?.focus());
  };

  const handleCardClick = (id: ToolId) => {
    setClickingId(id);
    window.setTimeout(() => {
      selectTool(id);
      setClickingId(null);
    }, 350);
  };

  useEffect(() => {
    const syncFromHash = () => {
      const tool = hashToTool(window.location.hash);
      if (tool) {
        setActiveTool(tool);
        requestAnimationFrame(() => toolButtonRefs.current[tool]?.focus());
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const handleSelectTool = (event: Event) => {
      const detail = (event as CustomEvent<"split" | "merge" | "convert">).detail;
      const toolMap = { split: "split", merge: "merge", convert: "convert" } as const;
      const tool = toolMap[detail];
      if (!tool) return;

      selectTool(tool);
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("mergeit:select-tool", handleSelectTool);
    return () => window.removeEventListener("mergeit:select-tool", handleSelectTool);
  }, []);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    const validSubtitleFiles = Array.from(fileList).filter((f) =>
      /\.(srt|ass|vtt|txt)$/i.test(f.name),
    );
    setFiles(
      active?.multiple
        ? [...files, ...validSubtitleFiles]
        : validSubtitleFiles.slice(0, 1),
    );
  };

  // This function deletes a file when you click the trash can
  const handleRemoveFile = (fileNameToRemove: string) => {
    setFiles((prevFiles) =>
      prevFiles.filter((f) => f.name !== fileNameToRemove),
    );
  };

  return (
    <section id="features" className="bg-background pt-16 sm:pt-24 md:pt-32 pb-6 sm:pb-8 md:pb-10 px-4 sm:px-6 min-h-screen font-dmSans relative overflow-hidden">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-40 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12 border-b border-border pb-8 sm:pb-12"
        >
          
          <div className="space-y-4 sm:space-y-6">
          <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium tracking-wide bg-primary/10 border border-primary/20 text-primary rounded-full mb-3"
            >
            <SquareStack size="4" />
            All-in-one
          </Badge>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground tracking-tighter  leading-none">
             one <span className="text-primary">Toolkit.</span> 
              <br />
              Dual Support.
            </h2>
          </div>
          <p className="mt-6 max-w-xs text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Split, merge, and convert SRT and ASS subtitle files directly in your browser. built for speed, privacy, and precision.

          </p>
        </MotionDiv>

        {!activeTool ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tools.map((card, index) => {
              const isClicking = clickingId === card.id;

              return (
                <MotionDiv
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: clickingId ? (isClicking ? 0.85 : 0) : 1,
                    y: 0,
                    scale: clickingId ? (isClicking ? 0.94 : 0.9) : 1,
                  }}
                  transition={{ duration: clickingId ? 0.35 : 0.4, delay: clickingId ? 0 : index * 0.1, ease: "easeInOut" }}
                >
                  <Card
                    id={card.id.toLowerCase()}
                    onClick={() => handleCardClick(card.id)}
                    className={cn(
                      "scroll-mt-24",
                      "group relative text-left rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 border border-border hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/30",
                      isClicking && "border-primary/40",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br to-transparent transition-opacity duration-500 pointer-events-none",
                        isClicking ? "opacity-60" : "opacity-0 group-hover:opacity-100",
                        card.color,
                      )}
                    />
                    <CardContent className="relative z-10 p-8 sm:p-10 lg:p-12 space-y-6">
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-2xl sm:text-3xl font-black text-card-foreground tracking-tighter">
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base font-bold text-muted-foreground">
                          {card.label}
                        </p>
                      </div>
                      <div className="size-12 sm:size-14 rounded-2xl bg-accent flex items-center justify-center shrink-0">
                        <card.icon className="size-5 sm:size-6 text-accent-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            <div
              role="tablist"
              aria-label="Subtitle tools"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
            >
              {tools.map((tool) => {
                const selected = activeTool === tool.id;

                return (
                  <button
                    key={tool.id}
                    ref={(node) => {
                      toolButtonRefs.current[tool.id] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`tool-tab-${tool.id.toLowerCase()}`}
                    aria-selected={selected}
                    aria-controls={`tool-panel-${tool.id.toLowerCase()}`}
                    onClick={() => selectTool(tool.id)}
                    className={cn(
                      "rounded-2xl border p-4 sm:p-5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      selected
                        ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-10 rounded-xl flex items-center justify-center shrink-0",
                          selected ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
                        )}
                      >
                        <tool.icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-black tracking-tight text-foreground">
                          {tool.title}
                        </p>
                        <p className="text-xs font-bold text-muted-foreground truncate">
                          {tool.label}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <MotionDiv
              key={activeTool}
              id={`tool-panel-${activeTool.toLowerCase()}`}
              role="tabpanel"
              aria-labelledby={`tool-tab-${activeTool.toLowerCase()}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {files.length === 0 ? (
                <FileDropzone
                  fileInputRef={fileInputRef}
                  handleBoxClick={handleBoxClick}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  handleFileSelect={handleFileSelect}
                  label={active!.dropzoneLabel}
                  multiple={active!.multiple}
                />
              ) : (
                <MotionDiv
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <UploadedFileList files={files} onRemove={handleRemoveFile} />

                  {activeTool === "split" && <SplitFilesPanel files={files} />}
                  {activeTool === "merge" && (
                    <MergeFilesPanel
                      files={files}
                      onAddFiles={handleFileSelect}
                    />
                  )}
                  {activeTool === "convert" && (
                    <ConvertFilesPanel files={files} />
                  )}

                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setFiles([])}
                      className="text-xs text-muted-foreground hover:text-foreground font-mono tracking-wider"
                    >
                      Upload different files?
                    </Button>
                  </div>
                </MotionDiv>
              )}
            </MotionDiv>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-border px-6 py-5 text-xs font-bold tracking-wider"
          >
            <Link href="/how-it-works" className="inline-flex items-center gap-2">
              <FootprintsIcon className="size-4" />
              How It Works
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};