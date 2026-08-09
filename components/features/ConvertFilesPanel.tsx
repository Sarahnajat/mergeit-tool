'use client'

import { useState } from 'react'
import { ArrowRightLeft as ConvertIcon, FileText, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { convertSubtitle, type SubtitleFormat } from '@/lib/Convert' 

interface ConvertProps {
  files?: File[]
}

interface ConvertedResult {
  originalName: string
  success: boolean
  blob?: Blob
  filename?: string
  error?: string
}

export default function ConvertFilesPanel({ files = [] }: ConvertProps) {
  const [isConverted, setIsConverted] = useState(false)
  const [targetFormat, setTargetFormat] = useState<SubtitleFormat>('ass') 
  const [preserveStyling, setPreserveStyling] = useState('yes')

 
  const [isConverting, setIsConverting] = useState(false)
  const [results, setResults] = useState<ConvertedResult[]>([])
  const [conversionError, setConversionError] = useState<string | null>(null)

  const hasFiles = files.length > 0
  const totalSizeKB = (files.reduce((total, file) => total + file.size, 0) / 1024).toFixed(2)
  const extTag = targetFormat.to()

  const handleConvertClick = async () => {
    if (!hasFiles) return

    setIsConverting(true)
    setConversionError(null)

    try {
      // Run conversion for every uploaded file
      const outcomes = await Promise.all(
        files.map(async (file) => {
          const result = await convertSubtitle(file, targetFormat)
          return {
            originalName: file.name,
            success: result.success,
            blob: result.success ? result.blob : undefined,
            filename: result.success ? result.filename : undefined,
            error: result.success ? undefined : result.error,
          }
        })
      )

      setResults(outcomes)
      setIsConverted(true)
    } catch (err) {
      setConversionError(err instanceof Error ? err.message : 'Conversion failed')
    } finally {
      setIsConverting(false)
    }
  }


  const handleDownload = () => {
    results.forEach((result) => {
      if (!result.success || !result.blob || !result.filename) return

      const url = URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="space-y-4 w-full">

      <div className={cn("w-full", isConverted && "grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch")}>
        {/* 1. CONVERT CONFIGURATION CARD */}
        <Card className="rounded-3xl shadow-sm border border-border flex flex-col justify-between">
          <CardHeader className="p-6 sm:p-8 pb-4 sm:pb-4">
            <CardTitle className="text-sm font-bold  tracking-wider">
              Convert Configuration
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0 space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              {files.map((file, index) => {
                const inputExt = file.name?.includes('.')
                  ? file.name.split('.').pop()?.to()
                  : 'SRT'
                const fileSize = (file.size / 1024).toFixed(2)

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3.5 p-3.5 bg-background border border-border rounded-2xl transition-colors hover:border-primary/30"
                  >
                    <div className="relative flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                      <FileText className="size-5 text-primary" />
                      <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary  bg-background px-1 rounded-sm border border-primary/30 shadow-xs">
                        {inputExt}
                      </span>
                    </div>
                    <div className="min-w-0 text-left flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        {fileSize} KB
                      </p>
                    </div>
                  </div>
                )
              })}
              {files.length === 0 && (
                <div className="px-4 py-3 bg-background/50 border border-border border-dashed rounded-xl text-sm text-muted-foreground text-center">
                  Awaiting files...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest block">
                  Target Format
                </label>
                {/* CHANGED: values now match SubtitleFormat ("ass" / "srt"), no leading dot */}
                <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as SubtitleFormat)}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-border bg-background">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ass">Advanced SubStation (.ass)</SelectItem>
                    <SelectItem value="srt">SubRip (.srt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest block">
                  Preserve Styling
                </label>
                <Select value={preserveStyling} onValueChange={setPreserveStyling}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-border bg-background">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes (Default)</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <Button
                type="button"
                onClick={handleConvertClick}
                disabled={!hasFiles || isConverting}
                className="w-full sm:w-auto px-8 h-12 text-xs font-bold tracking-widest rounded-xl shadow-md shadow-primary/20 active:scale-95"
              >
                {isConverting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ConvertIcon className="size-4" />
                )}
                {isConverting ? 'Converting...' : `Convert to ${extTag}`}
              </Button>

              {!hasFiles && (
                <p className="flex items-center gap-1.5 text-xs text-destructive font-medium tracking-wide">
                  <AlertCircle className="size-3.5" />
                  Please select a file to convert
                </p>
              )}

              {conversionError && (
                <p className="flex items-center gap-1.5 text-xs text-destructive font-medium tracking-wide">
                  <AlertCircle className="size-3.5" />
                  {conversionError}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. CONVERT RESULTS CARD */}
        {isConverted && (
          <Card className="rounded-3xl shadow-sm bg-primary/5 border-primary/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

            <CardHeader className="p-6 sm:p-8 pb-4 sm:pb-2 relative z-10">
              <CardTitle className="text-lg font-black text-primary tracking-tight">
                Convert Results
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0 space-y-6 relative z-10 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
           
                {results.map((result, idx) => {
                  const fileSize = result.blob ? (result.blob.size / 1024).toFixed(2) : '0.00'

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-background/80 border border-border/60 rounded-2xl"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                          <FileText className="size-5 text-primary" />
                          <span className="absolute -bottom-1 text-[8px] font-mono font-bold text-primary  bg-background px-1 rounded-sm border border-primary/30 shadow-xs">
                            {extTag}
                          </span>
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {result.success ? result.filename : result.originalName}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                            {result.success ? (
                              <>
                                <span className="font-mono">{fileSize} KB</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-semibold text-primary">
                                  <CheckCircle2 className="size-3 text-primary" />
                                  Converted
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1 font-semibold text-destructive">
                                <AlertCircle className="size-3" />
                                {result.error || 'Failed'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 flex justify-center">
                <Button
                  type="button"
                  onClick={handleDownload}
                  disabled={!results.some((r) => r.success)}
                  className="w-full sm:w-auto px-8 h-12 text-xs font-bold tracking-widest rounded-xl shadow-md shadow-primary/20 active:scale-95"
                >
                  <Download className="size-4" />
                  Download {results.length > 1 ? 'Converted Files' : 'Converted File'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  )
}