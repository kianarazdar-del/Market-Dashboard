"use client";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn, formatPrice } from "@/lib/format";
import type { MarketIndex } from "@/types/market";

interface MarketCardProps {
  data: MarketIndex;
  variant?: "index" | "crypto" | "macro";
}

export function MarketCard({ data, variant = "index" }: MarketCardProps) {
  const up = data.changePercent >= 0;
  const sign = up ? "+" : "";

  // Format price based on asset type
  const priceStr =
    variant === "macro"
      ? `${formatPrice(data.price)}%`
      : data.symbol === "^VIX"
      ? formatPrice(data.price)
      : data.price > 1000
      ? `$${data.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${formatPrice(data.price)}`;

  return (
    <div className={cn("card card-hover p-4 flex flex-col gap-1 min-w-0")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 truncate">{data.name}</p>
          <p className="text-xl font-semibold num text-slate-100 mt-0.5">{priceStr}</p>
        </div>
        <span className={cn(
          "text-xs num font-semibold px-2 py-1 rounded shrink-0",
          up ? "bg-up-bg text-up" : "bg-down-bg text-down"
        )}>
          {sign}{data.changePercent.toFixed(2)}%
        </span>
      </div>
      <p className={cn("text-xs num", up ? "text-up" : "text-down")}>
        {sign}{formatPrice(Math.abs(data.change))} today
      </p>
      {data.history && data.history.length > 2 && (
        <div className="mt-1 -mx-1">
          <Sparkline data={data.history} positive={up} height={40} />
        </div>
      )}
    </div>
  );
}
