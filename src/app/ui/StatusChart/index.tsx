"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Cs_StatusCount } from "@/lib/cs_types";

// Same hues as Cs_StatusBadge
const CS_STATUS_COLORS: Record<string, { label: string; color: string }> = {
  requested: { label: "Requested", color: "#3b82f6" },
  accepted: { label: "Accepted", color: "#6366f1" },
  "in-progress": { label: "In Progress", color: "#f59e0b" },
  completed: { label: "Completed", color: "#22c55e" },
  rejected: { label: "Rejected", color: "#ef4444" },
  cancelled: { label: "Cancelled", color: "#94a3b8" },
};

const cs_chartConfig = { count: { label: "Bookings" }, ...CS_STATUS_COLORS } satisfies ChartConfig;

type Cs_StatusChartProps = {
  cs_title: string;
  cs_data: Cs_StatusCount[];
};

const Cs_StatusChart = ({ cs_title, cs_data }: Cs_StatusChartProps) => {
  const cs_rows = cs_data.map((cs_row) => ({ ...cs_row, label: CS_STATUS_COLORS[cs_row.status]?.label ?? cs_row.status }));
  const cs_isEmpty = cs_rows.every((cs_row) => cs_row.count === 0);

  return (
    <div className="cs_chart_card">
      <h3 className="font-semibold text-(--cs_heading_color)">{cs_title}</h3>
      {cs_isEmpty ? (
        <p className="flex h-64 items-center justify-center text-sm text-(--cs_body_color)">No bookings yet</p>
      ) : (
        <ChartContainer config={cs_chartConfig} className="mt-4 h-64 w-full">
          <BarChart data={cs_rows} margin={{ left: -20, right: 4 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={0} fontSize={11} tickMargin={8} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {cs_rows.map((cs_row) => (
                <Cell key={cs_row.status} fill={CS_STATUS_COLORS[cs_row.status]?.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default Cs_StatusChart;
