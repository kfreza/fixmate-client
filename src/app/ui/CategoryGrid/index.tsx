import Link from "next/link";
import { ArrowUpRightIcon, LayoutGridIcon } from "lucide-react";
import { CS_CATEGORIES, cs_getCategoryPath, type Cs_Category } from "@/lib/cs_constants";
import { CS_CATEGORY_ICONS } from "@/lib/cs_categoryIcons";

const cs_data = {
  eyebrow: "Popular categories",
  title: "What do you need fixed?",
  subtitle: "Pick a category to see every approved repair service for it.",
  blurbs: {
    Smartphone: "Screens, batteries, charging ports",
    "Laptop & PC": "Boards, keyboards, OS and upgrades",
    AC: "Gas refill, servicing, installation",
    Refrigerator: "Cooling, compressor, gas leaks",
    TV: "Panels, backlight, power boards",
    "Washing Machine": "Drums, motors, water leaks",
    Electrical: "Wiring, switchboards, fittings",
  } satisfies Record<Cs_Category, string>,
};

// Each card opens /services already filtered
const Cs_CategoryGrid = () => {
  return (
    <section className="cs_section">
      <div className="cs_container">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h2 className="cs_section_title mt-4">{cs_data.title}</h2>
          <p className="cs_section_subtitle">{cs_data.subtitle}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {CS_CATEGORIES.map((cs_category) => {
            const Cs_Icon = CS_CATEGORY_ICONS[cs_category];
            return (
              <Link key={cs_category} href={cs_getCategoryPath(cs_category)} className="cs_category_card group">
                <ArrowUpRightIcon className="cs_category_arrow" />
                <span className="cs_category_icon">
                  <Cs_Icon className="size-6" />
                </span>
                <span className="mt-4 font-semibold text-(--cs_heading_color)">{cs_category}</span>
                <span className="mt-1 text-xs leading-relaxed text-(--cs_body_color)">{cs_data.blurbs[cs_category]}</span>
              </Link>
            );
          })}

          <Link href="/services" className="cs_category_card cs_category_card_all group">
            <ArrowUpRightIcon className="cs_category_arrow" />
            <span className="cs_category_icon">
              <LayoutGridIcon className="size-6" />
            </span>
            <span className="mt-4 font-semibold">All Services</span>
            <span className="mt-1 text-xs leading-relaxed opacity-80">Browse every available repair</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cs_CategoryGrid;
