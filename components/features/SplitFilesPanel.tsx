"use client"

import { useState } from 'react'
import { SplitSquareHorizontal, Download } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SplitMethods = [
  { label: "By time duration", value: "By time duration" },
  { label: "By number of lines", value: "By number of lines" },
  { label: "By number of files", value: "By number of files" },
]

interface SplitFilesProps {
  files?: File[]
}

export default function SplitFilesPanel({ files = [] }: SplitFilesProps) {
  const [isSplit, setIsSplit] = useState(false)
  const fileCount = files.length
  const totalSizeKB = (files.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(2)

  const handleSplitClick = () => {
    setIsSplit(true)
  }

  const baseFileName = files[0]?.name 
    ? files[0].name.substring(0, files[0].name.lastIndexOf('.')) || files[0].name
    : 'subtitle_file'

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center px-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
        <span>Files: {fileCount}</span>
        <span>Total Size: {totalSizeKB} KB</span>
      </div>

      <Card className="rounded-3xl shadow-sm border border-border">
        <CardHeader className="p-6 sm:p-8 pb-4 sm:pb-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
            Split Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <label className="h-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground block">
                Split Method
              </label>
              
              <Select defaultValue="By time duration">
                <SelectTrigger className="h-12 min-h-12 w-full px-4 py-0 rounded-xl border border-border bg-background">
                  <SelectValue placeholder="Select a split method" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  {SplitMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value} className="rounded-sm">
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-left">
              <label className="h-4 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground block">
                Split into this many files
              </label>
              <Input
                type="number"
                defaultValue={10}
                className="h-12 w-full rounded-xl border-border bg-background px-4 text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <Button
              type="button"
              onClick={handleSplitClick}
              disabled={fileCount === 0}
              className="flex items-center justify-center gap-2 px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SplitSquareHorizontal className="size-4" />
              Split Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {isSplit && (
        <Card className="rounded-3xl shadow-sm bg-primary/5 border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

          <CardHeader className="p-6 sm:p-8 pb-4 sm:pb-2 relative z-10">
            <CardTitle className="text-lg font-black text-primary tracking-tight">
              Split Results
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0 space-y-6 relative z-10">
            <div className="space-y-2.5 text-sm text-foreground font-medium">
              <div className="flex flex-col sm:flex-row sm:gap-4 text-xs font-mono text-muted-foreground uppercase pb-1 border-b border-border/40">
                <span>Output Files (2 generated)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/80 border border-border/60 rounded-xl">
                <span className="truncate font-medium">{baseFileName}_part1.srt</span>
                <span className="text-xs font-mono text-muted-foreground shrink-0">42.97 KB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background/80 border border-border/60 rounded-xl">
                <span className="truncate font-medium">{baseFileName}_part2.srt</span>
                <span className="text-xs font-mono text-muted-foreground shrink-0">42.97 KB</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Button
                type="button"
                className="flex items-center justify-center gap-2 px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md shadow-primary/20 active:scale-95"
              >
                <Download className="size-4" />
                Download Split Files (.ZIP)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}