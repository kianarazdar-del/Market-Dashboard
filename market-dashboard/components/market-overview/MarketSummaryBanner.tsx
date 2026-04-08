"use client";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import type { MarketOverviewData } from "@/types/market";

function buildSummary(d: MarketOverviewData): { bullets: string[]; sentiment: "bullish" | "bearish" | "mixed" } {
  const sp500 = d.indices.find((i) => i.symbol === "^GSPC");
  const nasdaq = d.indices.find((i) => i.symbol === "^IXIC");
  const vix = d.vix;
  const tnx = d.treasury10y;
  const btc = d.bitcoin;

  const bullets: string[] = [];
  let bulls = 0, bears = 0;

  // Market direction
  if (sp500) {
    const pct = sp500.changePercent;
    if (Math.abs(pct) < 0.15) {
      bullets.push(`The S&P 500 is essentially flat today (${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%), with no strong directional move.`);
    } else if (pct > 0) {
      bulls++;
      bullets.push(`U.S. stocks are rising — the S&P 500 is up ${pct.toFixed(2)}% today, pointing to broad market strength.`);
    } else {
      bears++;
      bullets.push(`U.S. stocks are under pressure — the S&P 500 is down ${Math.abs(pct).toFixed(2)}% today.`);
    }
  }

  // Tech vs broad
  if (nasdaq && sp500) {
    const diff = nasdaq.changePercent - sp500.changePercent;
    if (diff > 0.3) {
      bulls++;
      bullets.push(`Tech is outperforming the broader market — the Nasdaq is beating the S&P 500 by ${diff.toFixed(2)} percentage points, a positive signal for growth stocks.`);
    } else if (diff < -0.3) {
      bears++;
      bullets.push(`Tech is lagging the broader market today — the Nasdaq is trailing the S&P 500 by ${Math.abs(diff).toFixed(2)} percentage points.`);
    } else {
      bullets.push(`Tech and the broader market are moving in sync today — no major divergence between the Nasdaq and S&P 500.`);
    }
  }

  // VIX / volatility
  if (vix) {
    const v = vix.price;
    if (v < 15) {
      bulls++;
      bullets.push(`Volatility is very low (VIX at ${v.toFixed(1)}). Investors appear calm and confident — this is typical of a risk-on environment.`);
    } else if (v < 20) {
      bullets.push(`Volatility is moderate (VIX at ${v.toFixed(1)}). No signs of panic, though some caution is present in the market.`);
    } else if (v < 30) {
      bears++;
      bullets.push(`Volatility is elevated (VIX at ${v.toFixed(1)}), signaling that investors are nervous. Expect larger daily price swings.`);
    } else {
      bears++;
      bullets.push(`Volatility is very high (VIX at ${v.toFixed(1)}) — this indicates significant fear in the market. Conditions can be choppy and unpredictable.`);
    }
  }

  // Bonds / yields
  if (tnx) {
    const y = tnx.price;
    const chg = tnx.changePercent;
    if (y > 4.5 && chg > 0) {
      bears++;
      bullets.push(`The 10-year Treasury yield is rising and sits at ${y.toFixed(2)}% — high yields can pressure stock valuations and signal tighter financial conditions.`);
    } else if (y < 4.0 && chg < 0) {
      bullets.push(`The 10-year Treasury yield is falling (${y.toFixed(2)}%), suggesting a flight to safety or softer economic expectations.`);
    } else {
      bullets.push(`The 10-year Treasury yield is at ${y.toFixed(2)}% — relatively stable and not sending a strong signal today.`);
    }
  }

  // Crypto
  if (btc) {
    if (btc.changePercent > 2) {
      bulls++;
      bullets.push(`Bitcoin is up ${btc.changePercent.toFixed(1)}% today — crypto is participating in risk-on sentiment, which often aligns with bullish equity markets.`);
    } else if (btc.changePercent < -2) {
      bears++;
      bullets.push(`Bitcoin is down ${Math.abs(btc.changePercent).toFixed(1)}% — crypto weakness can reflect broader risk aversion among speculative investors.`);
    } else {
      bullets.push(`Crypto is moving sideways today (Bitcoin ${btc.changePercent >= 0 ? "+" : ""}${btc.changePercent.toFixed(1)}%), not adding a clear directional signal.`);
    }
  }

  const sentiment = bulls > bears ? "bullish" : bears > bulls ? "bearish" : "mixed";
  return { bullets, sentiment };
}

export function MarketSummaryBanner({ data }: { data: MarketOverviewData }) {
  const { bullets, sentiment } = buildSummary(data);

  const Icon = sentiment === "bullish" ? TrendingUp : sentiment === "bearish" ? TrendingDown : Minus;
  const sentimentColor =
    sentiment === "bullish" ? "text-up border-up/30 bg-up-bg/40"
    : sentiment === "bearish" ? "text-down border-down/30 bg-down-bg/40"
    : "text-slate-400 border-border bg-surface-2";

  return (
    <div className="card p-5 mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${sentimentColor}`}>
          <Icon size={14} />
          {sentiment === "bullish" ? "Risk-On" : sentiment === "bearish" ? "Risk-Off" : "Mixed Signals"}
        </div>
        <h2 className="text-base font-semibold text-slate-200">Today's Market Highlights</h2>
      </div>
      <div className="space-y-2">
        {bullets.map((b, i) => (
          <p key={i} className="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-surface-4">
            {b}
          </p>
        ))}
      </div>
    </div>
  );
}
