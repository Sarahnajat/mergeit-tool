'use client'

import React, { useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Radio, FileText } from 'lucide-react'
import { MotionDiv } from '@/lib/motion'

export function CtaSection() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onChooseFile = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log('Selected file:', file.name)
  }

  return (
    <section
      className="bg-background relative w-full overflow-hidden py-20 sm:py-28 px-6 sm:px-8 lg:px-12 font-dmSans"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-30 mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)] pointer-events-none" />

      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="relative mx-auto max-w-4xl text-center bg-card rounded-[2rem] border border-border shadow-2xl px-6 py-16 sm:px-10 sm:py-20 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center px-2"
          >
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-2 px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 text-primary rounded-full mb-4"
            >
              <Radio className="h-3.5 w-3.5" aria-hidden="true" />
              100% Free, No Sign-up
            </Badge>

            <h2
              id="cta-heading"
              className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground uppercase leading-tight max-w-3xl"
            >
              Stop wrestling with <span className="text-primary">subtitle</span> files
            </h2>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="px-4"
          >
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              Split, merge, or convert SRT files in seconds. Nothing leaves your browser.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10 px-4"
          >
            <input
              ref={fileInputRef}
              id="srt-upload"
              type="file"
              accept=".srt,text/plain"
              onChange={onFileChange}
              className="sr-only"
            />

            <Button
              onClick={onChooseFile}
              size="lg"
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground transition-shadow duration-200 shadow-sm"
              aria-label="Upload SRT file"
            >
              <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
              Upload SRT File
            </Button>

            <Button
              variant="outline"
              size="lg"
            
              className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider border-border hover:bg-muted text-foreground transition-colors duration-200"
            >
              <a href="#how-it-works" aria-label="See how it works">
                or See how it works
                <ArrowRight className="ml-2 h-4 w-4 inline" aria-hidden="true" />
              </a>
            </Button>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}

export default CtaSection