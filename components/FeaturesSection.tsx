"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
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
import { AnimatePresence } from "framer-motion";
import SplitFilesPanel from "@/components/features/SplitFilesPanel";
import { UploadedFileList } from "./UploadFileList";
import MergeFilesPanel from "./features/MergeFilesPanel";
import ConvertFilesPanel from "./features/ConvertFilesPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const tools = [
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
] as const;

type ToolId = (typeof tools)[number]["id"];

const TOOL_IDS = tools.map((t) => t.id) as ToolId[];

function hashToTool(hash: string): ToolId | null {
  const clean = hash.replace("#", "").toLowerCase();
  return (TOOL_IDS as string[]).includes(clean) ? (clean as ToolId) : null;
}

const ACCEPTED_EXTENSIONS = /\.(srt|ass|vtt|txt)$/i;


declare global {
  interface WindowEventMap {
    "mergeit:select-tool": CustomEvent<ToolId>;
  }
}

export const FeaturesSection = () => {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolButtonRefs = useRef<Partial<Record<ToolId, HTMLButtonElement | null>>>({});

  const active = useMemo(
    () => tools.find((tool) => tool.id === activeTool) ?? null,
    [activeTool]
  );

  const selectTool = useCallback((id: ToolId) => {

    startTransition(() => {
      setActiveTool(id);
      setFiles([]);
    });

  
    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }

    requestAnimationFrame(() => {
      toolButtonRefs.current[id]?.focus();
    });
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const tool = hashToTool(window.location.hash);
      if (tool) setActiveTool(tool);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const handleSelectTool = (event: WindowEventMap["mergeit:select-tool"]) => {
      if (event.detail) selectTool(event.detail);
    };

    window.addEventListener("mergeit:select-tool", handleSelectTool);
    return () => window.removeEventListener("mergeit:select-tool", handleSelectTool);
  }, [selectTool]);

  const handleBoxClick = useCallback(() => fileInputRef.current?.click(), []);
  const handleDragOver = useCallback((event: React.DragEvent) => event.preventDefault(), []);

  const handleFileSelect = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const validSubtitleFiles = Array.from(fileList).filter((file) =>
        ACCEPTED_EXTENSIONS.test(file.name)
      );

      setFiles((prev) => {
        if (!active?.multiple) return validSubtitleFiles.slice(0, 1);

        const existingNames = new Set(prev.map((f) => f.name));
        const deduped = validSubtitleFiles.filter((f) => !existingNames.has(f.name));
        return [...prev, ...deduped];
      });
    },
    [active?.multiple]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      handleFileSelect(event.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleRemoveFile = useCallback((fileNameToRemove: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileNameToRemove));
  }, []);

  return (
    <section
      id="features"
      className="relative min-h-screen overflow-hidden bg-background px-4 pt-16 pb-6 font-dmSans sm:px-6 sm:pt-24 sm:pb-8 md:pt-32 md:pb-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-40 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-12 sm:space-y-16">
        {/* HEADER */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-between gap-8 border-b border-border pb-8 md:flex-row md:items-start md:gap-12 sm:pb-12"
        >
          <div className="space-y-4 sm:space-y-6">
            <Badge
              className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium tracking-wide text-primary"
              variant="secondary"
            >
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
            Split, merge, and convert SRT and ASS subtitle files directly in
            your browser. Built for speed, privacy, and precision.
          </p>
        </MotionDiv>

     
        <AnimatePresence mode="popLayout" initial={false}>
          {!active ? (
            <MotionDiv
              key="cards-grid"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                scale: 0.85,
                filter: "blur(12px)",
                transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
            >
              {tools.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title}: ${card.label}`}
                  onClick={() => selectTool(card.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectTool(card.id);
                    }
                  }}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-3xl border border-border text-left transition-all duration-300 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-95"
                  )}
                >
                  <div
                    className={cn(
                      "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                      card.color
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
              ))}
            </MotionDiv>
          ) : (
            <MotionDiv
              key="tool-panel-container"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* TOOL TABS */}
              <div
                role="tablist"
                aria-label="Subtitle tools"
                className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
              >
                {tools.map((tool) => {
                  const selected = active.id === tool.id;

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
                        "rounded-2xl border p-4 text-left outline-none transition-all sm:p-5",
                        selected
                          ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/30"
                          : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                            selected
                              ? "bg-primary text-primary-foreground"
                              : "bg-accent text-accent-foreground"
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

              {/* FILE AREA */}
              <div
                role="tabpanel"
                id={`tool-panel-${active.id}`}
                aria-labelledby={`tool-tab-${active.id}`}
                className="space-y-8"
              >
                {files.length === 0 ? (
                  <FileDropzone
                    fileInputRef={fileInputRef}
                    handleBoxClick={handleBoxClick}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleFileSelect={handleFileSelect}
                    label={active.dropzoneLabel}
                    multiple={active.multiple}
                  />
                ) : (
                  <MotionDiv
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-2xl space-y-6"
                  >
                    <UploadedFileList
                      files={files}
                      onRemove={handleRemoveFile}
                    />

                    {active.id === "split" && <SplitFilesPanel files={files} />}

                    {active.id === "merge" && (
                      <MergeFilesPanel
                        files={files}
                        onAddFiles={handleFileSelect}
                      />
                    )}

                    {active.id === "convert" && (
                      <ConvertFilesPanel files={files} />
                    )}

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
        </AnimatePresence>

        {/* HOW IT WORKS */}
        <div className="flex justify-center pt-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-border px-6 py-5 text-xs font-bold tracking-wider"
          >
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2"
            >
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