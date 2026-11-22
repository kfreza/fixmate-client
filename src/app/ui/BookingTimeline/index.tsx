import { BanIcon, CheckIcon, XIcon } from "lucide-react";
import { cs_formatDateTime } from "@/lib/cs_format";
import type { Cs_Booking } from "@/lib/cs_types";

type Cs_BookingTimelineProps = {
  cs_data: Pick<Cs_Booking, "status" | "paymentStatus" | "statusHistory">;
};

const CS_STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
] as const;

type Cs_StepState = "done" | "current" | "upcoming" | "stopped";

// Job tracker: each step shows when it happened (from statusHistory)
const Cs_BookingTimeline = ({ cs_data }: Cs_BookingTimelineProps) => {
  const cs_timeOf = (cs_key: string) => cs_data.statusHistory?.find((cs_item) => cs_item.status === cs_key)?.changedAt;
  const cs_isStopped = cs_data.status === "rejected" || cs_data.status === "cancelled";
  const cs_reached = cs_data.paymentStatus === "paid" ? "paid" : cs_data.status;
  const cs_reachedIndex = cs_isStopped ? 0 : CS_STEPS.findIndex((cs_step) => cs_step.key === cs_reached);

  // A stopped job shows Requested, then the final red/grey step
  const cs_steps: { key: string; label: string; state: Cs_StepState }[] = cs_isStopped
    ? [
        { key: "requested", label: "Requested", state: "done" },
        { key: cs_data.status, label: cs_data.status === "rejected" ? "Rejected" : "Cancelled", state: "stopped" },
      ]
    : CS_STEPS.map((cs_step, cs_index) => ({
        ...cs_step,
        state: cs_index < cs_reachedIndex ? "done" : cs_index === cs_reachedIndex ? (cs_step.key === "paid" ? "done" : "current") : "upcoming",
      }));

  return (
    <ol className="flex flex-col">
      {cs_steps.map((cs_step, cs_index) => {
        const cs_time = cs_timeOf(cs_step.key);
        const cs_isLast = cs_index === cs_steps.length - 1;
        return (
          <li key={cs_step.key} className={`cs_timeline_step cs_${cs_step.state}`}>
            <div className="flex flex-col items-center">
              <span className="cs_timeline_dot">
                {cs_step.state === "done" && <CheckIcon className="size-3.5" strokeWidth={3} />}
                {cs_step.state === "stopped" &&
                  (cs_step.key === "rejected" ? <XIcon className="size-3.5" strokeWidth={3} /> : <BanIcon className="size-3.5" />)}
                {cs_step.state === "current" && <span className="size-2 rounded-full bg-current" />}
              </span>
              {!cs_isLast && <span className="cs_timeline_line" />}
            </div>
            <div className={`min-w-0 ${cs_isLast ? "" : "pb-5"}`}>
              <p className="text-sm font-semibold">{cs_step.label}</p>
              <p className="text-xs text-(--cs_body_color)">
                {cs_time ? cs_formatDateTime(cs_time) : cs_step.state === "current" ? "In progress now" : cs_step.state === "upcoming" ? "Waiting" : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Cs_BookingTimeline;
