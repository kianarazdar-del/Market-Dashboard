"use client";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/format";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}
export function RefreshButton({ onClick, loading, className }: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-2 text-muted hover:text-slate-200 hover:border-border-bright transition-all",
        loading && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
      {loading ? "Refreshing…" : "Refresh"}
    </button>
  );
}
