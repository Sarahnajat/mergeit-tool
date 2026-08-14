import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileQuestion, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--primary)/0.08,transparent_34%)]" />

      <section className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        <div className="relative mb-8 flex size-28 items-center justify-center rounded-[2rem] border border-primary/20 bg-primary/10">
          <Image
            src="/icon.svg"
            alt="MergeIt"
            width={68}
            height={68}
            priority
          />
          <span className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-md">
            <FileQuestion
              className="size-4"
              strokeWidth={2.25}
              aria-hidden="true"
            />
          </span>
        </div>

        <p className="font-mono text-xs font-bold tracking-[0.35em] text-primary">
          ERROR 404
        </p>

        <h1 className="mt-5 max-w-xl text-4xl font-black leading-[0.98] tracking-tighter text-foreground sm:text-6xl">
          This page went off track.
        </h1>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          The page may have moved, disappeared, or the link may be broken. Let’s
          get you back to your subtitle tools.
        </p>

        <div className="mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button
            asChild
            className="h-11 rounded-full px-6 font-semibold shadow-sm"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" aria-hidden="true" />
              Back to home
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full px-6 font-semibold"
          >
            <Link href="/#features">Browse tools</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
