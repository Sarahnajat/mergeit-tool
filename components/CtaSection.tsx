"use client"

import Link from "next/link"
import { FileText, FilePenLine, GlobeLock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MotionDiv } from "@/lib/motion"

export function CtaSection() {
  return (
    <section
      id="get-started"
      className="relative w-full overflow-hidden bg-background px-4 py-20 font-dmSans sm:px-6 sm:py-28 lg:px-8"
      aria-labelledby="cta-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_110%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.18em] text-primary"
            >
              <FilePenLine className="size-3.5" aria-hidden="true" />
              GET STARTED
            </Badge>

            <h2 className="text-balance text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              A faster way to manage your{" "}
              <span className="text-primary">subtitle</span> workflow.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              No downloads or account setup. Process SRT and ASS files directly
              in your browser.
            </p>
          </MotionDiv>
        </div>

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[1.75rem] border border-border/80 bg-card px-5 py-12 shadow-xl shadow-black/5 sm:px-10 sm:py-16 md:px-16 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -right-32 size-72 rounded-full bg-primary/10 blur-3xl"
          />

          <MotionDiv
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <Badge
              variant="secondary"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
            >
              <GlobeLock className="size-3.5" aria-hidden="true" />
              100% free · no sign-up
            </Badge>

            <h3
              id="cta-heading"
              className="text-balance text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Stop wrestling with <span className="text-primary">subtitle</span>{" "}
              files.
            </h3>

            <p className="mt-5 max-w-2xl text-pretty text-sm font-medium leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              Split, merge, or convert SRT and ASS files in seconds. Your files
              stay in your browser.
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center sm:w-auto">
              <Button
                asChild
                size="lg"
                className="h-12 w-full rounded-xl px-6 text-sm font-bold shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
              >
                <Link href="#features" aria-label="Open MergeIt subtitle tools">
                  <FileText className="mr-2 size-4" aria-hidden="true" />
                  Open subtitle tools
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
