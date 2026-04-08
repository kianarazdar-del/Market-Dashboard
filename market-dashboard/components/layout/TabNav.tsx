"use client";
import { BarChart2, Star, Home, Cpu, TrendingUp } from "lucide-react";
import { cn } from "@/lib/format";
import type { TabId } from "@/types/market";

const TABS: { id: TabId; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: "overview",    label: "Market Overview",  shortLabel: "Overview",  icon: <BarChart2 size={15} /> },
  { id: "stocks",      label: "My Stocks",         shortLabel: "My Stocks", icon: <TrendingUp size={15} /> },
  { id: "watchlist",   label: "Watch List",        shortLabel: "Watchlist", icon: <Star size={15} /> },
  { id: "realestate",  label: "Real Estate",       shortLabel: "Real Est.", icon: <Home size={15} /> },
  { id: "tech",        label: "Tech & AI",         shortLabel: "Tech & AI", icon: <Cpu size={15} /> },
];

interface TabNavProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="sticky top-0 z-30 bg-surface border-b border-border">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 pr-6 py-3 border-r border-border mr-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <BarChart2 size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-200 hidden sm:block">Markets</span>
          </div>
          {/* Tabs */}
          <nav className="flex overflow-x-auto scrollbar-hide" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                  active === tab.id
                    ? "border-accent text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
