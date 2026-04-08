/**
 * GET /api/market-overview
 * Returns all major indices, VIX, bonds, crypto, oil with intraday sparkline history.
 */
import { NextResponse } from "next/server";
import { fetchBatchQuotes, fetchHistory } from "@/lib/yahooFinance";
import { fetchNews } from "@/lib/yahooFinance";
import { SYMBOL_NAMES } from "@/lib/constants";
import type { MarketIndex, MarketOverviewData } from "@/types/market";

export const runtime = "nodejs";

const INDEX_SYMBOLS = ["^GSPC", "^IXIC", "^DJI", "^RUT"];
const OTHER_SYMBOLS = ["^VIX", "^TNX", "BTC-USD", "ETH-USD", "CL=F"];
const ALL_SYMBOLS = [...INDEX_SYMBOLS, ...OTHER_SYMBOLS];

export async function GET() {
  try {
    // Fetch all quotes in parallel with 30-day sparkline history
    const [quotes, ...histories] = await Promise.all([
      fetchBatchQuotes(ALL_SYMBOLS),
      ...ALL_SYMBOLS.map((s) => fetchHistory(s, "1mo", "1d")),
    ]);

    const quoteMap = Object.fromEntries(quotes.map((q) => [q.symbol, q]));
    const histMap = Object.fromEntries(ALL_SYMBOLS.map((s, i) => [s, histories[i]]));

    const toIndex = (sym: string): MarketIndex => {
      const q = quoteMap[sym];
      if (!q) return { symbol: sym, name: SYMBOL_NAMES[sym] ?? sym, price: 0, change: 0, changePercent: 0, history: [] };
      return {
        symbol: sym,
        name: SYMBOL_NAMES[sym] ?? q.name,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        history: histMap[sym] ?? [],
      };
    };

    const news = await fetchNews("stock market", 8);

    const data: MarketOverviewData = {
      indices: INDEX_SYMBOLS.map(toIndex),
      vix: toIndex("^VIX"),
      treasury10y: toIndex("^TNX"),
      bitcoin: toIndex("BTC-USD"),
      ethereum: toIndex("ETH-USD"),
      oil: toIndex("CL=F"),
      news,
      lastUpdated: Date.now(),
    };

    return NextResponse.json({ data, error: null });
  } catch (err) {
    console.error("[/api/market-overview]", err);
    return NextResponse.json({ data: null, error: "Failed to load market overview" }, { status: 500 });
  }
}
