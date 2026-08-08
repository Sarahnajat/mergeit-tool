'use client'

import {Zap, SplitSquareHorizontal, Merge, LockKeyhole, Sparkles } from 'lucide-react'
import { MotionDiv } from "@/lib/motion"
import { Badge } from '@/components/ui/badge'
import NavbarSection from "@/components/NavbarSection";
import { FooterSection } from "@/components/FooterSection"; 
const features = [
  {
    icon: SplitSquareHorizontal,
    title: 'Precision Splitting',
    description: 'Break down large subtitle files by exact time duration, specific line counts, or evenly into multiple files.',
  },
  {
    icon: Merge,
    title: 'Seamless Merging',
    description: 'Combine multiple subtitle tracks into one flawlessly timed file without losing formatting or sync.',
  },
  {
    icon: LockKeyhole,
    title: '100% Private',
    description: 'Everything happens locally right inside your browser. Your files never touch our servers.',
  },
  {
    icon: Zap,
    title: 'Free & Instant',
    description: 'No registration walls, no hidden fees, and no file size limits. Just drop your files and get to work.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background py-32 px-6 font-dmSans relative overflow-hidden">
      <NavbarSection />
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-30 mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-24 relative z-10">
        
        {/* HEADER SECTION */}
        <section className="text-center space-y-8 max-w-3xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge 
              variant="secondary" 
              className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 text-primary rounded-full mb-6"
            >
              About Our Tools
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase leading-[0.95] mb-6">
              Subtitle Management, <br className="hidden sm:block" />
              <span className="text-muted-foreground">Simplified.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We understand the headaches of working with subtitle files. That’s why we built a suite of simple, blazing-fast tools designed specifically for content creators, translators, and video editors to save time and effort.
            </p>
          </MotionDiv>
        </section>

        {/* CORE PILLARS GRID */}
        <section>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <MotionDiv
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card border border-border rounded-3xl p-8 hover:border-primary/40 transition-colors"
              >
                <div className="size-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-6">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* COMMITMENT BANNER */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-10 md:p-16 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
            
            <Sparkles className="size-8 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Our Commitment
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are constantly refining our tools based on your feedback. Our ultimate goal is to provide the most reliable, secure, and user-friendly SRT management platform on the web.
            </p>
            <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest pt-4">
              Last updated: September 2025
            </p>
          </div>
        </MotionDiv>

      </div>
      <FooterSection />
    </main>
  )
}