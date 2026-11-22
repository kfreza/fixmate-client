import Link from "next/link";
import type { Metadata } from "next";
import { SearchIcon, UserXIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDay, cs_getInitials } from "@/lib/cs_format";
import type { Cs_AdminUser, Cs_ListResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_RoleBadge from "@/app/ui/RoleBadge";
import Cs_RoleSelect from "@/app/ui/RoleSelect";

export const metadata: Metadata = { title: "Manage Users" };

const CS_ROLE_TABS = [
  { value: "", label: "All" },
  { value: "customer", label: "Customers" },
  { value: "technician", label: "Technicians" },
  { value: "admin", label: "Admins" },
] as const;

const Cs_UserCell = ({ cs_data, cs_isSelf }: { cs_data: Cs_AdminUser; cs_isSelf: boolean }) => (
  <div className="flex min-w-0 items-center gap-3">
    <Avatar className="size-10">
      <AvatarImage src={cs_data.image ?? undefined} alt="" />
      <AvatarFallback className="bg-(--cs_soft_color) text-xs font-semibold text-(--cs_primary_color)">
        {cs_getInitials(cs_data.name)}
      </AvatarFallback>
    </Avatar>
    <div className="min-w-0">
      <p className="flex items-center gap-2 font-medium text-(--cs_heading_color)">
        <span className="truncate">{cs_data.name}</span>
        {cs_isSelf && <span className="cs_chip px-2 py-0 text-[11px]">You</span>}
      </p>
      <p className="truncate text-xs text-(--cs_body_color)">{cs_data.email}</p>
    </div>
  </div>
);

const Cs_AdminUsersPage = async ({ searchParams }: PageProps<"/dashboard/admin/users">) => {
  const cs_session = await cs_requireRole("admin");
  const { role: cs_roleParam, search: cs_searchParam } = await searchParams;
  const cs_role = CS_ROLE_TABS.some((cs_tab) => cs_tab.value && cs_tab.value === cs_roleParam) ? String(cs_roleParam) : "";
  const cs_search = typeof cs_searchParam === "string" ? cs_searchParam.trim().slice(0, 100) : "";

  const cs_query = new URLSearchParams();
  if (cs_role) cs_query.set("role", cs_role);
  if (cs_search) cs_query.set("search", cs_search);
  const { items: cs_users } = await cs_serverApi<Cs_ListResponse<Cs_AdminUser>>(`/api/admin/users?${cs_query}`);

  const cs_tabHref = (cs_value: string) => {
    const cs_params = new URLSearchParams();
    if (cs_value) cs_params.set("role", cs_value);
    if (cs_search) cs_params.set("search", cs_search);
    const cs_string = cs_params.toString();
    return cs_string ? `/dashboard/admin/users?${cs_string}` : "/dashboard/admin/users";
  };

  return (
    <>
      <Cs_DashboardHeading cs_title="Manage Users" cs_subtitle="See every account and change roles. You cannot change your own role." />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter by role" className="cs_status_tabs">
          {CS_ROLE_TABS.map((cs_tab) => (
            <Link
              key={cs_tab.value || "all"}
              href={cs_tabHref(cs_tab.value)}
              aria-current={cs_tab.value === cs_role ? "page" : undefined}
              className={`cs_status_tab ${cs_tab.value === cs_role ? "cs_active" : ""}`}
            >
              {cs_tab.label}
            </Link>
          ))}
        </nav>
        {/* Plain GET form: works without JS and keeps the role tab */}
        <form action="/dashboard/admin/users" role="search" className="cs_filter_search w-full lg:max-w-xs">
          {cs_role && <input type="hidden" name="role" value={cs_role} />}
          <SearchIcon className="size-4 shrink-0 text-(--cs_body_color)" />
          <input
            type="search"
            name="search"
            defaultValue={cs_search}
            placeholder="Search name or email"
            aria-label="Search users"
            className="min-w-0 flex-1 bg-transparent text-sm text-(--cs_heading_color) outline-none placeholder:text-(--cs_body_color)/70"
          />
        </form>
      </div>

      {!cs_users.length ? (
        <div className="cs_empty_state mt-6">
          <UserXIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">No users found</p>
          <p className="text-sm text-(--cs_body_color)">Try another search or role.</p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-(--cs_body_color)">
            <span className="font-semibold text-(--cs_heading_color)">{cs_users.length}</span>{" "}
            {cs_users.length === 1 ? "user" : "users"}
          </p>

          {/* Desktop table */}
          <div className="cs_table_wrap mt-3 hidden md:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Current role</th>
                  <th>Joined</th>
                  <th>Change role</th>
                </tr>
              </thead>
              <tbody>
                {cs_users.map((cs_user) => {
                  const cs_isSelf = cs_user._id === cs_session.user.id;
                  return (
                    <tr key={cs_user._id}>
                      <td>
                        <Cs_UserCell cs_data={cs_user} cs_isSelf={cs_isSelf} />
                      </td>
                      <td>
                        <Cs_RoleBadge cs_role={cs_user.role} />
                      </td>
                      <td className="whitespace-nowrap">{cs_user.createdAt ? cs_formatDay(cs_user.createdAt) : "—"}</td>
                      <td>
                        <Cs_RoleSelect cs_userId={cs_user._id} cs_userName={cs_user.name} cs_role={cs_user.role} cs_isSelf={cs_isSelf} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-3 flex flex-col gap-3 md:hidden">
            {cs_users.map((cs_user) => {
              const cs_isSelf = cs_user._id === cs_session.user.id;
              return (
                <li key={cs_user._id} className="cs_mobile_card">
                  <div className="flex items-start justify-between gap-3">
                    <Cs_UserCell cs_data={cs_user} cs_isSelf={cs_isSelf} />
                    <Cs_RoleBadge cs_role={cs_user.role} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-(--cs_border_color) pt-4">
                    <span className="text-xs text-(--cs_body_color)">
                      Joined {cs_user.createdAt ? cs_formatDay(cs_user.createdAt) : "—"}
                    </span>
                    <Cs_RoleSelect cs_userId={cs_user._id} cs_userName={cs_user.name} cs_role={cs_user.role} cs_isSelf={cs_isSelf} />
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_AdminUsersPage;
