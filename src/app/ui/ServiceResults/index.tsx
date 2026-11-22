import Link from "next/link";
import { RotateCcwIcon, SearchXIcon, ServerCrashIcon } from "lucide-react";
import { CS_SERVICES_PAGE_LIMIT } from "@/lib/cs_constants";
import { cs_serverFetch } from "@/lib/cs_serverFetch";
import { cs_buildServiceQuery, cs_hasActiveFilters, type Cs_ServiceQuery } from "@/lib/cs_serviceQuery";
import type { Cs_PagedResponse, Cs_Service } from "@/lib/cs_types";
import Cs_ServiceCard from "@/app/ui/ServiceCard";
import Cs_Pagination from "@/app/ui/Pagination";

type Cs_ServiceResultsProps = {
  cs_query: Cs_ServiceQuery;
};

// Search, filter, sort and paging all run on the server
const Cs_ServiceResults = async ({ cs_query }: Cs_ServiceResultsProps) => {
  const cs_params = new URLSearchParams(cs_buildServiceQuery(cs_query));
  cs_params.set("limit", String(CS_SERVICES_PAGE_LIMIT));
  // Always fresh, so newly approved services show up at once
  const cs_response = await cs_serverFetch<Cs_PagedResponse<Cs_Service>>(`/api/services?${cs_params}`, 0);

  if (!cs_response) {
    return (
      <div className="cs_empty_state">
        <ServerCrashIcon className="size-8 text-destructive" />
        <p className="font-semibold text-(--cs_heading_color)">Could not load services</p>
        <p className="text-sm text-(--cs_body_color)">Please refresh the page in a moment.</p>
      </div>
    );
  }

  const { items: cs_items, total: cs_total, page: cs_page, pages: cs_pages, limit: cs_limit } = cs_response;

  if (!cs_items.length) {
    return (
      <div className="cs_empty_state">
        <SearchXIcon className="size-8 text-(--cs_primary_color)" />
        <p className="font-semibold text-(--cs_heading_color)">No services match your search</p>
        <p className="max-w-sm text-sm text-(--cs_body_color)">
          {cs_hasActiveFilters(cs_query)
            ? "Try a different keyword, or remove a filter to see more results."
            : "New repair services will appear here once they are approved."}
        </p>
        {cs_hasActiveFilters(cs_query) && (
          <Link href="/services" className="cs_btn cs_btn_style_3 mt-3">
            <RotateCcwIcon className="size-4" />
            Clear all filters
          </Link>
        )}
      </div>
    );
  }

  const cs_from = (cs_page - 1) * cs_limit + 1;
  const cs_to = cs_from + cs_items.length - 1;

  return (
    <>
      <p className="text-sm text-(--cs_body_color)" aria-live="polite">
        Showing{" "}
        <span className="font-semibold text-(--cs_heading_color)">
          {cs_from}–{cs_to}
        </span>{" "}
        of <span className="font-semibold text-(--cs_heading_color)">{cs_total}</span>{" "}
        {cs_total === 1 ? "service" : "services"}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cs_items.map((cs_service) => (
          <Cs_ServiceCard key={cs_service._id} cs_data={cs_service} />
        ))}
      </div>

      {/* Use the page the server settled on (it clamps too-high pages) */}
      <Cs_Pagination cs_query={{ ...cs_query, page: cs_page }} cs_pages={cs_pages} />
    </>
  );
};

export default Cs_ServiceResults;
