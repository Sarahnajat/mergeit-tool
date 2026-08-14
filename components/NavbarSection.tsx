"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "./theme/ThemeToggle"
import { cn } from "@/lib/utils"
import { GithubIcon } from "@/components/animated/GithubAnimatedIcon"

type NavigationSection = {
  title: string
  href: string
}

const navigationData: NavigationSection[] = [
  { title: "About", href: "/about" },
  { title: "Usage Guide", href: "/#usage-guide" },
  { title: "Features", href: "/#features" },
  { title: "Preview", href: "/#preview" },
]

const githubUrl = "https://github.com/sarahnajat/mergeit"

function CollaborateButton({ className }: { className?: string }) {
  return (
    <Link
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open MergeIt on GitHub"
    >
      <Button
        className={cn(
          "group flex h-10 w-fit items-center gap-3 overflow-hidden rounded-full bg-primary pl-5 pr-1.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/95 hover:shadow-md",
          className,
        )}
      >
        <span>Star us on GitHub</span>
        <span className="flex size-7 items-center justify-center rounded-full bg-primary-foreground text-primary shadow-xs transition-transform duration-300 group-hover:scale-110">
          <GithubIcon />
        </span>
      </Button>
    </Link>
  )
}

function MobileNavigation({ onClose }: { onClose: () => void }) {
  return (
    <>
      {navigationData.map((item) => (
        <DropdownMenuItem
          key={item.title}
          className="rounded-xl p-0"
          onSelect={onClose}
        >
          <Link
            href={item.href}
            className="flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:text-primary"
          >
            {item.title}
          </Link>
        </DropdownMenuItem>
      ))}

      <DropdownMenuSeparator />

      <DropdownMenuItem className="rounded-xl p-0" onSelect={onClose}>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <span className="flex size-5 items-center justify-center">
            <GithubIcon />
          </span>
          Star us on GitHub
        </a>
      </DropdownMenuItem>
    </>
  )
}

export default function NavbarSection() {
  const [sticky, setSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [handleScroll, handleResize])

  return (
    <header className="sticky top-0 z-50 w-full bg-background/50 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        <nav
          aria-label="Main navigation"
          className={cn(
            "flex w-full items-center justify-between gap-3.5 transition-all duration-500 lg:gap-6",
            sticky
              ? "rounded-full border border-border bg-background/80 p-2.5 shadow-lg backdrop-blur-lg"
              : "border-transparent bg-transparent",
          )}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2"
            aria-label="MergeIt home"
          >
            <Image
              src="/icon.svg"
              alt="MergeIt logo"
              width={40}
              height={40}
              className="shrink-0"
              priority
            />
            <span className="text-lg font-black tracking-tighter text-foreground transition-colors hover:text-primary">
              Merge<span className="text-primary">It</span>
            </span>
          </Link>

          <NavigationMenu className="hidden rounded-full bg-muted p-0.5 lg:flex">
            <NavigationMenuList className="flex items-center gap-0">
              {navigationData.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    href={item.href}
                    className="rounded-full px-2 py-2 text-sm font-medium tracking-normal text-muted-foreground outline-transparent transition hover:bg-background hover:text-primary hover:outline-border hover:shadow-xs lg:px-4"
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
              <NavigationMenuItem>
                <ThemeToggle className="ms-1" />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <CollaborateButton className="hidden lg:flex" />

            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />

              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger
                  aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isOpen}
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground outline-none transition-colors hover:border-primary/40"
                >
                  <Menu className="size-5" aria-hidden="true" />
                  <span className="sr-only">
                    {isOpen ? "Close navigation menu" : "Open navigation menu"}
                  </span>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="mt-2 w-60 rounded-2xl border-border p-2"
                >
                  <MobileNavigation onClose={() => setIsOpen(false)} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
