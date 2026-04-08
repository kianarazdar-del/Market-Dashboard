"use client";
import { useState, useEffect, useCallback } from "react";
import { MarketCard } from "./MarketCard";
import { MarketSummaryBanner } from "./MarketSummaryBanner";
import { NewsSection } from "@/components/ui/NewsSection";
import { SkeletonCard, SkeletonBanner } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { Timestamp } from "@/components/ui/Timestamp";
import type { MarketOverviewData } from "@/types/market";

export function MarketOverviewTab() {
  const [data, setData] = useState<MarketOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/market-overview");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json.data);
      setLastUpdated(json.data.lastUpdated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load market data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Market Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Live data from major indices, bonds, crypto & commodities</p>
        </div>
        <div className="flex items-center gap-3">
          <Timestamp ts={lastUpdated} />
          <RefreshButton onClick={load} loading={loading} />
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      {/* Summary banner */}
      {loading && !data && <SkeletonBanner />}
      {data && <MarketSummaryBanner data={data} />}

      {/* Major Indices */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Major Indices</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {loading && !data
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.indices.map((idx) => <MarketCard key={idx.symbol} data={idx} variant="index" />)
          }
        </div>
      </section>

      {/* Volatility & Rates */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Volatility & Rates</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-w-md">
          {loading && !data
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
            : [data?.vix, data?.treasury10y].filter(Boolean).map((item) =>
                item ? <MarketCard key={item.symbol} data={item} variant="macro" /> : null
              )
          }
        </div>
      </section>

      {/* Crypto */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Crypto</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-w-md">
          {loading && !data
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
            : [data?.bitcoin, data?.ethereum].filter(Boolean).map((item) =>
                item ? <MarketCard key={item.symbol} data={item} variant="crypto" /> : null
              )
          }
        </div>
      </section>

      {/* Oil */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Commodities</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-w-md">
          {loading && !data
            ? <SkeletonCard />
            : data?.oil ? <MarketCard data={data.oil} variant="index" /> : null
          }
        </div>
      </section>

      {/* News */}
      {(data?.news?.length ?? 0) > 0 && (
        <section>
          <NewsSection items={data!.news} title="Market News" />
        </section>
      )}
    </div>
  );
}
