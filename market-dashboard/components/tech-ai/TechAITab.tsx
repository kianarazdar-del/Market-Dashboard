"use client";
import { useState, useEffect, useCallback } from "react";
import { TechSummaryBanner } from "./TechSummaryBanner";
import { StockTable } from "@/components/stocks/StockTable";
import { SkeletonTable, SkeletonBanner } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { Timestamp } from "@/components/ui/Timestamp";

import { TECH_AI_SYMBOLS, TECH_SECTORS } from "@/lib/constants";
import { cn } from "@/lib/format";
import type { StockData } from "@/types/market";

export function TechAITab() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [activeGroup, setActiveGroup] = useState<string>("All");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks?symbols=${TECH_AI_SYMBOLS.join(",")}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setStocks(json.data);
      setLastUpdated(json.lastUpdated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tech data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const bySymbol = Object.fromEntries(stocks.map((s) => [s.quote.symbol, s]));

  const groups = ["All", ...Object.keys(TECH_SECTORS)];

  const filtered = activeGroup === "All"
    ? stocks
    : (TECH_SECTORS[activeGroup] ?? []).map((sym) => bySymbol[sym]).filter(Boolean);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Tech & AI</h1>
          <p className="text-sm text-slate-500 mt-0.5">Major U.S. tech and AI companies — grouped by sector</p>
        </div>
        <div className="flex items-center gap-3">
          <Timestamp ts={lastUpdated} />
          <RefreshButton onClick={load} loading={loading} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {loading && !stocks.length ? (
        <>
          <SkeletonBanner />
          <SkeletonTable rows={TECH_AI_SYMBOLS.length} />
        </>
      ) : null}

      {!loading && stocks.length > 0 && (
        <>
          <TechSummaryBanner stocks={stocks} />

          {/* Sector tabs */}
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGroup(g)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border",
                  activeGroup === g
                    ? "bg-accent/20 text-accent border-accent/40"
                    : "bg-surface-2 text-slate-500 border-border hover:text-slate-300 hover:border-border-bright"
                )}
              >
                {g}
                {g !== "All" && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({TECH_SECTORS[g]?.length ?? 0})
                  </span>
                )}
              </button>
            ))}
          </div>

          <StockTable stocks={filtered} showHighlights={activeGroup === "All"} />
        </>
      )}
    </div>
  );
}
