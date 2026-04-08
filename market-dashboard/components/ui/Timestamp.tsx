"use client";
import { Clock } from "lucide-react";
import { formatTimestamp } from "@/lib/format";

export function Timestamp({ ts }: { ts: number }) {
  if (!ts) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-slate-500">
      <Clock size={11} />
      Updated {formatTimestamp(ts)}
    </span>
  );
}
