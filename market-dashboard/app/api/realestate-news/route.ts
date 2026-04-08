/**
 * GET /api/realestate-news
 * Fetches recent real estate news from HousingWire RSS feed.
 * Falls back to Yahoo Finance real estate search if RSS fails.
 */
import { NextResponse } from "next/server";
import type { NewsItem } from "@/types/market";

export const runtime = "nodejs";

// Minimal RSS parser — avoids requiring full rss-parser package in edge
async function parseRSS(url: string): Promise<NewsItem[]> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; MarketDashboard/1.0)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    cache: "no-store",
  });
  const text = await res.text();

  const items: NewsItem[] = [];
  // Simple regex-based RSS extraction (avoids XML parser dependency)
  const itemBlocks = text.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const block of itemBlocks.slice(0, 10)) {
    const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() ?? "";
    const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim()
      ?? block.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/)?.[1]?.trim()
      ?? "#";
    const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ?? "";
    const desc = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .trim()
      .substring(0, 200) ?? "";

    if (!title) continue;

    items.push({
      title: title.replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"'),
      url: link,
      source: "HousingWire",
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      summary: desc,
    });
  }
  return items;
}

async function fetchYahooRealEstateNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      "https://query1.finance.yahoo.com/v1/finance/search?q=real+estate+housing+market&newsCount=8&quotesCount=0",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Referer: "https://finance.yahoo.com/",
        },
        cache: "no-store",
      }
    );
    const json = await res.json();
    return (json?.news ?? []).slice(0, 8).map((n: Record<string, unknown>) => ({
      title: (n.title as string) ?? "",
      url: (n.link as string) ?? "#",
      source: (n.publisher as string) ?? "Yahoo Finance",
      publishedAt: n.providerPublishTime
        ? new Date((n.providerPublishTime as number) * 1000).toISOString()
        : new Date().toISOString(),
    }));
  } catch { return []; }
}

export async function GET() {
  try {
    // Try HousingWire RSS first
    const items = await parseRSS("https://www.housingwire.com/feed/").catch(() => []);

    if (items.length > 0) {
      return NextResponse.json({ data: items, error: null, lastUpdated: Date.now() });
    }

    // Fallback: Yahoo Finance real estate news
    const fallback = await fetchYahooRealEstateNews();
    return NextResponse.json({ data: fallback, error: null, lastUpdated: Date.now() });
  } catch (err) {
    console.error("[/api/realestate-news]", err);
    return NextResponse.json({ data: [], error: "Failed to load real estate news" }, { status: 500 });
  }
}
