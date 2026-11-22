import type { Metadata } from "next";
import { CalendarXIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDay, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Booking, Cs_ListResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatusTabs from "@/app/ui/StatusTabs";
import Cs_StatusBadge from "@/app/ui/StatusBadge";
import Cs_BookingDetailsDialog from "@/app/ui/BookingDetailsDialog";

export const metadata: Metadata = { title: "All Bookings" };

const CS_TABS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const Cs_PaymentCell = ({ cs_data }: { cs_data: Cs_Booking }) =>
  cs_data.status === "completed" ? (
    <Cs_StatusBadge cs_status={cs_data.paymentStatus} />
  ) : (
    <span className="text-xs text-(--cs_body_color)">—</span>
  );

// Read-only: admins watch, technicians and customers act
const Cs_AdminBookingsPage = async ({
  searchParams,
}: PageProps<"/dashboard/admin/bookings">) => {
  await cs_requireRole("admin");
  const { status: cs_statusParam } = await searchParams;
  const cs_status = CS_TABS.some(
    (cs_tab) => cs_tab.value && cs_tab.value === cs_statusParam,
  )
    ? String(cs_statusParam)
    : "";
  const { items: cs_bookings } = await cs_serverApi<
    Cs_ListResponse<Cs_Booking>
  >(`/api/admin/bookings${cs_status ? `?status=${cs_status}` : ""}`);

  return (
    <>
      <Cs_DashboardHeading
        cs_title="All Bookings"
        cs_subtitle="Every repair job on the platform. This view is read-only."
      />
      <Cs_StatusTabs
        cs_basePath="/dashboard/admin/bookings"
        cs_current={cs_status}
        cs_options={CS_TABS}
      />

      {!cs_bookings.length ? (
        <div className="cs_empty_state mt-6">
          <CalendarXIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">
            No bookings here
          </p>
          <p className="text-sm text-(--cs_body_color)">
            {cs_status
              ? "Try another filter."
              : "Bookings will appear once customers send requests."}
          </p>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-(--cs_body_color)">
            <span className="font-semibold text-(--cs_heading_color)">
              {cs_bookings.length}
            </span>{" "}
            {cs_bookings.length === 1 ? "booking" : "bookings"}
          </p>

          {/* Desktop table */}
          <div className="cs_table_wrap mt-3 hidden xl:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Technician</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cs_bookings.map((cs_booking) => (
                  <tr key={cs_booking._id}>
                    <td>
                      <p className="line-clamp-1 min-w-40 font-medium text-(--cs_heading_color)">
                        {cs_booking.serviceTitle}
                      </p>
                      <p className="text-xs">{cs_booking.category}</p>
                    </td>
                    <td>
                      <p className="whitespace-nowrap text-(--cs_heading_color)">
                        {cs_booking.customerName}
                      </p>
                      <p className="text-xs">{cs_booking.customerEmail}</p>
                    </td>
                    <td className="whitespace-nowrap">
                      {cs_booking.technicianName}
                    </td>
                    <td className="whitespace-nowrap">
                      {cs_formatDay(cs_booking.preferredDate)}
                    </td>
                    <td>
                      <Cs_StatusBadge cs_status={cs_booking.status} />
                    </td>
                    <td className="font-semibold whitespace-nowrap text-(--cs_heading_color)">
                      {cs_formatMoney(cs_booking.finalAmount)}
                    </td>
                    <td>
                      <Cs_PaymentCell cs_data={cs_booking} />
                    </td>
                    <td>
                      <Cs_BookingDetailsDialog
                        cs_data={cs_booking}
                        cs_viewer="admin"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-3 grid gap-4 md:grid-cols-2 xl:hidden">
            {cs_bookings.map((cs_booking) => (
              <li key={cs_booking._id} className="cs_mobile_card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">
                      {cs_booking.serviceTitle}
                    </p>
                    <p className="text-xs text-(--cs_body_color)">
                      {cs_booking.customerName} → {cs_booking.technicianName}
                    </p>
                  </div>
                  <Cs_StatusBadge cs_status={cs_booking.status} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--cs_border_color) pt-4">
                  <span className="text-sm">
                    <span className="font-semibold text-(--cs_heading_color)">
                      {cs_formatMoney(cs_booking.finalAmount)}
                    </span>
                    <span className="text-xs text-(--cs_body_color)">
                      {" "}
                      · {cs_formatDay(cs_booking.preferredDate)}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Cs_PaymentCell cs_data={cs_booking} />
                    <Cs_BookingDetailsDialog
                      cs_data={cs_booking}
                      cs_viewer="admin"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_AdminBookingsPage;
