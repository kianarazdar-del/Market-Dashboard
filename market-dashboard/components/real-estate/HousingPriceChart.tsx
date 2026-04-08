"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from "recharts";
import type { FredSeries } from "@/types/market";

interface Props { series: FredSeries }

export function HousingPriceChart({ series }: Props) {
  const data = series.observations.map((o) => ({
    date: o.date,
    label: new Date(o.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    value: o.value,
  }));

  // Show every 12th label to avoid clutter
  const tickIndexes = data.reduce<number[]>((acc, _, i) => {
    if (i % 12 === 0 || i === data.length - 1) acc.push(i);
    return acc;
  }, []);
  const tickDates = tickIndexes.map((i) => data[i].date);

  const latest = data[data.length - 1];
  const oneYearAgo = data.find((d) => d.date >= data[data.length - 13]?.date);
  const yoyChange = oneYearAgo ? ((latest.value - oneYearAgo.value) / oneYearAgo.value) * 100 : null;

  return (
    <div>
      <div className="flex items-end gap-4 mb-4">
        <div>
          <p className="text-3xl font-bold num text-slate-100">{latest.value.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-0.5">Index level (Jan 2000 = 100)</p>
        </div>
        {yoyChange !== null && (
          <span className={`text-sm font-semibold num px-2 py-1 rounded mb-1 ${yoyChange >= 0 ? "bg-up-bg text-up" : "bg-down-bg text-down"}`}>
            {yoyChange >= 0 ? "+" : ""}{yoyChange.toFixed(1)}% YoY
          </span>
        )}
        <p className="text-xs text-slate-500 mb-1">Latest: {new Date(latest.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
          <XAxis
            dataKey="date"
            ticks={tickDates}
            tickFormatter={(d) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => v.toFixed(0)}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{ background: "#181c25", border: "1px solid #2a3040", borderRadius: 8, fontSize: 12 }}
            labelFormatter={(l) => new Date(l).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            formatter={(v: number) => [v.toFixed(2), "Index"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
