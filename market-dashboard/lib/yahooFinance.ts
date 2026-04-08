/**
 * Server-side Yahoo Finance fetcher.
 * Uses unofficial v7/v8 JSON endpoints — must run server-side to avoid CORS.
 * Falls back from query1 to query2 on failure.
 */
import type { Quote, HistoricalBar, NewsItem } from "@/types/market";
import { SYMBOL_NAMES } from "@/lib/constants";

const BASES = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];
const HDR = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://finance.yahoo.com/",
};

async function yf(path: string): Promise<Response> {
  for (let i = 0; i < BASES.length; i++) {
    try {
      const r = await fetch(`${BASES[i]}${path}`, { headers: HDR, cache: "no-store" });
      if (r.ok) return r;
    } catch { if (i === BASES.length - 1) throw new Error(`All Yahoo Finance bases failed for ${path}`); }
  }
  throw new Error("unreachable");
}

export async function fetchBatchQuotes(symbols: string[]): Promise<Quote[]> {
  try {
    const syms = symbols.map(encodeURIComponent).join(",");
    const fields = "regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketOpen,regularMarketPreviousClose,regularMarketDayHigh,regularMarketDayLow,fiftyTwoWeekHigh,fiftyTwoWeekLow,marketCap,trailingPE,averageVolume,regularMarketVolume,longName,shortName,sector,industry,regularMarketTime,currency,fullExchangeName";
    const r = await yf(`/v7/finance/quote?symbols=${syms}&fields=${fields}`);
    const json = await r.json();
    const results: Record<string, unknown>[] = json?.quoteResponse?.result ?? [];
    return results.map((q) => {
      const sym = q.symbol as string;
      const price = (q.regularMarketPrice as number) ?? 0;
      const prev = (q.regularMarketPreviousClose as number) ?? price;
      return {
        symbol: sym,
        name: SYMBOL_NAMES[sym] ?? (q.longName as string) ?? (q.shortName as string) ?? sym,
        price,
        change: (q.regularMarketChange as number) ?? price - prev,
        changePercent: (q.regularMarketChangePercent as number) ?? 0,
        open: (q.regularMarketOpen as number) ?? prev,
        previousClose: prev,
        dayHigh: (q.regularMarketDayHigh as number) ?? price,
        dayLow: (q.regularMarketDayLow as number) ?? price,
        week52High: (q.fiftyTwoWeekHigh as number) ?? 0,
        week52Low: (q.fiftyTwoWeekLow as number) ?? 0,
        marketCap: q.marketCap as number | undefined,
        peRatio: q.trailingPE as number | undefined,
        volume: q.regularMarketVolume as number | undefined,
        avgVolume: q.averageVolume as number | undefined,
        sector: q.sector as string | undefined,
        industry: q.industry as string | undefined,
        currency: (q.currency as string) ?? "USD",
        exchangeName: q.fullExchangeName as string | undefined,
        lastUpdated: (q.regularMarketTime as number) ?? Math.floor(Date.now() / 1000),
      } as Quote;
    });
  } catch (e) {
    console.error("[fetchBatchQuotes]", e);
    return [];
  }
}

export async function fetchHistory(symbol: string, range = "5y", interval = "1d"): Promise<HistoricalBar[]> {
  try {
    const s = encodeURIComponent(symbol);
    const r = await yf(`/v8/finance/chart/${s}?interval=${interval}&range=${range}&includePrePost=false`);
    const json = await r.json();
    const result = json?.chart?.result?.[0];
    if (!result) return [];
    const ts: number[] = result.timestamp ?? [];
    const ohlcv = result.indicators?.quote?.[0];
    if (!ohlcv) return [];
    const bars: HistoricalBar[] = [];
    for (let i = 0; i < ts.length; i++) {
      const close = ohlcv.close?.[i];
      if (close == null || close <= 0) continue;
      bars.push({
        date: new Date(ts[i] * 1000).toISOString().split("T")[0],
        open: ohlcv.open?.[i] ?? close,
        high: ohlcv.high?.[i] ?? close,
        low: ohlcv.low?.[i] ?? close,
        close,
        volume: ohlcv.volume?.[i] ?? 0,
      });
    }
    return bars.sort((a, b) => a.date.localeCompare(b.date));
  } catch (e) {
    console.error("[fetchHistory]", symbol, e);
    return [];
  }
}

export async function fetchNews(query: string, count = 6): Promise<NewsItem[]> {
  try {
    const q = encodeURIComponent(query);
    const r = await yf(`/v1/finance/search?q=${q}&newsCount=${count}&quotesCount=0&enableFuzzyQuery=false`);
    const json = await r.json();
    return (json?.news ?? []).slice(0, count).map((n: Record<string, unknown>) => ({
      title: (n.title as string) ?? "",
      url: (n.link as string) ?? "#",
      source: (n.publisher as string) ?? "Yahoo Finance",
      publishedAt: n.providerPublishTime
        ? new Date((n.providerPublishTime as number) * 1000).toISOString()
        : new Date().toISOString(),
    }));
  } catch (e) {
    console.error("[fetchNews]", query, e);
    return [];
  }
}
