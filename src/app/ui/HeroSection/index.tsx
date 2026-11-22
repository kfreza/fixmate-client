import { BadgeCheckIcon, ShieldCheckIcon, WalletIcon } from "lucide-react";
import Cs_HeroSearch from "@/app/ui/HeroSearch";
import Cs_HeroTracker from "@/app/ui/HeroTracker";

const cs_data = {
  eyebrow: "Repair marketplace for Dhaka",
  subtitle:
    "Book admin-approved technicians for phones, laptops, ACs and home appliances. Track every step of the job and pay only after it's done.",
  trustPoints: [
    { icon: BadgeCheckIcon, label: "Verified technicians" },
    { icon: ShieldCheckIcon, label: "Live job tracking" },
    { icon: WalletIcon, label: "Pay after service" },
  ],
};

const Cs_HeroSection = () => {
  return (
    <section className="cs_hero cs_blueprint_bg">
      <div className="cs_container grid items-center gap-16 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="flex flex-col gap-7">
          <span className="cs_eyebrow">
            <span className="size-1.5 rounded-full bg-(--cs_accent_color)" />
            {cs_data.eyebrow}
          </span>

          <h1 className="cs_hero_title">
            Broken Device? Get It Fixed by <span className="cs_hero_highlight">Verified Technicians</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-(--cs_body_color) md:text-lg">{cs_data.subtitle}</p>

          <Cs_HeroSearch />

          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
            {cs_data.trustPoints.map(({ icon: Cs_Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm font-medium text-(--cs_heading_color)">
                <Cs_Icon className="size-4 text-(--cs_primary_color)" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <Cs_HeroTracker />
      </div>
    </section>
  );
};

export default Cs_HeroSection;
