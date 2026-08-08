'use client'

import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { SplitSquareHorizontal, Merge, ArrowRightLeft } from 'lucide-react'
import { FileDropzone } from './FileDropzone'
import { MotionDiv } from "@/lib/motion"
import SplitFilesPanel from '@/components/features/SplitFilesPanel'
import { UploadedFileList } from './UploadFileList'
import MergeFilesPanel from './features/MergeFilesPanel'
import ConvertFilesPanel from './features/ConvertFilesPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type ToolId = 'split' | 'merge' | 'Convert'

const tools: {
  id: ToolId
  title: string
  label: string
  color: string
  icon: typeof SplitSquareHorizontal
  dropzoneLabel: string
  multiple: boolean
}[] = [
  {
    id: 'split',
    title: 'Split',
    label: 'Break Files Apart',
    color: 'from-chart-1/20',
    icon: SplitSquareHorizontal,
    dropzoneLabel: 'Upload an SRT file to split',
    multiple: false,
  },
  {
    id: 'merge',
    title: 'Merge',
    label: 'Combine Into One',
    color: 'from-chart-1/20',
    icon: Merge,
    dropzoneLabel: 'Upload SRT files to merge',
    multiple: true,
  },
  {
    id: 'Convert',
    title: 'Convert',
    label: 'ASS ↔ SRT Converter',
    color: 'from-chart-1/20',
    icon: ArrowRightLeft,
    dropzoneLabel: 'Upload a subtitle file to switch formats',
    multiple: false,
  },
]

export const FeaturesSection = () => {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const active = tools.find((t) => t.id === activeTool)

  const handleCardClick = (id: ToolId) => {
    setActiveTool((prev) => (prev === id ? null : id))
    setFiles([])
  }

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return
    const validSubtitleFiles = Array.from(fileList).filter((f) => 
      /\.(srt|ass|vtt|txt)$/i.test(f.name)
    )
    setFiles(active?.multiple ? [...files, ...validSubtitleFiles] : validSubtitleFiles.slice(0, 1))
  }

  // This function deletes a file when you click the trash can
  const handleRemoveFile = (fileNameToRemove: string) => {
    setFiles((prevFiles) => prevFiles.filter(f => f.name !== fileNameToRemove))
  }

  return (
    <section className="bg-background py-16 sm:py-24 md:py-32 px-4 sm:px-6 min-h-screen font-dmSans relative overflow-hidden">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-40 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-12 border-b border-border pb-8 sm:pb-12"
        >
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">
              <span className="text-primary">Three</span> Tools.
              <br />
              One File Type.
            </h2>
          </div>
          <p className="mt-6 max-w-xs text-muted-foreground font-mono text-xs sm:text-sm leading-relaxed tracking-widest">
            To split, merge, and Convert SRT files. built for speed and precision.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tools.map((card, index) => (
            <MotionDiv
              key={card.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                onClick={() => handleCardClick(card.id)}
                className={cn(
                  'group relative text-left rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 border',
                  activeTool === card.id
                    ? 'border-primary ring-2 ring-primary/30 shadow-lg'
                    : 'border-border hover:border-primary/40 hover:shadow-md'
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
                    card.color
                  )}
                />
                <CardContent className="relative z-10 p-8 sm:p-10 lg:p-12 space-y-12 sm:space-y-16">
                  <div className="size-12 sm:size-14 rounded-2xl bg-accent flex items-center justify-center shrink-0">
                    <card.icon className="size-5 sm:size-6 text-accent-foreground" />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <span className="text-[10px] font-mono text-muted-foreground tracking-[0.3em] block">
                      {card.label}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-card-foreground uppercase tracking-tighter">
                      {card.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </div>

        {/*  Active Dropzone Slide-in Animation */}
        {active && (
          <MotionDiv
            key={activeTool}
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
                label={active.dropzoneLabel}
                multiple={active.multiple}
              />
            ) : (
              <MotionDiv
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                <UploadedFileList files={files} onRemove={handleRemoveFile} />

                {activeTool === 'split' && <SplitFilesPanel files={files} />}
                {activeTool === 'merge' && <MergeFilesPanel files={files} onAddFiles={handleFileSelect} />}
                {activeTool === 'Convert' && <ConvertFilesPanel files={files} />}
                
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
        )}
      </div>
    </section>
  )
}