"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  SplitSquareHorizontal,
  Merge,
  ArrowRightLeft,
  SquareStack,
  ArrowRight,
  FootprintsIcon,
} from "lucide-react";
import { FileDropzone } from "./FileDropzone";
import { MotionDiv } from "@/lib/motion";
import SplitFilesPanel from "@/components/features/SplitFilesPanel";
import { UploadedFileList } from "./UploadFileList";
import MergeFilesPanel from "./features/MergeFilesPanel";
import ConvertFilesPanel from "./features/ConvertFilesPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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
  const [transitioningTool, setTransitioningTool] = useState<ToolId | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toolButtonRefs = useRef<
    Partial<Record<ToolId, HTMLButtonElement | null>>
  >({});

  const active = tools.find((tool) => tool.id === activeTool);

  const selectTool = (id: ToolId) => {
    setActiveTool(id);
    setFiles([]);
    window.history.replaceState(null, "", toolToHash(id));

    requestAnimationFrame(() => {
      toolButtonRefs.current[id]?.focus();
    });
  };

  const handleCardClick = (id: ToolId) => {
    if (transitioningTool) return;

    setTransitioningTool(id);

    transitionTimeoutRef.current = setTimeout(() => {
      selectTool(id);
      setTransitioningTool(null);
    }, 520);
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const tool = hashToTool(window.location.hash);

      if (tool) {
        setActiveTool(tool);
        requestAnimationFrame(() => {
          toolButtonRefs.current[tool]?.focus();
        });
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const handleSelectTool = (event: Event) => {
      const detail = (event as CustomEvent<ToolId>).detail;
      const toolMap = {
        split: "split",
        merge: "merge",
        convert: "convert",
      } as const;
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

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    handleFileSelect(event.dataTransfer.files);
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;

    const validSubtitleFiles = Array.from(fileList).filter((file) =>
      /\.(srt|ass|vtt|txt)$/i.test(file.name),
    );

    setFiles(
      active?.multiple
        ? [...files, ...validSubtitleFiles]
        : validSubtitleFiles.slice(0, 1),
    );
  };

  const handleRemoveFile = (fileNameToRemove: string) => {
    setFiles((previousFiles) =>
      previousFiles.filter((file) => file.name !== fileNameToRemove),
    );
  };

  const isCollapsing = Boolean(transitioningTool);

  return (
    <section
      id="features"
      className="relative min-h-screen overflow-hidden bg-background px-4 pt-16 pb-6 font-dmSans sm:px-6 sm:pt-24 sm:pb-8 md:pt-32 md:pb-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-40 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-12 sm:space-y-16">
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between gap-8 border-b border-border pb-8 md:flex-row md:items-start md:gap-12 sm:pb-12"
        >
          <div className="space-y-4 sm:space-y-6">
            <Badge className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium tracking-wide text-primary" variant="secondary">
              <SquareStack size={16} />
              All-in-one
            </Badge>

            <h2 className="text-4xl font-black leading-none tracking-tighter text-foreground sm:text-6xl md:text-7xl">
              one <span className="text-primary">Toolkit.</span>
              <br />
              Dual Support.
            </h2>
          </div>

          <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Split, merge, and convert SRT and ASS subtitle files directly in your browser. Built for speed, privacy, and precision.
          </p>
        </MotionDiv>

        {!activeTool ? (
          <MotionDiv
            initial={{ opacity: 0, scale: 1, y: 0 }}
            animate={
              isCollapsing
                ? { opacity: 0, scale: 0.82, y: -24, filter: "blur(5px)" }
                : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            }
            transition={{
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid origin-center grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
          >
            {tools.map((card, index) => {
              const isSelected = transitioningTool === card.id;
              const hasSelectedCard = Boolean(transitioningTool);

              return (
                <MotionDiv
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: hasSelectedCard ? (isSelected ? 0.9 : 0.2) : 1,
                    scale: hasSelectedCard ? (isSelected ? 0.72 : 0.9) : 1,
                    y: hasSelectedCard ? (isSelected ? -18 : 0) : 0,
                    rotate: hasSelectedCard && isSelected ? -2 : 0,
                  }}
                  transition={{
                    duration: 0.52,
                    delay: hasSelectedCard ? (isSelected ? 0 : 0.03) : index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Card
                    id={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={cn(
                      "group relative cursor-pointer overflow-hidden rounded-3xl border border-border text-left transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/30",
                      isSelected && "border-primary/50 shadow-xl shadow-primary/10",
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent transition-opacity duration-500",
                        isSelected ? "opacity-70" : "opacity-0 group-hover:opacity-100",
                        card.color,
                      )}
                    />

                    <CardContent className="relative z-10 space-y-6 p-8 sm:p-10 lg:p-12">
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-2xl font-black tracking-tighter text-card-foreground sm:text-3xl">
                          {card.title}
                        </h3>
                        <p className="text-sm font-bold text-muted-foreground sm:text-base">
                          {card.label}
                        </p>
                      </div>

                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent sm:size-14">
                        <card.icon className="size-5 text-accent-foreground sm:size-6" />
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              );
            })}
          </MotionDiv>
        ) : (
          <MotionDiv
            key={activeTool}
            id={`tool-panel-${activeTool.toLowerCase()}`}
            role="tabpanel"
            aria-labelledby={`tool-tab-${activeTool.toLowerCase()}`}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div
              role="tablist"
              aria-label="Subtitle tools"
              className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
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
                    id={`tool-tab-${tool.id}`}
                    aria-selected={selected}
                    aria-controls={`tool-panel-${tool.id}`}
                    onClick={() => selectTool(tool.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5",
                      selected
                        ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-accent text-accent-foreground",
                        )}
                      >
                        <tool.icon className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base font-black tracking-tight text-foreground">
                          {tool.title}
                        </p>
                        <p className="truncate text-xs font-bold text-muted-foreground">
                          {tool.label}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-8">
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
                  className="mx-auto max-w-2xl space-y-6"
                >
                  <UploadedFileList files={files} onRemove={handleRemoveFile} />

                  {activeTool === "split" && <SplitFilesPanel files={files} />}
                  {activeTool === "merge" && (
                    <MergeFilesPanel files={files} onAddFiles={handleFileSelect} />
                  )}
                  {activeTool === "convert" && <ConvertFilesPanel files={files} />}

                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setFiles([])}
                      className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground"
                    >
                      Upload different files?
                    </Button>
                  </div>
                </MotionDiv>
              )}
            </div>
          </MotionDiv>
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

