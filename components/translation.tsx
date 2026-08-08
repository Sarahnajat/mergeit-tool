import React from 'react';
import { ArrowRight, CheckCircle, Clock, FileText, Globe, Sparkles, Sliders, Check } from 'lucide-react';

export interface HeroSectionProps {
  badge?: {
    text: string;
    href?: string;
  };
  title: string;
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
  className = '',
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
    <div className={`py-12 md:py-20 text-slate-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content Column */}
          <div className="space-y-8">
            {/* Badge */}
            {badge && (
              <button
                type="button"
                onClick={() => badge.href && window.open(badge.href, '_blank')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/30 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge.text}</span>
              </button>
            )}

            {/* Main Title & Description */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.15]">
                {title}
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                {description}
              </p>
            </div>

            {/* Features List */}
            {features.length > 0 && (
              <div className="space-y-3 pt-1">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-emerald-400 stroke-[3]" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {primaryButton && (
                <button
                  type="button"
                  onClick={handlePrimaryClick}
                  className="px-7 py-3.5 rounded-2xl text-sm font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/15 cursor-pointer"
                >
                  <span>{primaryButton.text}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {secondaryButton && (
                <button
                  type="button"
                  onClick={handleSecondaryClick}
                  className="px-7 py-3.5 rounded-2xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{secondaryButton.text}</span>
                </button>
              )}
            </div>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2 text-sky-400">
                      {stat.icon}
                      <span className="text-2xl font-bold font-mono text-slate-100">{stat.value}</span>
                    </div>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Visual Column (Authentic Product UI Workbench - No AI Slop) */}
          <div className="relative">
            {visualContent ? (
              visualContent
            ) : (
              <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 overflow-hidden">
                {/* Simulated Window Control Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-xs text-slate-400">subtitle_joiner_preview.srt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      23.976 &rarr; 25.0 FPS
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold">
                      Bilingual Active
                    </span>
                  </div>
                </div>

                {/* Simulated Cue 1 Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-400 font-bold">#001 &bull; 00:01:04.200 &rarr; 00:01:07.800</span>
                    <span className="text-slate-500">14.2 cps &bull; 3.6s</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-100">Welcome back to today's breakdown.</p>
                    <p className="text-amber-400 font-sans">Bienvenidos al desglose de hoy.</p>
                  </div>
                </div>

                {/* Simulated Cue 2 Card */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-400 font-bold">#002 &bull; 00:01:08.100 &rarr; 00:01:12.400</span>
                    <span className="text-slate-500">16.8 cps &bull; 4.3s</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-slate-100">We've updated the timeline sync tools for high accuracy.</p>
                    <p className="text-amber-400 font-sans">Hemos actualizado la sincronización para mayor precisión.</p>
                  </div>
                </div>

                {/* Simulated Interactive Control Bar */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Time Shift: +0.250s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] text-slate-300 font-bold">Zero Overlaps</span>
                  </div>
                </div>

                {/* Floating Accent Badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 px-4 py-2 rounded-2xl font-bold text-xs shadow-xl flex items-center gap-1.5 transform rotate-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Dual Track Render Engine</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}