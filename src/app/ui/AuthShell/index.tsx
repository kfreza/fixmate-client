import type { ReactNode } from "react";
import { BadgeCheckIcon, CreditCardIcon, ListChecksIcon } from "lucide-react";

const cs_data = {
  heading: "Repairs you can track, payments you can trust.",
  points: [
    { icon: BadgeCheckIcon, text: "Admin-approved technicians only" },
    { icon: ListChecksIcon, text: "Follow every job from request to completion" },
    { icon: CreditCardIcon, text: "Pay securely only after the job is done" },
  ],
};

type Cs_AuthShellProps = {
  cs_title: string;
  cs_subtitle: string;
  children: ReactNode;
};

// Shared layout for sign-in and sign-up
const Cs_AuthShell = ({ cs_title, cs_subtitle, children }: Cs_AuthShellProps) => {
  return (
    <section className="cs_blueprint_bg flex flex-1 items-center py-10 md:py-16">
      <div className="cs_container">
        <div className="cs_auth_card">
          {/* Brand panel */}
          <aside className="cs_auth_panel">
            <h2 className="text-2xl leading-snug font-bold text-white xl:text-3xl">{cs_data.heading}</h2>
            <ul className="mt-8 flex flex-col gap-4">
              {cs_data.points.map(({ icon: Cs_Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-teal-50">
                  <span className="cs_auth_panel_icon">
                    <Cs_Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </aside>

          {/* Form side */}
          <div className="p-6 sm:p-10">
            <h1 className="text-2xl font-bold text-(--cs_heading_color) sm:text-3xl">{cs_title}</h1>
            <p className="mt-2 text-sm text-(--cs_body_color)">{cs_subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cs_AuthShell;
