import {
  CS_CATEGORIES,
  CS_SERVICE_MODES,
  CS_SORT_OPTIONS,
  type Cs_Category,
  type Cs_SortKey,
} from "@/lib/cs_constants";
import type { Cs_ServiceMode } from "@/lib/cs_types";

// Clean browse filters, read from the URL
export interface Cs_ServiceQuery {
  search: string;
  category: Cs_Category | "";
  mode: Cs_ServiceMode | "";
  sort: Cs_SortKey;
  page: number;
}

type Cs_RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

const cs_readParam = (cs_params: Cs_RawParams, cs_key: string) => {
  const cs_value = cs_params instanceof URLSearchParams ? cs_params.get(cs_key) : cs_params[cs_key];
  return (Array.isArray(cs_value) ? cs_value[0] : cs_value) ?? "";
};

// Unknown values fall back to defaults
export const cs_parseServiceQuery = (cs_params: Cs_RawParams): Cs_ServiceQuery => {
  const cs_category = cs_readParam(cs_params, "category");
  const cs_mode = cs_readParam(cs_params, "mode");
  const cs_sort = cs_readParam(cs_params, "sort");
  const cs_page = Number.parseInt(cs_readParam(cs_params, "page"), 10);

  return {
    search: cs_readParam(cs_params, "search").trim().slice(0, 100),
    category: CS_CATEGORIES.includes(cs_category as Cs_Category) ? (cs_category as Cs_Category) : "",
    mode: CS_SERVICE_MODES.includes(cs_mode as Cs_ServiceMode) ? (cs_mode as Cs_ServiceMode) : "",
    sort: CS_SORT_OPTIONS.some((cs_option) => cs_option.cs_value === cs_sort) ? (cs_sort as Cs_SortKey) : "newest",
    page: Number.isFinite(cs_page) && cs_page > 1 ? cs_page : 1,
  };
};

// Default values are left out to keep URLs short
export const cs_buildServiceQuery = (cs_query: Cs_ServiceQuery) => {
  const cs_params = new URLSearchParams();
  if (cs_query.search) cs_params.set("search", cs_query.search);
  if (cs_query.category) cs_params.set("category", cs_query.category);
  if (cs_query.mode) cs_params.set("mode", cs_query.mode);
  if (cs_query.sort !== "newest") cs_params.set("sort", cs_query.sort);
  if (cs_query.page > 1) cs_params.set("page", String(cs_query.page));
  return cs_params.toString();
};

export const cs_getServicesHref = (cs_query: Cs_ServiceQuery) => {
  const cs_string = cs_buildServiceQuery(cs_query);
  return cs_string ? `/services?${cs_string}` : "/services";
};

export const cs_hasActiveFilters = (cs_query: Cs_ServiceQuery) =>
  Boolean(cs_query.search || cs_query.category || cs_query.mode);
