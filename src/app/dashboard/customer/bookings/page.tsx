import Image from "next/image";
import Link from "next/link";
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
import Cs_CancelBookingButton from "@/app/ui/CancelBookingButton";
import Cs_PayNowButton from "@/app/ui/PayNowButton";
import Cs_ReviewDialog from "@/app/ui/ReviewDialog";
import Cs_StarRating from "@/app/ui/StarRating";

export const metadata: Metadata = { title: "My Bookings" };

const CS_TABS = [
  { value: "", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
] as const;

// Pay Now, Paid, or nothing yet
const Cs_PaymentCell = ({ cs_data }: { cs_data: Cs_Booking }) => {
  if (cs_data.paymentStatus === "paid") return <Cs_StatusBadge cs_status="paid" />;
  if (cs_data.status === "completed") return <Cs_PayNowButton cs_bookingId={cs_data._id} cs_amount={cs_data.finalAmount} />;
  return <span className="text-xs text-(--cs_body_color)">After completion</span>;
};

const Cs_Actions = ({ cs_data }: { cs_data: Cs_Booking }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    <Cs_BookingDetailsDialog cs_data={cs_data} />
    {cs_data.status === "requested" && <Cs_CancelBookingButton cs_bookingId={cs_data._id} cs_serviceTitle={cs_data.serviceTitle} />}
    {/* Reviews open once the job is paid; afterwards show the stars given */}
    {cs_data.paymentStatus === "paid" &&
      (cs_data.rating ? (
        <span className="flex items-center gap-1.5 px-2" title="Your rating">
          <Cs_StarRating cs_value={cs_data.rating} />
        </span>
      ) : (
        <Cs_ReviewDialog cs_bookingId={cs_data._id} cs_serviceTitle={cs_data.serviceTitle} cs_technicianName={cs_data.technicianName} />
      ))}
  </div>
);

const Cs_CustomerBookingsPage = async ({ searchParams }: PageProps<"/dashboard/customer/bookings">) => {
  await cs_requireRole("customer");
  const { status: cs_statusParam } = await searchParams;
  const cs_status = CS_TABS.some((cs_tab) => cs_tab.value && cs_tab.value === cs_statusParam) ? String(cs_statusParam) : "";
  const { items: cs_bookings } = await cs_serverApi<Cs_ListResponse<Cs_Booking>>(
    `/api/bookings/my${cs_status ? `?status=${cs_status}` : ""}`,
  );

  return (
    <>
      <Cs_DashboardHeading cs_title="My Bookings" cs_subtitle="Track every repair request, cancel new ones and pay for finished jobs." />
      <Cs_StatusTabs cs_basePath="/dashboard/customer/bookings" cs_current={cs_status} cs_options={CS_TABS} />

      {!cs_bookings.length ? (
        <div className="cs_empty_state mt-6">
          <CalendarXIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">
            {cs_status ? "No bookings with this status" : "No bookings yet"}
          </p>
          <p className="text-sm text-(--cs_body_color)">
            {cs_status ? "Try another filter." : "Find a service and send your first repair request."}
          </p>
          {!cs_status && (
            <Link href="/services" className="cs_btn cs_btn_style_1 mt-3">
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="cs_table_wrap mt-6 hidden md:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Preferred date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cs_bookings.map((cs_booking) => (
                  <tr key={cs_booking._id}>
                    <td>
                      <div className="flex min-w-56 items-center gap-3">
                        <Image src={cs_booking.serviceImage} alt="" width={44} height={44} className="size-11 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-(--cs_heading_color)">{cs_booking.serviceTitle}</p>
                          <p className="text-xs text-(--cs_body_color)">{cs_booking.technicianName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{cs_formatDay(cs_booking.preferredDate)}</td>
                    <td>
                      <Cs_StatusBadge cs_status={cs_booking.status} />
                    </td>
                    <td className="font-semibold whitespace-nowrap text-(--cs_heading_color)">{cs_formatMoney(cs_booking.finalAmount)}</td>
                    <td>
                      <Cs_PaymentCell cs_data={cs_booking} />
                    </td>
                    <td>
                      <Cs_Actions cs_data={cs_booking} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 flex flex-col gap-4 md:hidden">
            {cs_bookings.map((cs_booking) => (
              <li key={cs_booking._id} className="cs_mobile_card">
                <div className="flex items-start gap-3">
                  <Image src={cs_booking.serviceImage} alt="" width={56} height={56} className="size-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">{cs_booking.serviceTitle}</p>
                    <p className="text-xs text-(--cs_body_color)">{cs_booking.technicianName}</p>
                  </div>
                  <Cs_StatusBadge cs_status={cs_booking.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-(--cs_body_color)">Preferred date</dt>
                    <dd className="font-medium text-(--cs_heading_color)">{cs_formatDay(cs_booking.preferredDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-(--cs_body_color)">Amount</dt>
                    <dd className="font-semibold text-(--cs_heading_color)">{cs_formatMoney(cs_booking.finalAmount)}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--cs_border_color) pt-4">
                  <Cs_Actions cs_data={cs_booking} />
                  <Cs_PaymentCell cs_data={cs_booking} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_CustomerBookingsPage;
