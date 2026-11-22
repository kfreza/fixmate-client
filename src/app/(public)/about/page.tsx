import type { Metadata } from "next";
import { HandshakeIcon, ScaleIcon, ShieldCheckIcon } from "lucide-react";
import Cs_HowItWorks from "@/app/ui/HowItWorks";
import Cs_RoleOverview from "@/app/ui/RoleOverview";
import Cs_CtaBanner from "@/app/ui/CtaBanner";

export const metadata: Metadata = {
  title: "About & How It Works",
  description: "How FixMate connects customers with verified repair technicians, from request to payment.",
};

const cs_data = {
  eyebrow: "About FixMate",
  title: "Repairs made simple, fair and trackable",
  subtitle:
    "FixMate connects people in Dhaka with verified technicians for phones, laptops and home appliances. No phone tag, no hidden costs.",
  storyTitle: "Why we built FixMate",
  story: [
    "Finding a reliable technician usually means asking around, waiting for call-backs and hoping the price stays the same. Many people pay up front and then lose track of their device.",
    "FixMate brings the whole job into one place. Customers see approved listings with clear starting prices, technicians receive organised requests, and every job moves through the same visible steps until it is paid for.",
  ],
  values: [
    { icon: ShieldCheckIcon, title: "Trust first", text: "Every listing is approved by an admin before anyone can book it." },
    { icon: ScaleIcon, title: "Fair payment", text: "Customers pay online only after the job is marked completed." },
    { icon: HandshakeIcon, title: "Local work", text: "We help neighbourhood technicians reach more customers." },
  ],
};

const Cs_AboutPage = () => {
  return (
    <>
      <section className="cs_page_hero cs_blueprint_bg">
        <div className="cs_container">
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h1 className="cs_section_title mt-4 max-w-3xl">{cs_data.title}</h1>
          <p className="cs_section_subtitle">{cs_data.subtitle}</p>
        </div>
      </section>

      <section className="cs_section">
        <div className="cs_container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="cs_section_title">{cs_data.storyTitle}</h2>
            {cs_data.story.map((cs_paragraph) => (
              <p key={cs_paragraph.slice(0, 20)} className="mt-4 leading-relaxed text-(--cs_body_color)">
                {cs_paragraph}
              </p>
            ))}
          </div>
          <ul className="grid gap-4">
            {cs_data.values.map(({ icon: Cs_Icon, title, text }) => (
              <li key={title} className="cs_value_card">
                <span className="cs_category_icon shrink-0">
                  <Cs_Icon className="size-6" />
                </span>
                <div>
                  <h3 className="font-semibold text-(--cs_heading_color)">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-(--cs_body_color)">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cs_HowItWorks />
      <Cs_RoleOverview />
      <Cs_CtaBanner />
    </>
  );
};

export default Cs_AboutPage;
