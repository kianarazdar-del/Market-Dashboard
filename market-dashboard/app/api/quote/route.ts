import { NextRequest, NextResponse } from "next/server";
import { fetchBatchQuotes } from "@/lib/yahooFinance";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol) return NextResponse.json({ error: "symbol required" }, { status: 400 });
  const quotes = await fetchBatchQuotes([symbol.toUpperCase()]);
  if (!quotes.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: quotes[0], error: null, lastUpdated: Date.now() });
}
