import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

const cs_data = {
  title: "Got something that needs fixing?",
  text: "Browse approved technicians near you, or join FixMate and start taking repair jobs today.",
};

const Cs_CtaBanner = () => {
  return (
    <section className="cs_container pb-16 md:pb-24">
      <div className="cs_cta_banner cs_blueprint_bg">
        <div className="max-w-xl">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-(--cs_heading_color) md:text-3xl">{cs_data.title}</h2>
          <p className="mt-3 leading-relaxed text-(--cs_body_color)">{cs_data.text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/services" className="cs_btn cs_btn_style_1">
            Browse Services
            <ArrowRightIcon className="size-4" />
          </Link>
          <Link href="/sign-up" className="cs_btn cs_btn_style_3">
            Become a Technician
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cs_CtaBanner;
