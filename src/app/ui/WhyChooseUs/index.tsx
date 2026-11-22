import { BadgeCheckIcon, HeadsetIcon, ReceiptIcon, ShieldCheckIcon } from "lucide-react";

const cs_data = {
  eyebrow: "Why choose FixMate",
  title: "Repairs without the usual worries",
  subtitle:
    "We check every technician and every listing before it goes live, and your money stays with you until the job is done.",
  stats: [
    { value: "120+", label: "Verified technicians" },
    { value: "3,400+", label: "Jobs completed" },
    { value: "4.8/5", label: "Average rating" },
    { value: "100%", label: "Pay after service" },
  ],
  points: [
    { icon: BadgeCheckIcon, title: "Approved listings only", text: "An admin reviews every service before customers can book it." },
    { icon: ShieldCheckIcon, title: "Clear job status", text: "Requested, accepted, in progress, completed. Always know where you stand." },
    { icon: ReceiptIcon, title: "Transparent pricing", text: "See the starting price up front and pay the final amount online." },
    { icon: HeadsetIcon, title: "Local support", text: "A Dhaka-based team ready to help if anything goes wrong." },
  ],
};

const Cs_WhyChooseUs = () => {
  return (
    <section className="cs_why_section">
      <div className="cs_container grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">{cs_data.title}</h2>
          <p className="mt-3 max-w-xl leading-relaxed text-slate-300">{cs_data.subtitle}</p>

          <dl className="mt-10 grid grid-cols-2 gap-4">
            {cs_data.stats.map((cs_stat) => (
              <div key={cs_stat.label} className="cs_stat_tile">
                <dt className="order-2 text-sm text-slate-300">{cs_stat.label}</dt>
                <dd className="font-heading text-3xl font-bold text-white">{cs_stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {cs_data.points.map(({ icon: Cs_Icon, title, text }) => (
            <li key={title} className="cs_why_point">
              <span className="cs_why_icon">
                <Cs_Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Cs_WhyChooseUs;
