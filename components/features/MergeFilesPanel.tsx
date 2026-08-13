"use client";

import { useRef, useState } from "react";
import { AlertCircle, Download, GripHorizontal, Loader2, Merge as MergeIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToolToast } from "@/components/AlertMessage";
import { mergeSubtitles, type SubtitleFormat } from "@/lib/MergeFiles";

interface MergeProps {
  files?: File[];
  onAddFiles?: (files: FileList | null) => void;
}

interface MergeMetadata {
  filename: string;
  lines: number;
  duration: string;
  sizeKB: string;
  blob: Blob;
}

function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

async function getMergedMetadata(blob: Blob, filename: string, format: SubtitleFormat): Promise<MergeMetadata> {
  const content = await blob.text();
  let lines = 0;
  let endTime = 0;

  if (format === "srt") {
    const blocks = content.trim().split(/\r?\n\s*\r?\n/).filter(Boolean);
    lines = blocks.length;
    for (const block of blocks) {
      const timeLine = block.split(/\r?\n/).find((line) => line.includes("-->"));
      const end = timeLine?.split("-->")[1]?.trim();
      const match = end?.match(/^(\d+):(\d{2}):(\d{2}),(\d{3})$/);
      if (match) endTime = Math.max(endTime, ((+match[1] * 3600 + +match[2] * 60 + +match[3]) * 1000) + +match[4]);
    }
  } else {
    const dialogueLines = content.split(/\r?\n/).filter((line) => /^Dialogue\s*:/i.test(line));
    lines = dialogueLines.length;
    for (const line of dialogueLines) {
      const fields = line.split(",");
      const end = fields[2]?.trim();
      const match = end?.match(/^(\d+):(\d{1,2}):(\d{1,2})[.:](\d{1,2})$/);
      if (match) endTime = Math.max(endTime, ((+match[1] * 3600 + +match[2] * 60 + +match[3]) * 1000) + +match[4] * 10);
    }
  }

  return { filename, lines, duration: formatDuration(endTime), sizeKB: (blob.size / 1024).toFixed(2), blob };
}

export default function MergeFilesPanel({ files = [], onAddFiles }: MergeProps) {
  const { showToast } = useToolToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMerging, setIsMerging] = useState(false);
  const [result, setResult] = useState<MergeMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasEnoughFiles = files.length >= 2;
  const outputFormat = (files[0]?.name.split(".").pop()?.toLowerCase() === "ass" ? "ass" : "srt") as SubtitleFormat;

  const handleMergeClick = async () => {
    if (!hasEnoughFiles) return;
    setIsMerging(true);
    setError(null);
    setResult(null);

    try {
      const merged = await mergeSubtitles(files, outputFormat);
      if (!merged.success || !merged.blob || !merged.filename) {
        const message = merged.error ?? "Merging failed.";
        setError(message);
        showToast({ type: "error", title: "Merge failed", message });
      } else {
        const metadata = await getMergedMetadata(merged.blob, merged.filename, outputFormat);
        setResult(metadata);
        showToast({
          type: "success",
          title: "Merge complete",
          message: `Successfully merged ${files.length} files into ${metadata.filename}.`,
        });
      }
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-foreground">Merge Configuration</h3>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
            <Plus className="size-3.5" /> Add file
          </button>
          <input ref={fileInputRef} type="file" multiple accept=".srt,.ass" onChange={(event) => onAddFiles?.(event.target.files)} className="hidden" />
        </div>

        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground">
              <GripHorizontal className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 min-w-0 truncate font-medium">{file.name}</span>
            </div>
          ))}
          {files.length === 0 && <div className="px-4 py-3 bg-background/50 border border-border border-dashed rounded-xl text-sm text-muted-foreground text-center">Awaiting files...</div>}
        </div>

        <div className="pt-4 flex flex-col items-center gap-3">
          <Button type="button" onClick={handleMergeClick} disabled={!hasEnoughFiles || isMerging}>
            {isMerging ? <Loader2 className="size-4 animate-spin" /> : <MergeIcon className="size-4" />}
            {isMerging ? "Merging..." : "Merge Files"}
          </Button>
          {files.length > 0 && !hasEnoughFiles && (
            <p className="text-xs text-destructive">Please select at least two files.</p>
          )}
          {error && <p className="flex items-center gap-1.5 text-xs text-destructive"><AlertCircle className="size-3.5" />{error}</p>}
        </div>
      </div>

      {result && (
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-primary tracking-tight">Merge Results</h3>
          <div className="space-y-3 text-sm text-foreground font-medium">
            <div className="flex gap-2"><span className="text-muted-foreground w-20">File:</span><span>{result.filename}</span></div>
            <div className="flex gap-2"><span className="text-muted-foreground w-20">Lines:</span><span>{result.lines.toLocaleString()}</span></div>
            <div className="flex gap-2"><span className="text-muted-foreground w-20">Duration:</span><span>{result.duration}</span></div>
            <div className="flex gap-2"><span className="text-muted-foreground w-20">Size:</span><span>{result.sizeKB} KB</span></div>
          </div>
          <div className="pt-4 flex justify-center">
            <Button type="button" onClick={handleDownload}><Download className="size-4" /> Download Merged File</Button>
          </div>
        </div>
      )}
    </div>
  );
}
