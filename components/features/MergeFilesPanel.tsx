'use client'

import { useState, useRef } from 'react'
import { Merge as MergeIcon, GripHorizontal, Download, Plus } from 'lucide-react'

interface MergeProps {
  files?: File[]
  onAddFiles?: (files: FileList | null) => void
}

export default function MergeFilesPanel({ files = [], onAddFiles }: MergeProps) {
  const [isMerged, setIsMerged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const hasEnoughFiles = files.length >= 2;
  
  const totalSizeKB = (files.reduce((total, file) => total + file.size, 0) / 1024).toFixed(2);

  const handleMergeClick = () => {
    setIsMerged(true);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onAddFiles) {
      onAddFiles(e.target.files);
    }
  }

  return (
    <div className="space-y-6">
      
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Merge Configuration
          </h3>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Plus className="size-3.5" />
            Add file
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".srt,.ass,.vtt"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground transition-colors hover:border-primary/30"
            >
              <GripHorizontal className="size-4 shrink-0 text-muted-foreground cursor-grab active:cursor-grabbing hover:text-foreground" />
              <span className="flex-1 min-w-0 truncate font-medium">{file.name}</span>
            </div>
          ))}

          {files.length < 2 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-primary/5 hover:bg-primary/10 border border-dashed border-primary/30 rounded-xl text-xs font-bold uppercase tracking-wider text-primary flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="size-4" />
              Add another file to merge
            </button>
          )}

          {files.length === 0 && (
            <div className="px-4 py-3 bg-background/50 border border-border border-dashed rounded-xl text-sm text-muted-foreground text-center">
              Awaiting files...
            </div>
          )}
        </div>

        <div className="pt-4 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleMergeClick}
            disabled={!hasEnoughFiles}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:text-primary-foreground/50 disabled:cursor-not-allowed text-primary-foreground text-xs font-bold tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-primary/20 active:scale-95"
          >
            <MergeIcon className="size-4" />
            Merge Files
          </button>
          
          {/* Error Message */}
          {!hasEnoughFiles && (
            <p className="text-xs text-destructive font-medium tracking-wide">
              Please select more than one file to merge
            </p>
          )}
        </div>
      </div>

      {isMerged && (
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
          
          <h3 className="text-lg font-black text-primary tracking-tight">
            Merge Results
          </h3>
          
          <div className="space-y-3 text-sm text-foreground font-medium relative z-10">
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20">File:</span> 
              <span>merged.srt</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20">Lines:</span> 
              <span>Calculating...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20">Duration:</span> 
              <span>Calculating...</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20">Size:</span> 
              <span>{totalSizeKB} KB</span>
            </div>
          </div>

          <div className="pt-4 flex justify-center relative z-10">
            <button
              type="button"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-primary/20 active:scale-95"
            >
              <Download className="size-4" />
              Download Merged File
            </button>
          </div>
        </div>
      )}

    </div>
  )
}