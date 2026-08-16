'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandX, 
} from "@tabler/icons-react";
import { MotionDiv } from "@/lib/motion";

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface SimpleFooterProps {
  brandName?: string;
  brandHref?: string;
  tagline?: string;
  links?: FooterLink[];
  socialLinks?: SocialLink[];
  copyright?: string;
  className?: string;
}

export function FooterSection({
  brandName = "MergeIt",
  links = [],
  socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/sarahnajat",
      icon: IconBrandGithub,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/sarahnajat/",
      icon: IconBrandLinkedin,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/sarrahnajat",
      icon: IconBrandX,
    }
  ],
  copyright,
  className
}: SimpleFooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} ${brandName}. All rights reserved.`;

  return (
    <footer className={cn("border-t border-border/50 bg-background", className)}>
      <MotionDiv
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10"
      >
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:gap-4 md:text-left">
          {/* Left Content */}
          <p className="text-sm sm:text-md text-muted-foreground order-2 md:order-1">
            {copyrightText}
          </p>

          {/* Right Content */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 order-1 md:order-2">
            {links.length > 0 && (
              <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            )}

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4 sm:gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  const isExternal = social.href.startsWith('http');

                  return (
                    <Link
                      key={index}
                      href={social.href}
                      aria-label={social.name}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </MotionDiv>
    </footer>
  );
}