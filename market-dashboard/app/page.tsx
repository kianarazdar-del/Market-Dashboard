"use client";
import { useState } from "react";
import { TabNav } from "@/components/layout/TabNav";
import { MarketOverviewTab } from "@/components/market-overview/MarketOverviewTab";
import { StocksTab } from "@/components/stocks/StocksTab";
import { WatchlistTab } from "@/components/watchlist/WatchlistTab";
import { RealEstateTab } from "@/components/real-estate/RealEstateTab";
import { TechAITab } from "@/components/tech-ai/TechAITab";
import type { TabId } from "@/types/market";

export default function DashboardPage() {
  const [tab, setTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen bg-surface text-slate-200" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <TabNav active={tab} onChange={setTab} />
      <main>
        {tab === "overview"   && <MarketOverviewTab />}
        {tab === "stocks"     && <StocksTab />}
        {tab === "watchlist"  && <WatchlistTab />}
        {tab === "realestate" && <RealEstateTab />}
        {tab === "tech"       && <TechAITab />}
      </main>
    </div>
  );
}
