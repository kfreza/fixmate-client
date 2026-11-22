import Link from "next/link";
import { ArrowRightIcon, WrenchIcon } from "lucide-react";
import { cs_serverFetch } from "@/lib/cs_serverFetch";
import type { Cs_ListResponse, Cs_Service } from "@/lib/cs_types";
import Cs_ServiceCard from "@/app/ui/ServiceCard";

const cs_data = {
  eyebrow: "Featured services",
  title: "Latest repair services near you",
  subtitle: "Fresh listings from approved technicians, ready to book today.",
};

// 6 latest approved + available services
const Cs_FeaturedServices = async () => {
  const cs_response = await cs_serverFetch<Cs_ListResponse<Cs_Service>>("/api/services/featured");
  const cs_services = cs_response?.items ?? [];

  return (
    <section className="cs_section">
      <div className="cs_container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="cs_eyebrow">{cs_data.eyebrow}</span>
            <h2 className="cs_section_title mt-4">{cs_data.title}</h2>
            <p className="cs_section_subtitle">{cs_data.subtitle}</p>
          </div>
          <Link href="/services" className="cs_btn cs_btn_style_3 shrink-0 self-start md:self-auto">
            View all services
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {cs_services.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cs_services.map((cs_service) => (
              <Cs_ServiceCard key={cs_service._id} cs_data={cs_service} />
            ))}
          </div>
        ) : (
          <div className="cs_empty_state mt-12">
            <WrenchIcon className="size-8 text-(--cs_primary_color)" />
            <p className="font-semibold text-(--cs_heading_color)">No services to show yet</p>
            <p className="text-sm text-(--cs_body_color)">New repair services will appear here once they are approved.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cs_FeaturedServices;
