"use client";

import { useEffect, useEffectEvent, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircleIcon, RotateCcwIcon, SearchIcon, XIcon } from "lucide-react";
import { CS_CATEGORIES, CS_SERVICE_MODES, CS_SORT_OPTIONS } from "@/lib/cs_constants";
import {
  cs_buildServiceQuery,
  cs_hasActiveFilters,
  cs_parseServiceQuery,
  type Cs_ServiceQuery,
} from "@/lib/cs_serviceQuery";

const CS_SEARCH_DELAY = 400;

// Every filter lives in the URL, so reloads and shared links keep it
const Cs_ServiceFilters = () => {
  const cs_router = useRouter();
  const cs_pathname = usePathname();
  const cs_searchParams = useSearchParams();
  const [cs_isPending, cs_startTransition] = useTransition();

  const cs_current = cs_parseServiceQuery(cs_searchParams);
  const [cs_text, cs_setText] = useState(cs_current.search);
  const [cs_sentSearch, cs_setSentSearch] = useState(cs_current.search);
  const [cs_urlSearch, cs_setUrlSearch] = useState(cs_current.search);

  // Sync the box only when the URL changes from outside (back button)
  if (cs_current.search !== cs_urlSearch) {
    cs_setUrlSearch(cs_current.search);
    if (cs_current.search !== cs_sentSearch) {
      cs_setSentSearch(cs_current.search);
      cs_setText(cs_current.search);
    }
  }

  const cs_navigate = (cs_changes: Partial<Cs_ServiceQuery>) => {
    // Any filter change starts again from page 1
    const cs_next = { ...cs_current, page: 1, ...cs_changes };
    const cs_string = cs_buildServiceQuery(cs_next);
    cs_setSentSearch(cs_next.search);
    cs_startTransition(() => {
      cs_router.replace(cs_string ? `${cs_pathname}?${cs_string}` : cs_pathname, { scroll: false });
    });
  };

  const cs_onSearchSettled = useEffectEvent((cs_search: string) => cs_navigate({ search: cs_search }));

  // Debounced search
  useEffect(() => {
    const cs_trimmed = cs_text.trim();
    if (cs_trimmed === cs_sentSearch) return;
    const cs_timer = setTimeout(() => cs_onSearchSettled(cs_trimmed), CS_SEARCH_DELAY);
    return () => clearTimeout(cs_timer);
  }, [cs_text, cs_sentSearch]);

  return (
    <div className="cs_filter_bar">
      <div className="cs_filter_search">
        {cs_isPending ? (
          <LoaderCircleIcon className="size-5 shrink-0 animate-spin text-(--cs_primary_color)" />
        ) : (
          <SearchIcon className="size-5 shrink-0 text-(--cs_body_color)" />
        )}
        <input
          type="search"
          value={cs_text}
          onChange={(cs_event) => cs_setText(cs_event.target.value)}
          placeholder="Search by service or category"
          aria-label="Search services"
          maxLength={100}
          className="min-w-0 flex-1 bg-transparent text-sm text-(--cs_heading_color) outline-none placeholder:text-(--cs_body_color)/70 [&::-webkit-search-cancel-button]:hidden"
        />
        {cs_text && (
          <button
            type="button"
            onClick={() => cs_setText("")}
            aria-label="Clear search"
            className="rounded-full p-1 text-(--cs_body_color) hover:text-(--cs_heading_color)"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      <select
        value={cs_current.category}
        onChange={(cs_event) => cs_navigate({ category: cs_event.target.value as Cs_ServiceQuery["category"] })}
        aria-label="Filter by category"
        className="cs_select"
      >
        <option value="">All categories</option>
        {CS_CATEGORIES.map((cs_category) => (
          <option key={cs_category} value={cs_category}>
            {cs_category}
          </option>
        ))}
      </select>

      <select
        value={cs_current.mode}
        onChange={(cs_event) => cs_navigate({ mode: cs_event.target.value as Cs_ServiceQuery["mode"] })}
        aria-label="Filter by service mode"
        className="cs_select"
      >
        <option value="">Any service mode</option>
        {CS_SERVICE_MODES.map((cs_mode) => (
          <option key={cs_mode} value={cs_mode}>
            {cs_mode}
          </option>
        ))}
      </select>

      <select
        value={cs_current.sort}
        onChange={(cs_event) => cs_navigate({ sort: cs_event.target.value as Cs_ServiceQuery["sort"] })}
        aria-label="Sort services"
        className="cs_select"
      >
        {CS_SORT_OPTIONS.map((cs_option) => (
          <option key={cs_option.cs_value} value={cs_option.cs_value}>
            {cs_option.cs_label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => {
          cs_setText("");
          cs_navigate({ search: "", category: "", mode: "", sort: "newest" });
        }}
        disabled={!cs_hasActiveFilters(cs_current) && cs_current.sort === "newest"}
        className="cs_btn cs_btn_style_3 h-11 px-4"
      >
        <RotateCcwIcon className="size-4" />
        Reset
      </button>
    </div>
  );
};

export default Cs_ServiceFilters;
