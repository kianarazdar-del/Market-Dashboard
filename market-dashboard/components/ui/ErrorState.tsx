"use client";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}
export function ErrorState({ message = "Failed to load data", onRetry }: ErrorStateProps) {
  return (
    <div className="card p-8 flex flex-col items-center justify-center gap-3 text-center">
      <AlertTriangle className="text-amber-500" size={28} />
      <p className="text-slate-300 font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors mt-1">
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
