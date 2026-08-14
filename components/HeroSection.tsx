"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  SquareChartGantt,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MotionDiv } from "@/lib/motion";
import RotatingText from "./animated/RotatingText";

export interface HeroSectionProps {
  badge?: {
    text: string;
    href?: string;
  };
  title?: string;
  description: string;
  features?: string[];
  primaryButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: ReactNode;
  }>;
  visualContent?: ReactNode;
  className?: string;
}

export function HeroSection({
  badge,

  description,
  features = [],
  primaryButton,
  secondaryButton,

  visualContent,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background pt-8 pb-20 md:pt-16 md:pb-32 font-dmSans ",
        className,
      )}
    >
      {/* Background Subtle Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column Content */}
          <div className="space-y-8 text-left">
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <Badge
                variant="secondary"
                className="px-3.5 py-1 text-xs font-mono font-bold tracking-widest bg-primary/10 border border-primary/20 text-primary rounded-full mb-4 inline-flex items-center gap-1.5"
              >
                <SquareChartGantt className="size-3.5" />
                MERGE & MANAGE
              </Badge>
              {/* Badge */}
              {badge && (
  <Badge
    variant="secondary"
    className="w-fit rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-mono font-bold tracking-[0.25em] text-primary"
  >
    {badge.text}
  </Badge>
)}


              {/* Title */}
              <h1 className="flex flex-col gap-2 text-5xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
              
                <span className="block">
                Easily   
                  <RotatingText
                    texts={["Convert", "Merge", "Split"]}
                    mainClassName="ml-3 overflow-hidden pb-1 text-primary"
                    staggerDuration={0.025}
                    splitBy="characters"
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 300,
                    }}
                    rotationInterval={2500}
                  />
                </span>
                <span className="block text-foreground">Subtitle files</span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            </MotionDiv>

            {/* Feature Checklist */}
            {features.length > 0 && (
              <MotionDiv
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="space-y-3.5"
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-[11px] font-semibold tracking-wider text-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </MotionDiv>
            )}

            {/* Action Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              {primaryButton && (
                <Button
                  size="lg"
                  onClick={primaryButton.onClick}
                  className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-6 text-xs font-bold tracking-wider text-primary-foreground shadow-sm transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]"
                >
                  {primaryButton.text}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              )}

              {secondaryButton && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-border px-8 py-6 text-xs font-bold tracking-wider text-foreground transition-all duration-300 hover:bg-muted"
                >
                  <a
                    href={secondaryButton.href ?? "#how-it-works"}
                    onClick={secondaryButton.onClick}
                  >
                    {secondaryButton.text}
                  </a>
                </Button>
              )}
            </MotionDiv>
          </div>

          {/* Right Column Visual */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full"
          >
            {visualContent ?? (
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted/50 to-muted/80 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />

                <div className="relative z-10 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                    <TrendingUp className="h-6 w-6 animate-pulse text-primary" />
                  </div>
                  <p className="text-xs font-mono font-bold tracking-wider text-muted-foreground">
                    System Visual Preview
                  </p>
                </div>

                <div className="absolute right-6 top-6 h-4 w-4 animate-ping rounded-full bg-primary/30 blur-sm" />
                <div className="absolute bottom-8 left-8 h-3 w-3 rounded-full bg-indigo-500/20 blur-sm" />
              </div>
            )}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
