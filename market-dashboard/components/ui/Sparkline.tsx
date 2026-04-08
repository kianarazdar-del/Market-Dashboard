"use client";
import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from "recharts";
import type { HistoricalBar } from "@/types/market";

interface SparklineProps {
  data: HistoricalBar[];
  positive?: boolean;
  height?: number;
  showTooltip?: boolean;
}

export function Sparkline({ data, positive, height = 48, showTooltip = false }: SparklineProps) {
  if (!data || data.length < 2) {
    return <div style={{ height }} className="flex items-center justify-center text-xs text-surface-4">No data</div>;
  }

  // Determine trend if not passed
  const trend = positive ?? (data[data.length - 1].close >= data[0].close);
  const color = trend ? "#10b981" : "#ef4444";

  const chartData = data.map((b) => ({ date: b.date, v: b.close }));

  // Calculate Y domain with 2% padding
  const vals = chartData.map((d) => d.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.1 || min * 0.02;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <YAxis domain={[min - pad, max + pad]} hide />
        {showTooltip && (
          <Tooltip
            contentStyle={{ background: "#181c25", border: "1px solid #2a3040", borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: "#94a3b8" }}
            formatter={(v: number) => [`$${v.toFixed(2)}`, ""]}
          />
        )}
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Full chart for expanded stock view
interface FullChartProps {
  data: HistoricalBar[];
  symbol: string;
  height?: number;
}

export function PriceChart({ data, symbol, height = 200 }: FullChartProps) {
  if (!data || data.length < 2) return null;
  const trend = data[data.length - 1].close >= data[0].close;
  const color = trend ? "#10b981" : "#ef4444";
  const chartData = data.map((b) => ({ date: b.date, price: b.close }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <YAxis
          domain={["auto", "auto"]}
          tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(0)}`}
          tick={{ fill: "#64748b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{ background: "#181c25", border: "1px solid #2a3040", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#94a3b8", fontSize: 11 }}
          formatter={(v: number) => [`$${v.toFixed(2)}`, symbol]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
