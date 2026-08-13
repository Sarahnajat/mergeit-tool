'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import type React from 'react';
import type { RefObject } from 'react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleBoxClick: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileSelect: (files: FileList | null) => void;
  label?: string;
  multiple?: boolean;
}

export function FileDropzone({
  fileInputRef,
  handleBoxClick,
  handleDragOver,
  handleDrop,
  handleFileSelect,
  label = "Choose a file or drag & drop it here",
  multiple = false,
}: FileDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDropLocal = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleDrop(e);
  };

  return (
    <div className="px-6">
      <div
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300",
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/40 bg-card"
        )}
        onClick={handleBoxClick}
        onDragEnter={handleDrag}
        onDragOver={(e) => {
          handleDrag(e);
          handleDragOver(e);
        }}
        onDragLeave={handleDrag}
        onDrop={handleDropLocal}
      >
        <div className={cn(
          "mb-4 rounded-full border p-3 transition-colors duration-300",
          isDragActive 
            ? "border-primary/30 bg-primary/20 text-primary" 
            : "border-primary/10 bg-primary/5 text-primary"
        )}>
          <UploadCloud className="h-6 w-6 text-primary" />
        </div>
        
        <p className="font-semibold text-foreground text-base">
          {label}
        </p>
        
        <p className="mt-1 text-muted-foreground text-sm">
          {multiple ? "SRT or ASS format, upload one or more files." : "SRT or ASS format, single file up to 10 MB."}
        </p>
        
        <label
          className="mt-5 cursor-pointer rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90 shadow-sm transition-colors"
          htmlFor="fileUpload"
          onClick={(e) => e.stopPropagation()}
        >
          Browse File
        </label>
        
        <input
           accept=".srt,.ass"
          className="hidden"
          id="fileUpload"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          ref={fileInputRef}
          type="file"
        />
      </div>
    </div>
  );
}