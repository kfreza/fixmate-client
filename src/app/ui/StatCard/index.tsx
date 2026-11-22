import type { LucideIcon } from "lucide-react";

export type Cs_StatTone = "primary" | "accent" | "blue" | "green" | "amber" | "red";

type Cs_StatCardProps = {
  cs_icon: LucideIcon;
  cs_label: string;
  cs_value: string | number;
  cs_hint?: string;
  cs_tone?: Cs_StatTone;
};

const CS_TONES: Record<Cs_StatTone, string> = {
  primary: "bg-(--cs_primary_color)/12 text-(--cs_primary_color)",
  accent: "bg-(--cs_accent_color)/15 text-(--cs_accent_color)",
  blue: "bg-blue-500/12 text-blue-600 dark:text-blue-400",
  green: "bg-green-500/12 text-green-600 dark:text-green-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  red: "bg-red-500/12 text-red-600 dark:text-red-400",
};

// One number on a dashboard overview
const Cs_StatCard = ({ cs_icon: Cs_Icon, cs_label, cs_value, cs_hint, cs_tone = "primary" }: Cs_StatCardProps) => {
  return (
    <div className="cs_stat_card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-(--cs_body_color)">{cs_label}</p>
        <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${CS_TONES[cs_tone]}`}>
          <Cs_Icon className="size-5" />
        </span>
      </div>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-(--cs_heading_color)">{cs_value}</p>
      {cs_hint && <p className="mt-1 text-xs text-(--cs_body_color)">{cs_hint}</p>}
    </div>
  );
};

export default Cs_StatCard;
