"use client";
import { useState, useEffect, useCallback } from "react";
import { StockTable } from "@/components/stocks/StockTable";
import { SkeletonTable } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { Timestamp } from "@/components/ui/Timestamp";
import { WATCHLIST } from "@/lib/constants";
import type { StockData } from "@/types/market";

export function WatchlistTab() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks?symbols=${WATCHLIST.join(",")}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setStocks(json.data);
      setLastUpdated(json.lastUpdated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load watchlist");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Watch List</h1>
          <p className="text-sm text-slate-500 mt-0.5">Stocks on your radar — full detail view available per row</p>
        </div>
        <div className="flex items-center gap-3">
          <Timestamp ts={lastUpdated} />
          <RefreshButton onClick={load} loading={loading} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {loading && !stocks.length ? <SkeletonTable rows={WATCHLIST.length} /> : null}
      {!loading && stocks.length > 0 && <StockTable stocks={stocks} showHighlights={false} />}
    </div>
  );
}
