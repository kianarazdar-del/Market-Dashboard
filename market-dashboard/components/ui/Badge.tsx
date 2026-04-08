"use client";

import { cn } from "@/lib/format";

interface BadgeProps {
  value: number | null;
  size?: "sm" | "md";
  showSign?: boolean;
}

export function ReturnBadge({ value, size = "md", showSign = true }: BadgeProps) {
  if (value === null || value === undefined) {
    return <span className={cn("num rounded px-2 py-0.5 bg-neutral text-surface-1 font-medium", size === "sm" ? "text-xs" : "text-sm")}>N/A</span>;
  }
  const isUp = value >= 0;
  return (
    <span className={cn(
      "num rounded px-2 py-0.5 font-semibold inline-block",
      isUp ? "bg-up-bg text-up" : "bg-down-bg text-down",
      size === "sm" ? "text-xs" : "text-sm"
    )}>
      {showSign && (isUp ? "+" : "")}{value.toFixed(2)}%
    </span>
  );
}

export function ChangeBadge({ value, size = "md" }: BadgeProps) {
  return <ReturnBadge value={value} size={size} showSign />;
}

export function SectorBadge({ label }: { label: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded bg-surface-3 text-muted border border-border-soft">
      {label}
    </span>
  );
}
