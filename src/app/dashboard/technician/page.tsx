import Link from "next/link";
import type { Metadata } from "next";
import { BanknoteIcon, BellRingIcon, PackageIcon, PlusIcon, WrenchIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDay, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Booking, Cs_ListResponse, Cs_TechnicianStatsResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatCard from "@/app/ui/StatCard";
import Cs_StatusChart from "@/app/ui/StatusChart";
import Cs_AmountChart from "@/app/ui/AmountChart";
import Cs_JobActions from "@/app/ui/JobActions";

export const metadata: Metadata = { title: "Technician Dashboard" };

const Cs_TechnicianOverviewPage = async () => {
  const cs_session = await cs_requireRole("technician");
  const [{ stats: cs_stats, charts: cs_charts }, { items: cs_newJobs }] = await Promise.all([
    cs_serverApi<Cs_TechnicianStatsResponse>("/api/stats/technician"),
    cs_serverApi<Cs_ListResponse<Cs_Booking>>("/api/bookings/technician?status=requested"),
  ]);

  return (
    <>
      <Cs_DashboardHeading
        cs_title={`Welcome back, ${cs_session.user.name.split(" ")[0]}`}
        cs_subtitle="Your jobs, services and earnings at a glance."
      >
        <Link href="/dashboard/technician/add-service" className="cs_btn cs_btn_style_2 shrink-0">
          <PlusIcon className="size-4" />
          Add Service
        </Link>
      </Cs_DashboardHeading>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Cs_StatCard
          cs_icon={BellRingIcon}
          cs_label="New requests"
          cs_value={cs_stats.newRequests}
          cs_hint="Waiting for your answer"
          cs_tone="blue"
        />
        <Cs_StatCard
          cs_icon={WrenchIcon}
          cs_label="Active jobs"
          cs_value={cs_stats.activeJobs}
          cs_hint={`${cs_stats.completedJobs} completed so far`}
          cs_tone="amber"
        />
        <Cs_StatCard
          cs_icon={PackageIcon}
          cs_label="My services"
          cs_value={cs_stats.totalServices}
          cs_hint={`${cs_stats.approvedServices} approved, ${cs_stats.pendingServices} pending`}
        />
        <Cs_StatCard
          cs_icon={BanknoteIcon}
          cs_label="Total earnings"
          cs_value={cs_formatMoney(cs_stats.totalEarnings)}
          cs_hint="From paid jobs"
          cs_tone="green"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Cs_StatusChart cs_title="Jobs by status" cs_data={cs_charts.jobsByStatus} />
        <Cs_AmountChart cs_title="Monthly earnings" cs_label="Earned" cs_data={cs_charts.monthlyEarnings} />
      </div>

      <section className="cs_chart_card mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-(--cs_heading_color)">New requests</h3>
          <Link href="/dashboard/technician/requests" className="text-sm font-semibold text-(--cs_primary_color) hover:underline">
            All jobs
          </Link>
        </div>
        {cs_newJobs.length ? (
          <ul className="mt-4 divide-y divide-(--cs_border_color)">
            {cs_newJobs.slice(0, 5).map((cs_job) => (
              <li key={cs_job._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-(--cs_heading_color)">{cs_job.serviceTitle}</p>
                  <p className="text-xs text-(--cs_body_color)">
                    {cs_job.customerName} · {cs_formatDay(cs_job.preferredDate)}
                  </p>
                </div>
                <Cs_JobActions cs_data={cs_job} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-(--cs_body_color)">No new requests right now.</p>
        )}
      </section>
    </>
  );
};

export default Cs_TechnicianOverviewPage;
