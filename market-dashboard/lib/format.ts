export function formatPrice(v: number | null | undefined, dec = 2): string {
  if (v == null || isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);
}
export function formatCurrency(v: number | null | undefined, dec = 2): string {
  if (v == null || isNaN(v)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);
}
export function formatPercent(v: number | null | undefined, dec = 2): string {
  if (v == null || isNaN(v)) return "N/A";
  const s = v >= 0 ? "+" : "";
  return `${s}${v.toFixed(dec)}%`;
}
export function formatMarketCap(v: number | undefined): string {
  if (!v) return "—";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
}
export function formatVolume(v: number | undefined): string {
  if (!v) return "—";
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return `${v}`;
}
export function formatTimestamp(ts: number): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
}
export function formatDate(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
export function timeAgo(isoStr: string): string {
  const diff = (Date.now() - new Date(isoStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
export function cn(...cls: (string | undefined | null | false)[]): string {
  return cls.filter(Boolean).join(" ");
}
