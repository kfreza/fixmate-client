import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, BanknoteIcon, CalendarCheckIcon, CircleAlertIcon, ListChecksIcon, UsersIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatMoney, cs_plural } from "@/lib/cs_format";
import type { Cs_AdminStatsResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatCard from "@/app/ui/StatCard";
import Cs_StatusChart from "@/app/ui/StatusChart";
import Cs_AmountChart from "@/app/ui/AmountChart";
import Cs_CategoryChart from "@/app/ui/CategoryChart";
import Cs_RoleChart from "@/app/ui/RoleChart";

export const metadata: Metadata = { title: "Admin Dashboard" };

const Cs_AdminOverviewPage = async () => {
  const cs_session = await cs_requireRole("admin");
  const { stats: cs_stats, charts: cs_charts } = await cs_serverApi<Cs_AdminStatsResponse>("/api/admin/stats");

  return (
    <>
      <Cs_DashboardHeading
        cs_title={`Welcome back, ${cs_session.user.name.split(" ")[0]}`}
        cs_subtitle="Platform activity, revenue and items that need your attention."
      />

      {cs_stats.pendingServices > 0 && (
        <Link href="/dashboard/admin/services?status=pending" className="cs_alert_banner mb-6">
          <CircleAlertIcon className="size-5 shrink-0" />
          <span className="flex-1">
            {cs_stats.pendingServices} {cs_stats.pendingServices === 1 ? "service is" : "services are"} waiting for approval.
          </span>
          <span className="flex items-center gap-1 font-semibold">
            Review <ArrowRightIcon className="size-4" />
          </span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Cs_StatCard
          cs_icon={UsersIcon}
          cs_label="Users"
          cs_value={cs_stats.totalUsers}
          cs_hint={`${cs_plural(cs_stats.totalCustomers, "customer")}, ${cs_plural(cs_stats.totalTechnicians, "technician")}`}
        />
        <Cs_StatCard
          cs_icon={ListChecksIcon}
          cs_label="Services"
          cs_value={cs_stats.totalServices}
          cs_hint={`${cs_stats.pendingServices} pending approval`}
          cs_tone="amber"
        />
        <Cs_StatCard
          cs_icon={CalendarCheckIcon}
          cs_label="Bookings"
          cs_value={cs_stats.totalBookings}
          cs_hint={`${cs_stats.activeBookings} active right now`}
          cs_tone="blue"
        />
        <Cs_StatCard
          cs_icon={BanknoteIcon}
          cs_label="Revenue"
          cs_value={cs_formatMoney(cs_stats.totalRevenue)}
          cs_hint={cs_plural(cs_stats.totalPayments, "payment")}
          cs_tone="green"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Cs_AmountChart cs_title="Monthly revenue" cs_label="Revenue" cs_data={cs_charts.monthlyRevenue} />
        <Cs_StatusChart cs_title="Bookings by status" cs_data={cs_charts.bookingsByStatus} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Cs_CategoryChart cs_title="Approved services by category" cs_data={cs_charts.servicesByCategory} />
        <Cs_RoleChart cs_title="Users by role" cs_data={cs_charts.usersByRole} />
      </div>
    </>
  );
};

export default Cs_AdminOverviewPage;
