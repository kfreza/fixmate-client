import { CheckIcon, CreditCardIcon, SmartphoneIcon, StarIcon, WrenchIcon } from "lucide-react";

const cs_data = {
  job: { title: "iPhone 13 Screen Replacement", meta: "Booked for today, 4:00 PM" },
  steps: [
    { label: "Requested", time: "10:12 AM", state: "done" },
    { label: "Accepted", time: "10:20 AM", state: "done" },
    { label: "In Progress", time: "Technician is working", state: "current" },
    { label: "Completed", time: "Pay after the fix", state: "next" },
  ],
  technician: { initials: "RH", name: "Rafiq Hasan", area: "Dhanmondi, Dhaka", rating: "4.9" },
};

// Hero illustration: a live repair tracker mockup
const Cs_HeroTracker = () => {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
      <div className="cs_hero_glow" />

      <div className="cs_tracker_card relative">
        <div className="flex items-center gap-3 border-b border-(--cs_border_color) pb-4">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-(--cs_soft_color) text-(--cs_primary_color)">
            <SmartphoneIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-(--cs_heading_color)">{cs_data.job.title}</p>
            <p className="text-xs text-(--cs_body_color)">{cs_data.job.meta}</p>
          </div>
        </div>

        <ol className="mt-5 flex flex-col gap-4">
          {cs_data.steps.map((cs_step) => (
            <li key={cs_step.label} className={`cs_tracker_step cs_${cs_step.state}`}>
              <span className="cs_tracker_dot">
                {cs_step.state === "done" && <CheckIcon className="size-3.5" strokeWidth={3} />}
                {cs_step.state === "current" && <WrenchIcon className="size-3.5" />}
              </span>
              <div>
                <p className="text-sm font-semibold text-(--cs_heading_color)">{cs_step.label}</p>
                <p className="text-xs text-(--cs_body_color)">{cs_step.time}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Floating technician chip */}
      <div className="cs_float_card -top-6 -right-2 sm:-right-8">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-(--cs_primary_color) text-xs font-bold text-(--cs_primary_text_color)">
          {cs_data.technician.initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-(--cs_heading_color)">{cs_data.technician.name}</p>
          <p className="flex items-center gap-1 text-xs text-(--cs_body_color)">
            <StarIcon className="size-3 fill-amber-400 text-amber-400" />
            {cs_data.technician.rating} · {cs_data.technician.area}
          </p>
        </div>
      </div>

      {/* Floating payment chip */}
      <div className="cs_float_card -bottom-6 -left-2 sm:-left-8">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-(--cs_accent_color)/15 text-(--cs_accent_color)">
          <CreditCardIcon className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-(--cs_heading_color)">Pay after it&apos;s fixed</p>
          <p className="text-xs text-(--cs_body_color)">Secure checkout by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default Cs_HeroTracker;
