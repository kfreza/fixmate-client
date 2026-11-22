import Link from "next/link";

type Cs_StatusTabsProps = {
  cs_basePath: string;
  cs_current: string;
  cs_options: readonly { value: string; label: string }[];
};

// URL-driven filter (?status=), so it survives a reload
const Cs_StatusTabs = ({ cs_basePath, cs_current, cs_options }: Cs_StatusTabsProps) => {
  return (
    <nav aria-label="Filter by status" className="cs_status_tabs">
      {cs_options.map((cs_option) => {
        const cs_isActive = cs_option.value === cs_current;
        return (
          <Link
            key={cs_option.value || "all"}
            href={cs_option.value ? `${cs_basePath}?status=${cs_option.value}` : cs_basePath}
            aria-current={cs_isActive ? "page" : undefined}
            className={`cs_status_tab ${cs_isActive ? "cs_active" : ""}`}
          >
            {cs_option.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default Cs_StatusTabs;
