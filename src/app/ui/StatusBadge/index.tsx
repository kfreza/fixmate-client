// Same colors everywhere (brief §9)
const CS_STATUS_STYLES: Record<string, string> = {
  requested: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
  accepted: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
  "in-progress": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  completed: "bg-green-500/12 text-green-700 dark:text-green-300",
  rejected: "bg-red-500/12 text-red-700 dark:text-red-300",
  cancelled: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  unpaid: "bg-slate-500/12 text-slate-700 dark:text-slate-300",
  // Service approval
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  approved: "bg-green-500/12 text-green-700 dark:text-green-300",
};

const CS_STATUS_LABELS: Record<string, string> = { "in-progress": "In Progress" };

type Cs_StatusBadgeProps = {
  cs_status: string;
};

const Cs_StatusBadge = ({ cs_status }: Cs_StatusBadgeProps) => {
  const cs_label = CS_STATUS_LABELS[cs_status] ?? cs_status.charAt(0).toUpperCase() + cs_status.slice(1);
  return (
    <span className={`cs_status_badge ${CS_STATUS_STYLES[cs_status] ?? CS_STATUS_STYLES.cancelled}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {cs_label}
    </span>
  );
};

export default Cs_StatusBadge;
