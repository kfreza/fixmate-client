"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type Cs_CategoryChartProps = {
  cs_title: string;
  cs_data: { category: string; count: number }[];
};

const cs_chartConfig = { count: { label: "Services", color: "var(--cs_primary_color)" } } satisfies ChartConfig;

// Horizontal bars, so long category names stay readable
const Cs_CategoryChart = ({ cs_title, cs_data }: Cs_CategoryChartProps) => {
  return (
    <div className="cs_chart_card">
      <h3 className="font-semibold text-(--cs_heading_color)">{cs_title}</h3>
      <ChartContainer config={cs_chartConfig} className="mt-4 h-72 w-full">
        <BarChart data={cs_data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
          <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} fontSize={11} width={104} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
          <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} maxBarSize={22} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default Cs_CategoryChart;
