"use client";
import { useState, useEffect, useCallback } from "react";
import { StockTable } from "./StockTable";
import { SkeletonTable, SkeletonBanner } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { Timestamp } from "@/components/ui/Timestamp";
import { MY_STOCKS } from "@/lib/constants";
import type { StockData } from "@/types/market";

export function StocksTab() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks?symbols=${MY_STOCKS.join(",")}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setStocks(json.data);
      setLastUpdated(json.lastUpdated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stock data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">My Stocks</h1>
          <p className="text-sm text-slate-500 mt-0.5">Live prices and multi-period returns — click any row to expand</p>
        </div>
        <div className="flex items-center gap-3">
          <Timestamp ts={lastUpdated} />
          <RefreshButton onClick={load} loading={loading} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {loading && !stocks.length ? <SkeletonTable rows={MY_STOCKS.length} /> : null}
      {!loading && stocks.length > 0 && <StockTable stocks={stocks} showHighlights />}
    </div>
  );
}
