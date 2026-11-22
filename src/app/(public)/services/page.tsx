import { Suspense } from "react";
import type { Metadata } from "next";
import { CS_SERVICES_PAGE_LIMIT } from "@/lib/cs_constants";
import { cs_buildServiceQuery, cs_parseServiceQuery } from "@/lib/cs_serviceQuery";
import Cs_ServiceFilters from "@/app/ui/ServiceFilters";
import Cs_ServiceResults from "@/app/ui/ServiceResults";
import Cs_ServiceGridSkeleton from "@/app/ui/ServiceGridSkeleton";

const cs_data = {
  eyebrow: "Browse services",
  title: "Find the right repair service",
  subtitle: "Every listing here is approved by our team and ready to book.",
};

export const generateMetadata = async ({ searchParams }: PageProps<"/services">): Promise<Metadata> => {
  const { category: cs_category } = cs_parseServiceQuery(await searchParams);
  return {
    title: cs_category ? `${cs_category} Repair Services` : "Browse Services",
    description: "Search and filter approved repair services from verified technicians.",
  };
};

const Cs_ServicesPage = async ({ searchParams }: PageProps<"/services">) => {
  const cs_query = cs_parseServiceQuery(await searchParams);

  return (
    <>
      <section className="cs_page_hero cs_blueprint_bg">
        <div className="cs_container">
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h1 className="cs_section_title mt-4">{cs_query.category ? `${cs_query.category} repair services` : cs_data.title}</h1>
          <p className="cs_section_subtitle">{cs_data.subtitle}</p>
        </div>
      </section>

      <section className="cs_container pt-8 pb-16 md:pb-24">
        <Cs_ServiceFilters />

        <div className="mt-8">
          {/* New key per query, so the skeleton shows while new results load */}
          <Suspense key={cs_buildServiceQuery(cs_query)} fallback={<Cs_ServiceGridSkeleton cs_count={CS_SERVICES_PAGE_LIMIT} />}>
            <Cs_ServiceResults cs_query={cs_query} />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default Cs_ServicesPage;
