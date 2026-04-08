"use client";
import { useState, useEffect, useCallback } from "react";
import { HousingPriceChart } from "./HousingPriceChart";
import { NewsSection } from "@/components/ui/NewsSection";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { Timestamp } from "@/components/ui/Timestamp";
import { TrendingUp, DollarSign, Building } from "lucide-react";
import type { RealEstateData, FredSeries } from "@/types/market";

function StatCard({ icon, label, value, sub, color = "" }: { icon: React.ReactNode; label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg bg-surface-3 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-bold num text-slate-100 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function getLatest(series: FredSeries | null): number | null {
  if (!series?.observations?.length) return null;
  return series.observations[series.observations.length - 1].value;
}

function buildBuyerSellerSummary(data: RealEstateData): { buyers: string; sellers: string; investors: string } {
  const csPct = (() => {
    const obs = data.caseShiller?.observations;
    if (!obs || obs.length < 13) return null;
    const latest = obs[obs.length - 1].value;
    const yearAgo = obs[obs.length - 13].value;
    return ((latest - yearAgo) / yearAgo) * 100;
  })();
  const rate = getLatest(data.mortgageRate);
  const starts = getLatest(data.housingStarts);

  const buyers =
    rate && rate > 7
      ? `Affordability is severely strained with mortgage rates around ${rate.toFixed(2)}%. Monthly payments on a median-priced home are near historic highs. Buyers should stress-test their budgets carefully and consider locking in rates if purchasing.`
      : rate && rate > 6
      ? `Mortgage rates near ${rate?.toFixed(2)}% remain elevated but off peak levels. Buying power is limited — get pre-approved early and budget conservatively.`
      : `Mortgage rates have eased, improving affordability. This is a more favorable entry environment for buyers who have been waiting.`;

  const sellers =
    csPct && csPct > 3
      ? `Home prices are still appreciating (~${csPct.toFixed(1)}% YoY per Case-Shiller), giving sellers pricing power. Limited inventory continues to support values.`
      : csPct && csPct < 0
      ? `Home prices are softening (${csPct.toFixed(1)}% YoY). Sellers may need to price competitively and be prepared for longer listing times.`
      : `Prices are broadly stable. Sellers remain in a decent position but should price based on recent local comps rather than peak-era expectations.`;

  const investors =
    `Residential real estate faces a challenging cap rate environment with rates elevated. ${starts && starts < 1400 ? "Low housing starts point to continued supply constraints" : "Housing starts remain elevated, adding supply"}, which ${starts && starts < 1400 ? "supports" : "may moderate"} rents and values over time. Investors should focus on cash flow rather than appreciation-driven strategies in the current rate environment.`;

  return { buyers, sellers, investors };
}

export function RealEstateTab() {
  const [data, setData] = useState<RealEstateData | null>(null);
  const [fredError, setFredError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setFredError(null);
    try {
      const [fredRes, newsRes] = await Promise.all([
        fetch("/api/fred"),
        fetch("/api/realestate-news"),
      ]);
      const fredJson = await fredRes.json();
      const newsJson = await newsRes.json();

      if (fredJson.error) setFredError(fredJson.error);

      setData({
        caseShiller: fredJson.data?.caseShiller ?? null,
        mortgageRate: fredJson.data?.mortgageRate ?? null,
        housingStarts: fredJson.data?.housingStarts ?? null,
        news: newsJson.data ?? [],
        lastUpdated: Date.now(),
      });
      setLastUpdated(Date.now());
    } catch (e) {
      setFredError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mortgageRate = getLatest(data?.mortgageRate ?? null);
  const housingStarts = getLatest(data?.housingStarts ?? null);
  const summary = data ? buildBuyerSellerSummary(data) : null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Real Estate</h1>
          <p className="text-sm text-slate-500 mt-0.5">Case-Shiller home prices, mortgage rates & housing activity</p>
        </div>
        <div className="flex items-center gap-3">
          <Timestamp ts={lastUpdated} />
          <RefreshButton onClick={load} loading={loading} />
        </div>
      </div>

      {/* FRED key required notice */}
      {fredError && (
        <div className="mb-5 p-4 card border-amber-700/40 bg-amber-950/20">
          <p className="text-sm text-amber-400 font-medium mb-1">FRED API Key Required</p>
          <p className="text-xs text-amber-300/70">{fredError}</p>
          <p className="text-xs text-slate-500 mt-2">
            Get a free key at{" "}
            <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              fred.stlouisfed.org
            </a>
            , then add <code className="bg-surface-3 px-1 rounded">FRED_API_KEY=your_key</code> to <code className="bg-surface-3 px-1 rounded">.env.local</code>
          </p>
        </div>
      )}

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard
              icon={<DollarSign size={16} className="text-accent" />}
              label="30-Year Mortgage Rate"
              value={mortgageRate ? `${mortgageRate.toFixed(2)}%` : "—"}
              sub="Source: FRED / Freddie Mac"
              color=""
            />
            <StatCard
              icon={<Building size={16} className="text-purple-400" />}
              label="Housing Starts"
              value={housingStarts ? `${housingStarts.toFixed(0)}K` : "—"}
              sub="New units (annualized, thousands)"
            />
            <StatCard
              icon={<TrendingUp size={16} className="text-up" />}
              label="Case-Shiller Index"
              value={getLatest(data?.caseShiller ?? null)?.toFixed(1) ?? "—"}
              sub="U.S. National Home Price Index"
            />
          </>
        )}
      </div>

      {/* Case-Shiller Chart */}
      {!fredError && (
        <section className="mb-6">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-200 mb-1">Case-Shiller U.S. National Home Price Index</h2>
            <p className="text-xs text-slate-500 mb-4">
              Tracks the change in value of residential real estate across the U.S. A rising index means home prices are going up — when the index is above 200, home prices have more than doubled since January 2000.
            </p>
            {loading && <div className="skeleton h-64 rounded-lg" />}
            {!loading && data?.caseShiller && <HousingPriceChart series={data.caseShiller} />}
            {!loading && !data?.caseShiller && !fredError && (
              <p className="text-sm text-slate-500 py-8 text-center">Case-Shiller data unavailable</p>
            )}
          </div>
        </section>
      )}

      {/* Mortgage Rate Chart */}
      {!fredError && data?.mortgageRate && (
        <section className="mb-6">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-200 mb-1">30-Year Fixed Mortgage Rate</h2>
            <p className="text-xs text-slate-500 mb-4">
              The weekly average rate on a 30-year fixed mortgage (Freddie Mac Primary Mortgage Market Survey). Higher rates mean less purchasing power for buyers.
            </p>
            <HousingPriceChart series={data.mortgageRate} />
          </div>
        </section>
      )}

      {/* Buyer / Seller / Investor summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-slate-200 mb-3">What This Means For You</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { title: "For Buyers", icon: "🏠", text: summary.buyers, color: "border-blue-700/30" },
              { title: "For Sellers", icon: "📋", text: summary.sellers, color: "border-emerald-700/30" },
              { title: "For Investors", icon: "📈", text: summary.investors, color: "border-purple-700/30" },
            ].map(({ title, icon, text, color }) => (
              <div key={title} className={`card p-4 border ${color}`}>
                <p className="text-sm font-semibold text-slate-200 mb-2">{icon} {title}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {(data?.news?.length ?? 0) > 0 && (
        <section>
          <NewsSection items={data!.news} title="Real Estate News" />
        </section>
      )}
    </div>
  );
}
