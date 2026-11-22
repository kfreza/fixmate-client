import type { Metadata } from "next";
import { InboxIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDay, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Booking, Cs_ListResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatusTabs from "@/app/ui/StatusTabs";
import Cs_StatusBadge from "@/app/ui/StatusBadge";
import Cs_BookingDetailsDialog from "@/app/ui/BookingDetailsDialog";
import Cs_JobActions from "@/app/ui/JobActions";

export const metadata: Metadata = { title: "Job Requests" };

const CS_TABS = [
  { value: "", label: "All" },
  { value: "requested", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
] as const;

// Paid state matters once the job is done
const Cs_AmountCell = ({ cs_data }: { cs_data: Cs_Booking }) => (
  <div className="flex flex-col gap-1">
    <span className="font-semibold whitespace-nowrap text-(--cs_heading_color)">{cs_formatMoney(cs_data.finalAmount)}</span>
    {cs_data.status === "completed" && <Cs_StatusBadge cs_status={cs_data.paymentStatus} />}
  </div>
);

const Cs_Actions = ({ cs_data }: { cs_data: Cs_Booking }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    <Cs_JobActions cs_data={cs_data} />
    <Cs_BookingDetailsDialog cs_data={cs_data} cs_viewer="technician" />
  </div>
);

const Cs_TechnicianRequestsPage = async ({ searchParams }: PageProps<"/dashboard/technician/requests">) => {
  await cs_requireRole("technician");
  const { status: cs_statusParam } = await searchParams;
  const cs_status = CS_TABS.some((cs_tab) => cs_tab.value && cs_tab.value === cs_statusParam) ? String(cs_statusParam) : "";
  const { items: cs_jobs } = await cs_serverApi<Cs_ListResponse<Cs_Booking>>(
    `/api/bookings/technician${cs_status ? `?status=${cs_status}` : ""}`,
  );

  return (
    <>
      <Cs_DashboardHeading
        cs_title="Job Requests"
        cs_subtitle="Accept new requests, then move each job forward until it is completed."
      />
      <Cs_StatusTabs cs_basePath="/dashboard/technician/requests" cs_current={cs_status} cs_options={CS_TABS} />

      {!cs_jobs.length ? (
        <div className="cs_empty_state mt-6">
          <InboxIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">{cs_status ? "No jobs with this status" : "No requests yet"}</p>
          <p className="text-sm text-(--cs_body_color)">
            {cs_status ? "Try another filter." : "Requests from customers will show up here once your services are approved."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="cs_table_wrap mt-6 hidden md:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Preferred date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cs_jobs.map((cs_job) => (
                  <tr key={cs_job._id}>
                    <td>
                      <p className="font-medium whitespace-nowrap text-(--cs_heading_color)">{cs_job.customerName}</p>
                      <p className="text-xs whitespace-nowrap">{cs_job.customerPhone}</p>
                    </td>
                    <td>
                      <p className="line-clamp-1 min-w-40 text-(--cs_heading_color)">{cs_job.serviceTitle}</p>
                      <p className="line-clamp-1 text-xs">{cs_job.address}</p>
                    </td>
                    <td className="whitespace-nowrap">{cs_formatDay(cs_job.preferredDate)}</td>
                    <td>
                      <Cs_StatusBadge cs_status={cs_job.status} />
                    </td>
                    <td>
                      <Cs_AmountCell cs_data={cs_job} />
                    </td>
                    <td>
                      <Cs_Actions cs_data={cs_job} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 flex flex-col gap-4 md:hidden">
            {cs_jobs.map((cs_job) => (
              <li key={cs_job._id} className="cs_mobile_card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">{cs_job.serviceTitle}</p>
                    <p className="text-sm text-(--cs_body_color)">{cs_job.customerName}</p>
                  </div>
                  <Cs_StatusBadge cs_status={cs_job.status} />
                </div>
                <div className="mt-3 flex flex-col gap-1.5 text-xs text-(--cs_body_color)">
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="size-3.5 shrink-0" />
                    {cs_job.customerPhone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{cs_job.address}</span>
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-(--cs_body_color)">Preferred date</dt>
                    <dd className="font-medium text-(--cs_heading_color)">{cs_formatDay(cs_job.preferredDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-(--cs_body_color)">Amount</dt>
                    <dd>
                      <Cs_AmountCell cs_data={cs_job} />
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 border-t border-(--cs_border_color) pt-4">
                  <Cs_Actions cs_data={cs_job} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_TechnicianRequestsPage;
