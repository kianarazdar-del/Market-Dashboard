"use client";
import { useState, useMemo, Fragment } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "@/components/ui/Sparkline";
import { ReturnBadge } from "@/components/ui/Badge";
import { StockExpandedDetail } from "./StockExpandedDetail";
import { formatPrice, cn } from "@/lib/format";
import type { StockData } from "@/types/market";

type SortKey = "symbol" | "price" | "daily" | "weekly" | "monthly" | "ytd" | "oneYear" | "fiveYear";

function getSortValue(s: StockData, key: SortKey): number | string {
  if (key === "price") return s.quote.price;
  if (key === "symbol") return s.quote.symbol;
  return s.returns[key as keyof typeof s.returns] ?? -Infinity;
}

interface Props {
  stocks: StockData[];
  showHighlights?: boolean;
}

export function StockTable({ stocks, showHighlights = true }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "ytd", dir: "desc" });
  const [filter, setFilter] = useState("");

  const toggleExpand = (sym: string) =>
    setExpanded((prev) => (prev === sym ? null : sym));

  const handleSort = (key: SortKey) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
  };

  const filtered = useMemo(() => {
    const f = filter.toLowerCase().trim();
    if (!f) return stocks;
    return stocks.filter(
      (s) =>
        s.quote.symbol.toLowerCase().includes(f) ||
        s.quote.name.toLowerCase().includes(f)
    );
  }, [stocks, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = getSortValue(a, sort.key);
      const bv = getSortValue(b, sort.key);
      if (typeof av === "string" && typeof bv === "string") {
        return sort.dir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      const an = av as number;
      const bn = bv as number;
      return sort.dir === "asc" ? an - bn : bn - an;
    });
  }, [filtered, sort]);

  // Best/worst by YTD for highlight cards
  const best = showHighlights && stocks.length > 0
    ? stocks.reduce((a, b) =>
        (a.returns.ytd ?? -Infinity) >= (b.returns.ytd ?? -Infinity) ? a : b
      )
    : null;
  const worst = showHighlights && stocks.length > 0
    ? stocks.reduce((a, b) =>
        (a.returns.ytd ?? Infinity) <= (b.returns.ytd ?? Infinity) ? a : b
      )
    : null;

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sort.key !== k) return <ChevronsUpDown size={11} className="text-slate-600 ml-0.5" />;
    return sort.dir === "desc"
      ? <ChevronDown size={11} className="text-accent ml-0.5" />
      : <ChevronUp size={11} className="text-accent ml-0.5" />;
  };

  const Th = ({
    label,
    k,
    className = "",
  }: {
    label: string;
    k: SortKey;
    className?: string;
  }) => (
    <th className={cn("px-3 py-3 text-left", className)}>
      <button
        onClick={() => handleSort(k)}
        className="flex items-center gap-0.5 text-xs font-semibold text-slate-500 hover:text-slate-300 uppercase tracking-wider transition-colors whitespace-nowrap"
      >
        {label}
        <SortIcon k={k} />
      </button>
    </th>
  );

  return (
    <div>
      {/* Best / Worst highlight cards */}
      {showHighlights && best && worst && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="card p-3 flex items-center gap-3 border-l-2 border-up">
            <TrendingUp size={18} className="text-up shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Best YTD</p>
              <p className="text-sm font-bold text-slate-100">{best.quote.symbol}</p>
              <p className="text-xs text-slate-400 truncate max-w-[120px]">{best.quote.name}</p>
              <ReturnBadge value={best.returns.ytd} size="sm" />
            </div>
          </div>
          <div className="card p-3 flex items-center gap-3 border-l-2 border-down">
            <TrendingDown size={18} className="text-down shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Worst YTD</p>
              <p className="text-sm font-bold text-slate-100">{worst.quote.symbol}</p>
              <p className="text-xs text-slate-400 truncate max-w-[120px]">{worst.quote.name}</p>
              <ReturnBadge value={worst.returns.ytd} size="sm" />
            </div>
          </div>
        </div>
      )}

      {/* Filter input */}
      {stocks.length > 4 && (
        <div className="mb-4">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by symbol or name…"
            className="w-full max-w-xs px-3 py-2 text-sm bg-surface-2 border border-border rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent/60 transition-colors"
          />
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="border-b border-border bg-surface-2">
              <tr>
                <Th label="Symbol" k="symbol" />
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">
                  Chart
                </th>
                <Th label="Price" k="price" />
                <Th label="1D" k="daily" />
                <Th label="1W" k="weekly" />
                <Th label="1M" k="monthly" />
                <Th label="YTD" k="ytd" />
                <Th label="1Y" k="oneYear" />
                <Th label="5Y" k="fiveYear" className="hidden lg:table-cell" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => {
                const isExpanded = expanded === s.quote.symbol;
                const up = s.quote.changePercent >= 0;
                return (
                  <Fragment key={s.quote.symbol}>
                    {/* Main row */}
                    <tr
                      onClick={() => toggleExpand(s.quote.symbol)}
                      className={cn(
                        "border-b border-border-soft cursor-pointer transition-colors select-none",
                        i % 2 === 0 ? "bg-surface-1" : "bg-surface",
                        isExpanded
                          ? "bg-surface-2 border-border"
                          : "hover:bg-surface-2"
                      )}
                    >
                      {/* Symbol + name */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            size={14}
                            className={cn(
                              "text-slate-600 transition-transform duration-200 shrink-0",
                              isExpanded && "rotate-180 text-accent"
                            )}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-100 leading-tight">
                              {s.quote.symbol}
                            </p>
                            <p className="text-xs text-slate-500 truncate max-w-[130px]">
                              {s.quote.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Sparkline */}
                      <td className="px-2 py-1 w-20">
                        <Sparkline data={s.history} positive={up} height={36} />
                      </td>

                      {/* Price + daily change */}
                      <td className="px-3 py-3">
                        <p className="text-sm font-semibold num text-slate-100 leading-tight">
                          ${formatPrice(s.quote.price)}
                        </p>
                        <p className={cn("text-xs num leading-tight", up ? "text-up" : "text-down")}>
                          {up ? "+" : ""}
                          {s.quote.changePercent.toFixed(2)}%
                        </p>
                      </td>

                      {/* Return columns */}
                      <td className="px-3 py-3">
                        <ReturnBadge value={s.returns.daily} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        <ReturnBadge value={s.returns.weekly} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        <ReturnBadge value={s.returns.monthly} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        <ReturnBadge value={s.returns.ytd} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        <ReturnBadge value={s.returns.oneYear} size="sm" />
                      </td>
                      <td className="px-3 py-3 hidden lg:table-cell">
                        <ReturnBadge value={s.returns.fiveYear} size="sm" />
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr className="bg-surface-1">
                        <td colSpan={9} className="p-0">
                          <StockExpandedDetail data={s} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-sm">
            No results for &ldquo;{filter}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
