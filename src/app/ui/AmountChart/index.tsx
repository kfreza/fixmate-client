"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { cs_formatMoney } from "@/lib/cs_format";
import type { Cs_MonthAmount } from "@/lib/cs_types";

type Cs_AmountChartProps = {
  cs_title: string;
  cs_label: string;
  cs_data: Cs_MonthAmount[];
};

// Money per month (spending, earnings or revenue)
const Cs_AmountChart = ({ cs_title, cs_label, cs_data }: Cs_AmountChartProps) => {
  const cs_chartConfig = { amount: { label: cs_label, color: "var(--cs_primary_color)" } } satisfies ChartConfig;
  const cs_total = cs_data.reduce((cs_sum, cs_row) => cs_sum + cs_row.amount, 0);

  return (
    <div className="cs_chart_card">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-semibold text-(--cs_heading_color)">{cs_title}</h3>
        <span className="text-sm text-(--cs_body_color)">
          Last 6 months: <span className="font-semibold text-(--cs_heading_color)">{cs_formatMoney(cs_total)}</span>
        </span>
      </div>
      <ChartContainer config={cs_chartConfig} className="mt-4 h-64 w-full">
        <AreaChart data={cs_data} margin={{ left: -12, right: 8 }}>
          <defs>
            <linearGradient id="cs_amount_fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(cs_value: number) => `$${cs_value}`} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={(cs_value) => cs_formatMoney(Number(cs_value))} />}
          />
          <Area dataKey="amount" type="monotone" stroke="var(--color-amount)" strokeWidth={2.5} fill="url(#cs_amount_fill)" />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default Cs_AmountChart;
