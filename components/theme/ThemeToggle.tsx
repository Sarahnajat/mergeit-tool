"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors hover:bg-muted",
        className
      )}
    >
      <Sun className="size-[18px] dark:hidden" />
      <Moon className="size-[18px] hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}