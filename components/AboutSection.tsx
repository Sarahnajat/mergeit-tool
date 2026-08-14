"use client"

import React from "react"
import { MotionDiv } from "@/lib/motion"
import { SplitIcon, MergeIcon, File} from "lucide-react" 

// Define benefits as an array of objects
const benefits = [
  {
    icon: SplitIcon,
    eyebrow: "Split",
    title: "Split SRT & ASS Files",
    description: "Break SRT or ASS subtitles into smaller parts for easier editing and syncing.",
  },
  {
    icon: MergeIcon,
    eyebrow: "Merge",
    title: "Merge SRT & ASS Files",
    description: "Combine multiple SRT or ASS subtitle files into one seamless track.",
  },
  {
    icon: File,
    eyebrow: "Convert",
    title: "Convert files",
    description: "Easily convert between subtitle formats such as ASS and SRT for maximum compatibility.",
  },
  
]

export default function AboutSection() {
  return (
    <section className="space-y-8">
     
      <div className="grid gap-5 md:grid-cols-3">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon

          return (
            <MotionDiv
              key={benefit.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40"
            >
              <div className="mb-8 flex size-11 items-center justify-center rounded-xl border border-border bg-background text-primary transition-colors group-hover:border-primary/40">
                <Icon className="size-5" />
              </div>
              <p className="font-mono text-[10px] font-bold tracking-[0.16em] text-primary">
                {benefit.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </MotionDiv>
          )
        })}
      </div>
    </section>
  )
}
