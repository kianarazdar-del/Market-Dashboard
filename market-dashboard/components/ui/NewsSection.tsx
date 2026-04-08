"use client";
import { ExternalLink, Newspaper } from "lucide-react";
import { timeAgo } from "@/lib/format";
import type { NewsItem } from "@/types/market";

export function NewsSection({ items, title = "Recent News" }: { items: NewsItem[]; title?: string }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Newspaper size={12} /> {title}
      </h3>
      <div className="space-y-2">
        {items.map((n, i) => (
          <a
            key={i}
            href={n.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 p-3 rounded-lg bg-surface-2 border border-border-soft hover:border-border-bright hover:bg-surface-3 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 group-hover:text-white leading-snug line-clamp-2">{n.title}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-slate-500">{n.source}</span>
                <span className="text-slate-700">·</span>
                <span className="text-xs text-slate-500">{timeAgo(n.publishedAt)}</span>
              </div>
              {n.summary && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.summary}</p>}
            </div>
            <ExternalLink size={12} className="text-slate-600 group-hover:text-slate-400 mt-0.5 shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
