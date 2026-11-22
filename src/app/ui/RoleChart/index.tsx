"use client";

import { Cell, Label, Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type Cs_RoleChartProps = {
  cs_title: string;
  cs_data: { role: string; count: number }[];
};

// Same hues as Cs_RoleBadge
const cs_chartConfig = {
  count: { label: "Users" },
  customer: { label: "Customers", color: "#14b8a6" },
  technician: { label: "Technicians", color: "#f97316" },
  admin: { label: "Admins", color: "#6366f1" },
} satisfies ChartConfig;

const Cs_RoleChart = ({ cs_title, cs_data }: Cs_RoleChartProps) => {
  const cs_total = cs_data.reduce((cs_sum, cs_row) => cs_sum + cs_row.count, 0);

  return (
    <div className="cs_chart_card">
      <h3 className="font-semibold text-(--cs_heading_color)">{cs_title}</h3>
      <ChartContainer config={cs_chartConfig} className="mx-auto mt-2 h-56 w-full max-w-64">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="role" hideLabel />} />
          <Pie data={cs_data} dataKey="count" nameKey="role" innerRadius={58} outerRadius={84} strokeWidth={3} paddingAngle={2}>
            {cs_data.map((cs_row) => (
              <Cell key={cs_row.role} fill={`var(--color-${cs_row.role})`} />
            ))}
            <Label
              content={({ viewBox: cs_viewBox }) =>
                cs_viewBox && "cx" in cs_viewBox ? (
                  <text x={cs_viewBox.cx} y={cs_viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={cs_viewBox.cx} y={cs_viewBox.cy} className="fill-(--cs_heading_color) font-heading text-2xl font-bold">
                      {cs_total}
                    </tspan>
                    <tspan x={cs_viewBox.cx} y={(cs_viewBox.cy ?? 0) + 20} className="fill-(--cs_body_color) text-xs">
                      users
                    </tspan>
                  </text>
                ) : null
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        {cs_data.map((cs_row) => (
          <li key={cs_row.role} className="flex items-center gap-2 text-(--cs_body_color)">
            <span className="size-2.5 rounded-full" style={{ background: cs_chartConfig[cs_row.role as "customer"]?.color }} />
            {cs_chartConfig[cs_row.role as "customer"]?.label ?? cs_row.role}
            <span className="font-semibold text-(--cs_heading_color)">{cs_row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cs_RoleChart;
