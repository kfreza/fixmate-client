import { CheckIcon, ShieldCheckIcon, UserIcon, WrenchIcon } from "lucide-react";

const cs_data = {
  eyebrow: "One platform, three roles",
  title: "Everyone knows exactly what to do",
  roles: [
    {
      icon: UserIcon,
      title: "Customers",
      text: "Find a trusted fix without phone calls.",
      points: ["Search and filter approved services", "Send a request with date and address", "Track every status change", "Pay online after the job is done"],
    },
    {
      icon: WrenchIcon,
      title: "Technicians",
      text: "Grow a repair business online.",
      points: ["List services with price and area", "Accept or reject incoming requests", "Move jobs from accepted to completed", "See earnings in one dashboard"],
    },
    {
      icon: ShieldCheckIcon,
      title: "Admins",
      text: "Keep the marketplace safe.",
      points: ["Approve or reject new listings", "Manage user roles and accounts", "Watch every booking on the platform", "Review all payments in one place"],
    },
  ],
};

const Cs_RoleOverview = () => {
  return (
    <section className="cs_section">
      <div className="cs_container">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h2 className="cs_section_title mt-4">{cs_data.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cs_data.roles.map(({ icon: Cs_Icon, title, text, points }) => (
            <article key={title} className="cs_role_overview_card">
              <span className="cs_step_icon">
                <Cs_Icon className="size-6" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-(--cs_heading_color)">{title}</h3>
              <p className="mt-1 text-sm text-(--cs_body_color)">{text}</p>
              <ul className="mt-5 flex flex-col gap-2.5 border-t border-(--cs_border_color) pt-5">
                {points.map((cs_point) => (
                  <li key={cs_point} className="flex items-start gap-2.5 text-sm text-(--cs_heading_color)">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-(--cs_primary_color)" />
                    {cs_point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cs_RoleOverview;
