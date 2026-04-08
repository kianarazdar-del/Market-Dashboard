import type { HistoricalBar, Returns } from "@/types/market";

function findBarOnOrBefore(bars: HistoricalBar[], targetDate: string): HistoricalBar | null {
  // bars sorted ascending; find last bar with date <= targetDate
  let result: HistoricalBar | null = null;
  for (const bar of bars) {
    if (bar.date <= targetDate) result = bar;
    else break;
  }
  return result;
}

function dateOffset(refDate: string, days?: number, months?: number, years?: number): string {
  const d = new Date(refDate);
  if (days) d.setDate(d.getDate() - days);
  if (months) d.setMonth(d.getMonth() - months);
  if (years) d.setFullYear(d.getFullYear() - years);
  return d.toISOString().split("T")[0];
}

function startOfYear(refDate: string): string {
  return refDate.substring(0, 4) + "-01-01";
}

export function computeReturns(bars: HistoricalBar[], currentPrice?: number): Returns {
  if (!bars || bars.length < 2) {
    return { daily: null, weekly: null, monthly: null, ytd: null, oneYear: null, fiveYear: null };
  }

  const latest = bars[bars.length - 1];
  const price = currentPrice ?? latest.close;
  const refDate = latest.date;

  const pct = (base: HistoricalBar | null) =>
    base && base.close > 0 ? ((price - base.close) / base.close) * 100 : null;

  const prev = bars.length >= 2 ? bars[bars.length - 2] : null;

  return {
    daily:    pct(prev),
    weekly:   pct(findBarOnOrBefore(bars.slice(0, -1), dateOffset(refDate, 7))),
    monthly:  pct(findBarOnOrBefore(bars.slice(0, -1), dateOffset(refDate, undefined, 1))),
    ytd:      pct(findBarOnOrBefore(bars.slice(0, -1), startOfYear(refDate))),
    oneYear:  pct(findBarOnOrBefore(bars.slice(0, -1), dateOffset(refDate, undefined, undefined, 1))),
    fiveYear: pct(findBarOnOrBefore(bars.slice(0, -1), dateOffset(refDate, undefined, undefined, 5))),
  };
}
