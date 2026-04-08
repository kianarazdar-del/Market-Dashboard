"use client";
import { Cpu, TrendingUp, TrendingDown } from "lucide-react";
import { TECH_SECTORS } from "@/lib/constants";
import type { StockData } from "@/types/market";

interface Props { stocks: StockData[] }

export function TechSummaryBanner({ stocks }: Props) {
  if (!stocks.length) return null;

  const bySymbol = Object.fromEntries(stocks.map((s) => [s.quote.symbol, s]));

  // Best / worst today
  const sorted = [...stocks].sort((a, b) => b.quote.changePercent - a.quote.changePercent);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  // Group averages
  const groupStats = Object.entries(TECH_SECTORS).map(([group, symbols]) => {
    const members = symbols.map((s) => bySymbol[s]).filter(Boolean);
    const avgDay = members.reduce((a, b) => a + b.quote.changePercent, 0) / (members.length || 1);
    const avgYtd = members.reduce((a, b) => a + (b.returns.ytd ?? 0), 0) / (members.length || 1);
    return { group, avgDay, avgYtd, count: members.length };
  });

  const bestGroup = [...groupStats].sort((a, b) => b.avgDay - a.avgDay)[0];
  const aiMomentum = groupStats.find((g) => g.group === "AI Leaders")?.avgDay ?? 0;

  const bullets: string[] = [];

  if (best) {
    bullets.push(`${best.quote.symbol} (${best.quote.name}) is the top performer today, up ${best.quote.changePercent.toFixed(2)}%.`);
  }
  if (worst) {
    bullets.push(`${worst.quote.symbol} is the laggard today at ${worst.quote.changePercent.toFixed(2)}%.`);
  }
  if (bestGroup) {
    bullets.push(`"${bestGroup.group}" is the strongest subgroup today, averaging ${bestGroup.avgDay >= 0 ? "+" : ""}${bestGroup.avgDay.toFixed(2)}% across its members.`);
  }
  if (aiMomentum > 1) {
    bullets.push(`AI momentum looks strong — AI Leaders are averaging +${aiMomentum.toFixed(2)}% today, suggesting continued investor appetite for AI names.`);
  } else if (aiMomentum < -1) {
    bullets.push(`AI names are under pressure today — AI Leaders are averaging ${aiMomentum.toFixed(2)}%, which may reflect profit-taking or macro headwinds.`);
  } else {
    bullets.push(`AI Leaders are broadly flat today (avg ${aiMomentum >= 0 ? "+" : ""}${aiMomentum.toFixed(2)}%), with no strong directional move in the AI subsector.`);
  }

  const overallAvg = stocks.reduce((a, b) => a + b.quote.changePercent, 0) / stocks.length;
  const sentiment = overallAvg > 0.5 ? "bullish" : overallAvg < -0.5 ? "bearish" : "mixed";
  const Icon = sentiment === "bullish" ? TrendingUp : sentiment === "bearish" ? TrendingDown : Cpu;
  const color = sentiment === "bullish" ? "text-up border-up/30 bg-up-bg/40" : sentiment === "bearish" ? "text-down border-down/30 bg-down-bg/40" : "text-slate-400 border-border bg-surface-2";

  return (
    <div className="card p-5 mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${color}`}>
          <Icon size={14} />
          Tech Sector — {sentiment === "bullish" ? "Risk-On" : sentiment === "bearish" ? "Under Pressure" : "Mixed"}
        </div>
        <h2 className="text-base font-semibold text-slate-200">Tech & AI Summary</h2>
      </div>
      <div className="space-y-2 mb-4">
        {bullets.map((b, i) => (
          <p key={i} className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-surface-4">{b}</p>
        ))}
      </div>
      {/* Group averages row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-border-soft">
        {groupStats.map(({ group, avgDay }) => (
          <div key={group} className="text-center">
            <p className="text-xs text-slate-500 truncate">{group}</p>
            <p className={`text-sm font-semibold num ${avgDay >= 0 ? "text-up" : "text-down"}`}>
              {avgDay >= 0 ? "+" : ""}{avgDay.toFixed(2)}%
            </p>
            <p className="text-xs text-slate-600">avg today</p>
          </div>
        ))}
      </div>
    </div>
  );
}
