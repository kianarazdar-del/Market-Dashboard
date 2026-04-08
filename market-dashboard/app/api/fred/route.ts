/**
 * GET /api/fred
 * Fetches Case-Shiller home price index, 30yr mortgage rate, and housing starts from FRED.
 * Requires FRED_API_KEY in .env.local
 * Free API key: https://fred.stlouisfed.org/docs/api/api_key.html
 */
import { NextResponse } from "next/server";
import type { FredSeries, FredObservation } from "@/types/market";

export const runtime = "nodejs";

const FRED_BASE = "https://api.stlouisfed.org/fred";

async function fetchFredSeries(seriesId: string, apiKey: string, limit = 120): Promise<FredSeries | null> {
  try {
    // Fetch series metadata
    const metaRes = await fetch(
      `${FRED_BASE}/series?series_id=${seriesId}&api_key=${apiKey}&file_type=json`,
      { cache: "no-store" }
    );
    const metaJson = await metaRes.json();
    const meta = metaJson?.seriess?.[0];

    // Fetch observations (most recent N)
    const obsRes = await fetch(
      `${FRED_BASE}/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`,
      { cache: "no-store" }
    );
    const obsJson = await obsRes.json();
    const rawObs: { date: string; value: string }[] = obsJson?.observations ?? [];

    // Parse, filter out "." values (FRED uses "." for missing data), reverse to ascending
    const observations: FredObservation[] = rawObs
      .filter((o) => o.value !== ".")
      .map((o) => ({ date: o.date, value: parseFloat(o.value) }))
      .reverse();

    return {
      seriesId,
      title: meta?.title ?? seriesId,
      observations,
      units: meta?.units ?? "",
    };
  } catch (e) {
    console.error(`[fetchFredSeries] ${seriesId}:`, e);
    return null;
  }
}

export async function GET() {
  const apiKey = process.env.FRED_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      data: null,
      error: "FRED_API_KEY not configured. Add it to .env.local. Free at: https://fred.stlouisfed.org/docs/api/api_key.html",
    }, { status: 503 });
  }

  try {
    const [caseShiller, mortgageRate, housingStarts] = await Promise.all([
      fetchFredSeries("CSUSHPINSA", apiKey, 120),   // Case-Shiller national index, ~10 years
      fetchFredSeries("MORTGAGE30US", apiKey, 156),  // 30yr fixed mortgage rate, ~3 years weekly
      fetchFredSeries("HOUST", apiKey, 60),           // Housing starts, 5 years monthly
    ]);

    return NextResponse.json({
      data: { caseShiller, mortgageRate, housingStarts, lastUpdated: Date.now() },
      error: null,
    });
  } catch (err) {
    console.error("[/api/fred]", err);
    return NextResponse.json({ data: null, error: "Failed to load FRED data" }, { status: 500 });
  }
}
