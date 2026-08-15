"use client";

import { cn } from "@/lib/utils";

export type OptionListItem<T extends string> = {
  value: T;
  label: string;
};

type OptionListProps<T extends string> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: OptionListItem<T>[];
  name: string;
};

export function OptionList<T extends string>({
  label,
  value,
  onChange,
  options,
  name,
}: OptionListProps<T>) {
  return (
    <fieldset className="space-y-2 text-left">
      <legend className="text-[10px] font-mono font-bold tracking-[0.25em] text-muted-foreground">
        {label}
      </legend>
      <div role="radiogroup" aria-label={label} className="flex flex-col gap-2">
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onChange(option.value)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                selected
                  ? "border-primary bg-primary/10 font-semibold text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
