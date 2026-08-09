"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "./theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { TextAlignJustify } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { GithubIcon } from "@/components/animated/GithubAnimatedIcon";
export type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  {
    title: "About",
    href: "#",
  },
  {
    title: "Usage Guide",
    href: "#",
  },
  {
    title: "Features",
    href: "#",
  },
  {
    title: "Tools",
    href: "#",
  },
];

const CollaborateButton = ({ className }: { className?: string }) => (
  <Button
    className={cn(
      "relative text-sm font-semibold rounded-full h-10 pl-5 pr-1.5 group transition-all duration-300 w-fit overflow-hidden bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer",
      className,
    )}
  >
    <span className="relative z-10">Star us on Github</span>

    <div
      className="
        relative z-10
        w-7 h-7
        bg-primary-foreground
        text-primary
        rounded-full
        flex items-center justify-center
        shadow-xs
        transition-transform duration-300
        group-hover:scale-110
      "
    >
      <GithubIcon />
    </div>
  </Button>
);
const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/50 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto w-full px-4 py-4 sm:px-6">
        <nav
          className={cn(
            "w-full flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500",
            sticky
              ? "p-2.5 bg-background/80 backdrop-blur-lg border border-border shadow-lg rounded-full"
              : "bg-transparent border-transparent",
          )}
        >
          {/* Logo Brand Link */}
          <a
            href="#"
            className="text-lg font-black tracking-tighter text-foreground hover:text-primary  transition-colors pl-4"
          >
            mergeit
          </a>

          {/* Navigation Menu */}
          <div>
            <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
              <NavigationMenuList className="flex items-center gap-0">
                {navigationData.map((navItem) => (
                  <NavigationMenuItem key={navItem.title}>
                    <NavigationMenuLink
                      href={navItem.href}
                      className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-primary hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal"
                    >
                      {navItem.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <ThemeToggle className="ms-1" />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            <CollaborateButton className="hidden lg:flex" />

            {/* Mobile Dropdown Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors hover:border-primary/40">
                  <TextAlignJustify size={20} className="text-foreground" />
                  <span className="sr-only">Menu</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 mt-2 rounded-2xl border border-border"
                >
                  {navigationData.map((item) => (
                    <DropdownMenuItem key={item.title} className="rounded-xl">
                      <a
                        href={item.href}
                        className="w-full cursor-pointer text-sm font-medium hover:text-primary transition-colors"
                      >
                        {item.title}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
