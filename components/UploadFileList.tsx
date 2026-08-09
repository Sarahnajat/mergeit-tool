"use client";

import { FileText, X, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
interface UploadedFileListProps {
  files: File[];
  onRemove: (fileName: string) => void;
}

export function UploadedFileList({ files, onRemove }: UploadedFileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3 w-full">
      {files.map((file) => {
        // Calculate file size in KB
        const sizeInKB = (file.size / 1024).toFixed(2);

        return (
          <div
            key={file.name}
            className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-sm transition-all hover:border-primary/40"
          >
            {/* the file info */}
            {(() => {
              // Extract extension dynamically from file.name (e.g. "ass", "srt")
              const fileExt = file.name?.includes(".")
                ? file.name.split(".").pop()?.to() || "FILE"
                : "FILE";

              return (
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-background border border-border shrink-0">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="size-5 text-muted-foreground mb-0.5" />
                      <span className="text-[9px] font-bold font-mono text-primary  bg-primary/10 px-1.5 rounded-sm tracking-wider">
                        {fileExt}
                      </span>
                    </div>
                  </div>

                  {/* File details */}
                  <div className="space-y-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-foreground leading-none truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                      <span>{sizeInKB} KB</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <Button
              onClick={() => onRemove(file.name)}
              className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors"
              title="Remove file"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
