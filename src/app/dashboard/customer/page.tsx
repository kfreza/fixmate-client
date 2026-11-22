import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRightIcon, BanknoteIcon, CalendarCheckIcon, CircleAlertIcon, ClockIcon, SearchIcon, WrenchIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDay, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Booking, Cs_CustomerStatsResponse, Cs_ListResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatCard from "@/app/ui/StatCard";
import Cs_StatusBadge from "@/app/ui/StatusBadge";
import Cs_StatusChart from "@/app/ui/StatusChart";
import Cs_AmountChart from "@/app/ui/AmountChart";

export const metadata: Metadata = { title: "Customer Dashboard" };

const Cs_CustomerOverviewPage = async () => {
  const cs_session = await cs_requireRole("customer");
  const [{ stats: cs_stats, charts: cs_charts }, { items: cs_bookings }] = await Promise.all([
    cs_serverApi<Cs_CustomerStatsResponse>("/api/stats/customer"),
    cs_serverApi<Cs_ListResponse<Cs_Booking>>("/api/bookings/my"),
  ]);
  const cs_recent = cs_bookings.slice(0, 5);

  return (
    <>
      <Cs_DashboardHeading
        cs_title={`Welcome back, ${cs_session.user.name.split(" ")[0]}`}
        cs_subtitle="Here is how your repairs are going."
      >
        <Link href="/services" className="cs_btn cs_btn_style_1 shrink-0">
          <SearchIcon className="size-4" />
          Find a Service
        </Link>
      </Cs_DashboardHeading>

      {cs_stats.unpaidCount > 0 && (
        <Link href="/dashboard/customer/bookings?status=completed" className="cs_alert_banner mb-6">
          <CircleAlertIcon className="size-5 shrink-0" />
          <span className="flex-1">
            {cs_stats.unpaidCount} completed {cs_stats.unpaidCount === 1 ? "job is" : "jobs are"} waiting for payment (
            {cs_formatMoney(cs_stats.unpaidAmount)}).
          </span>
          <span className="flex items-center gap-1 font-semibold">
            Pay now <ArrowRightIcon className="size-4" />
          </span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Cs_StatCard cs_icon={CalendarCheckIcon} cs_label="Total bookings" cs_value={cs_stats.totalBookings} cs_hint="All time" />
        <Cs_StatCard
          cs_icon={ClockIcon}
          cs_label="Active jobs"
          cs_value={cs_stats.activeBookings}
          cs_hint="Requested, accepted or in progress"
          cs_tone="blue"
        />
        <Cs_StatCard
          cs_icon={WrenchIcon}
          cs_label="Completed"
          cs_value={cs_stats.completedBookings}
          cs_hint={`${cs_stats.cancelledBookings} cancelled or rejected`}
          cs_tone="green"
        />
        <Cs_StatCard
          cs_icon={BanknoteIcon}
          cs_label="Total spent"
          cs_value={cs_formatMoney(cs_stats.totalSpent)}
          cs_hint="Paid online"
          cs_tone="accent"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Cs_StatusChart cs_title="Bookings by status" cs_data={cs_charts.bookingsByStatus} />
        <Cs_AmountChart cs_title="Monthly spending" cs_label="Spent" cs_data={cs_charts.monthlySpending} />
      </div>

      <section className="cs_chart_card mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-(--cs_heading_color)">Recent bookings</h3>
          {cs_bookings.length > 0 && (
            <Link href="/dashboard/customer/bookings" className="text-sm font-semibold text-(--cs_primary_color) hover:underline">
              View all
            </Link>
          )}
        </div>
        {cs_recent.length ? (
          <ul className="mt-4 divide-y divide-(--cs_border_color)">
            {cs_recent.map((cs_booking) => (
              <li key={cs_booking._id} className="flex items-center gap-3 py-3">
                <Image
                  src={cs_booking.serviceImage}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-(--cs_heading_color)">{cs_booking.serviceTitle}</p>
                  <p className="text-xs text-(--cs_body_color)">
                    {cs_booking.technicianName} · {cs_formatDay(cs_booking.preferredDate)}
                  </p>
                </div>
                <Cs_StatusBadge cs_status={cs_booking.status} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-(--cs_body_color)">You have not requested any repairs yet.</p>
            <Link href="/services" className="cs_btn cs_btn_style_3 mt-2">
              Browse services
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Cs_CustomerOverviewPage;
