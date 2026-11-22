import { ClockIcon, HomeIcon, MapPinIcon, ShieldCheckIcon, StoreIcon } from "lucide-react";
import type { Cs_Service } from "@/lib/cs_types";

type Cs_ServiceBookingCardProps = {
  cs_data: Pick<Cs_Service, "basePrice" | "estimatedDuration" | "serviceMode" | "serviceArea">;
  children?: React.ReactNode;
};

const cs_steps = ["Send a repair request", "Technician accepts and fixes it", "Pay online after completion"];

// Price summary; the request button is passed in as children
const Cs_ServiceBookingCard = ({ cs_data, children }: Cs_ServiceBookingCardProps) => {
  const cs_facts = [
    { cs_icon: ClockIcon, cs_label: "Estimated time", cs_value: cs_data.estimatedDuration },
    {
      cs_icon: cs_data.serviceMode === "Home Visit" ? HomeIcon : StoreIcon,
      cs_label: "Service mode",
      cs_value: cs_data.serviceMode,
    },
    { cs_icon: MapPinIcon, cs_label: "Service area", cs_value: cs_data.serviceArea },
  ];

  return (
    <div className="cs_detail_card">
      <p className="text-sm text-(--cs_body_color)">Starting from</p>
      <p className="font-heading text-4xl font-bold text-(--cs_heading_color)">${cs_data.basePrice}</p>
      <p className="mt-1 text-xs text-(--cs_body_color)">The final price is set by the technician after inspection.</p>

      <dl className="mt-6 flex flex-col gap-3 border-t border-(--cs_border_color) pt-5">
        {cs_facts.map(({ cs_icon: Cs_Icon, cs_label, cs_value }) => (
          <div key={cs_label} className="flex items-center justify-between gap-4 text-sm">
            <dt className="flex items-center gap-2 text-(--cs_body_color)">
              <Cs_Icon className="size-4 text-(--cs_primary_color)" />
              {cs_label}
            </dt>
            <dd className="text-right font-medium text-(--cs_heading_color)">{cs_value}</dd>
          </div>
        ))}
      </dl>

      {children && <div className="mt-6">{children}</div>}

      <ol className="mt-6 flex flex-col gap-2.5 rounded-xl bg-(--cs_soft_color) p-4">
        {cs_steps.map((cs_step, cs_index) => (
          <li key={cs_step} className="flex items-center gap-3 text-sm text-(--cs_heading_color)">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-(--cs_card_color) text-xs font-bold text-(--cs_primary_color)">
              {cs_index + 1}
            </span>
            {cs_step}
          </li>
        ))}
      </ol>

      <p className="mt-4 flex items-center gap-2 text-xs text-(--cs_body_color)">
        <ShieldCheckIcon className="size-4 shrink-0 text-(--cs_primary_color)" />
        No payment until the job is completed.
      </p>
    </div>
  );
};

export default Cs_ServiceBookingCard;
