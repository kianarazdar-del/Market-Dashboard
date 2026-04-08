/**
 * GET /api/stocks?symbols=AMZN,TSLA,...
 * Returns full StockData (quote + computed returns + recent history + news) for each symbol.
 * History range: 5y weekly for return calculations, 3mo daily for sparklines.
 */
import { NextRequest, NextResponse } from "next/server";
import { fetchBatchQuotes, fetchHistory, fetchNews } from "@/lib/yahooFinance";
import { computeReturns } from "@/lib/returns";
import type { StockData } from "@/types/market";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("symbols") ?? "";
  const symbols = raw.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);

  if (symbols.length === 0) {
    return NextResponse.json({ data: [], error: "No symbols provided" }, { status: 400 });
  }

  try {
    // Batch fetch quotes
    const quotes = await fetchBatchQuotes(symbols);
    const quoteMap = Object.fromEntries(quotes.map((q) => [q.symbol, q]));

    // For each symbol, fetch 5y weekly history (for returns) + 3mo daily (for sparkline) + news in parallel
    const results: StockData[] = await Promise.all(
      symbols.map(async (sym) => {
        const [histLong, histShort, news] = await Promise.all([
          fetchHistory(sym, "5y", "1wk"),   // weekly bars over 5 years for accurate return calculation
          fetchHistory(sym, "3mo", "1d"),    // daily bars last 3mo for sparkline chart
          fetchNews(sym, 5),
        ]);

        const quote = quoteMap[sym] ?? {
          symbol: sym, name: sym, price: 0, change: 0, changePercent: 0,
          open: 0, previousClose: 0, dayHigh: 0, dayLow: 0,
          week52High: 0, week52Low: 0, lastUpdated: Math.floor(Date.now() / 1000),
        };

        const returns = computeReturns(histLong, quote.price);

        return { quote, returns, history: histShort, news };
      })
    );

    return NextResponse.json({ data: results, error: null, lastUpdated: Date.now() });
  } catch (err) {
    console.error("[/api/stocks]", err);
    return NextResponse.json({ data: null, error: "Failed to load stock data" }, { status: 500 });
  }
}
