"use client"

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { MotionDiv } from "@/lib/motion";
import RotatingText from './animated/RotatingText';

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
    icon?: React.ReactNode;
  }>;
  visualContent?: React.ReactNode;
  className?: string;
}

export function HeroSection({
  badge,
  title,
  description,
  features = [],
  primaryButton,
  secondaryButton,
  stats = [],
  visualContent,
  className
}: HeroSectionProps) {
  const handlePrimaryClick = () => {
    if (primaryButton?.href) {
      window.open(primaryButton.href, '_blank');
    }
    primaryButton?.onClick?.();
  };

  const handleSecondaryClick = () => {
    if (secondaryButton?.href) {
      window.open(secondaryButton.href, '_blank');
    }
    secondaryButton?.onClick?.();
  };

  return (
    <section className={cn("py-20 md:py-32 bg-background font-dmSans relative overflow-hidden", className)}>
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,var(--border)_0px_1px,transparent_1px_8px)] opacity-30 mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column Content */}
          <div className="space-y-8 text-left">
            
            {/* Badge & Title Header */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Monospace Uppercase Badge */}
              {badge && (
                <Badge 
                  variant="secondary" 
                  className="w-fit px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.25em] bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all rounded-full cursor-pointer"
                  onClick={() => badge.href && window.open(badge.href, '_blank')}
                >
                  {badge.text}
                </Badge>
              )}

              {/* Bold Capitalized Title with Dynamic Rotating Text */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-foreground uppercase leading-[0.95] flex flex-col gap-2">
                <span className="block">
                  <RotatingText
                    texts={["Convert", "Merge", "Split"]}
                    mainClassName="text-primary overflow-hidden pb-1"
                    staggerDuration={0.025}
                    splitBy="characters"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    rotationInterval={2500}
                  />
                </span>
                <span className="block text-foreground">
                  srt files
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
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
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-semibold tracking-wide text-foreground uppercase tracking-wider font-mono text-[11px]">
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
              className="flex flex-col sm:flex-row gap-4"
            >
              {primaryButton && (
                <Button
                  size="lg"
                  onClick={handlePrimaryClick}
                  className="px-8 py-6 rounded-full text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-sm"
                >
                  {primaryButton.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              {secondaryButton && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSecondaryClick}
                  className="px-8 py-6 rounded-full text-xs font-bold uppercase tracking-wider border-border hover:bg-muted text-foreground transition-all duration-300"
                >
                  {secondaryButton.text}
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
            {visualContent ? (
              visualContent
            ) : (
              <div className="relative bg-gradient-to-br from-muted/50 to-muted/80 rounded-3xl border border-border aspect-[4/3] flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
                
                <div className="relative text-center p-8 z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    System Visual Preview
                  </p>
                </div>
                
                <div className="absolute top-6 right-6 w-4 h-4 bg-primary/30 rounded-full blur-xs animate-ping" />
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-indigo-500/20 rounded-full blur-xs" />
              </div>
            )}
          </MotionDiv>

        </div>
      </div>
    </section>
  );
}