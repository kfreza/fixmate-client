import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cs_getServicesHref, type Cs_ServiceQuery } from "@/lib/cs_serviceQuery";

type Cs_PaginationProps = {
  cs_query: Cs_ServiceQuery;
  cs_pages: number;
};

// First, last, and the pages next to the current one
const cs_getPageItems = (cs_page: number, cs_pages: number) => {
  const cs_items: (number | "gap")[] = [];
  for (let cs_index = 1; cs_index <= cs_pages; cs_index++) {
    if (cs_index === 1 || cs_index === cs_pages || Math.abs(cs_index - cs_page) <= 1) {
      cs_items.push(cs_index);
    } else if (cs_items.at(-1) !== "gap") {
      cs_items.push("gap");
    }
  }
  return cs_items;
};

const Cs_Pagination = ({ cs_query, cs_pages }: Cs_PaginationProps) => {
  if (cs_pages <= 1) return null;

  const cs_page = cs_query.page;
  const cs_hrefFor = (cs_target: number) => cs_getServicesHref({ ...cs_query, page: cs_target });

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {cs_page > 1 ? (
        <Link href={cs_hrefFor(cs_page - 1)} className="cs_page_link" aria-label="Previous page">
          <ChevronLeftIcon className="size-4" />
        </Link>
      ) : (
        <span className="cs_page_link cs_disabled" aria-hidden>
          <ChevronLeftIcon className="size-4" />
        </span>
      )}

      {cs_getPageItems(cs_page, cs_pages).map((cs_item, cs_index) =>
        cs_item === "gap" ? (
          <span key={`gap-${cs_index}`} className="px-1 text-(--cs_body_color)">
            …
          </span>
        ) : (
          <Link
            key={cs_item}
            href={cs_hrefFor(cs_item)}
            aria-current={cs_item === cs_page ? "page" : undefined}
            className={`cs_page_link ${cs_item === cs_page ? "cs_active" : ""}`}
          >
            {cs_item}
          </Link>
        ),
      )}

      {cs_page < cs_pages ? (
        <Link href={cs_hrefFor(cs_page + 1)} className="cs_page_link" aria-label="Next page">
          <ChevronRightIcon className="size-4" />
        </Link>
      ) : (
        <span className="cs_page_link cs_disabled" aria-hidden>
          <ChevronRightIcon className="size-4" />
        </span>
      )}
    </nav>
  );
};

export default Cs_Pagination;
