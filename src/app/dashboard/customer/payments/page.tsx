import Link from "next/link";
import type { Metadata } from "next";
import { BanknoteIcon, CalendarClockIcon, ReceiptIcon, ReceiptTextIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDateTime, cs_formatMoney, cs_plural, cs_shortId } from "@/lib/cs_format";
import type { Cs_ListResponse, Cs_Payment } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatCard from "@/app/ui/StatCard";
import Cs_CopyButton from "@/app/ui/CopyButton";
import Cs_StatusBadge from "@/app/ui/StatusBadge";

export const metadata: Metadata = { title: "Payment History" };

type Cs_MyPaymentsResponse = Cs_ListResponse<Cs_Payment> & { totalSpent: number };

const Cs_TransactionCell = ({ cs_id }: { cs_id: string }) => (
  <div className="flex items-center gap-1">
    <code className="cs_code" title={cs_id}>
      {cs_shortId(cs_id)}
    </code>
    {cs_id && <Cs_CopyButton cs_value={cs_id} cs_label="Copy transaction ID" />}
  </div>
);

const Cs_CustomerPaymentsPage = async () => {
  await cs_requireRole("customer");
  const { items: cs_payments, totalSpent: cs_total } = await cs_serverApi<Cs_MyPaymentsResponse>("/api/payments/my");
  const cs_last = cs_payments[0];

  return (
    <>
      <Cs_DashboardHeading cs_title="Payment History" cs_subtitle="Every repair you have paid for online, with Stripe receipts." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Cs_StatCard cs_icon={BanknoteIcon} cs_label="Total spent" cs_value={cs_formatMoney(cs_total)} cs_hint="All paid repairs" cs_tone="accent" />
        <Cs_StatCard cs_icon={ReceiptIcon} cs_label="Payments" cs_value={cs_payments.length} cs_hint={cs_plural(cs_payments.length, "repair") + " paid"} />
        <Cs_StatCard
          cs_icon={CalendarClockIcon}
          cs_label="Last payment"
          cs_value={cs_last ? cs_formatMoney(cs_last.amount) : "—"}
          cs_hint={cs_last ? cs_formatDateTime(cs_last.paidAt) : "No payments yet"}
          cs_tone="green"
        />
      </div>

      {!cs_payments.length ? (
        <div className="cs_empty_state mt-6">
          <ReceiptTextIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">No payments yet</p>
          <p className="max-w-sm text-sm text-(--cs_body_color)">
            When a technician completes your repair, pay for it from My Bookings and the receipt will show up here.
          </p>
          <Link href="/dashboard/customer/bookings" className="cs_btn cs_btn_style_2 mt-3">
            Go to My Bookings
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="cs_table_wrap mt-6 hidden xl:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Paid on</th>
                  <th>Service</th>
                  <th>Technician</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {cs_payments.map((cs_payment) => (
                  <tr key={cs_payment._id}>
                    <td className="whitespace-nowrap">{cs_formatDateTime(cs_payment.paidAt)}</td>
                    <td>
                      <p className="line-clamp-1 min-w-40 font-medium text-(--cs_heading_color)">{cs_payment.serviceTitle}</p>
                    </td>
                    <td className="whitespace-nowrap">{cs_payment.technicianName}</td>
                    <td className="font-semibold whitespace-nowrap text-(--cs_heading_color)">{cs_formatMoney(cs_payment.amount)}</td>
                    <td>
                      <Cs_StatusBadge cs_status="paid" />
                    </td>
                    <td>
                      <Cs_TransactionCell cs_id={cs_payment.transactionId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:hidden">
            {cs_payments.map((cs_payment) => (
              <li key={cs_payment._id} className="cs_mobile_card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">{cs_payment.serviceTitle}</p>
                    <p className="text-xs text-(--cs_body_color)">{cs_payment.technicianName}</p>
                  </div>
                  <span className="font-heading text-lg font-bold text-(--cs_heading_color)">{cs_formatMoney(cs_payment.amount)}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-(--cs_border_color) pt-3 text-xs text-(--cs_body_color)">
                  <span>{cs_formatDateTime(cs_payment.paidAt)}</span>
                  <Cs_TransactionCell cs_id={cs_payment.transactionId} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_CustomerPaymentsPage;
