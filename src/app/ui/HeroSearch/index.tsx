"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "lucide-react";
import { cs_getCategoryPath } from "@/lib/cs_constants";

const cs_data = {
  quickCategories: ["Smartphone", "AC", "Laptop & PC", "Refrigerator"],
};

// Sends the query to /services?search=
const Cs_HeroSearch = () => {
  const cs_router = useRouter();
  const [cs_query, cs_setQuery] = useState("");

  const cs_handleSubmit = (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    const cs_trimmed = cs_query.trim();
    cs_router.push(cs_trimmed ? `/services?search=${encodeURIComponent(cs_trimmed)}` : "/services");
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={cs_handleSubmit} role="search" className="cs_search_box">
        <SearchIcon className="ml-2 size-5 shrink-0 text-(--cs_body_color)" />
        <input
          type="search"
          value={cs_query}
          onChange={(cs_event) => cs_setQuery(cs_event.target.value)}
          placeholder="What needs fixing? e.g. screen, AC gas"
          aria-label="Search repair services"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-(--cs_heading_color) outline-none placeholder:text-(--cs_body_color)/70"
        />
        <button type="submit" className="cs_btn cs_btn_style_1 px-5 py-2.5 sm:px-7">
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-(--cs_body_color)">Popular:</span>
        {cs_data.quickCategories.map((cs_category) => (
          <Link key={cs_category} href={cs_getCategoryPath(cs_category)} className="cs_chip">
            {cs_category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cs_HeroSearch;
