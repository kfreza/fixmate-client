import type { Metadata } from "next";
import {
  BanknoteIcon,
  ReceiptIcon,
  ReceiptTextIcon,
  TrendingUpIcon,
} from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDateTime, cs_formatMoney, cs_shortId } from "@/lib/cs_format";
import type { Cs_AdminPaymentsResponse } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatCard from "@/app/ui/StatCard";

export const metadata: Metadata = { title: "Transactions" };

const Cs_AdminTransactionsPage = async () => {
  await cs_requireRole("admin");
  const {
    items: cs_payments,
    totalRevenue: cs_total,
    count: cs_count,
  } = await cs_serverApi<Cs_AdminPaymentsResponse>("/api/admin/payments");
  const cs_average = cs_count ? cs_total / cs_count : 0;
  const cs_largest = cs_payments.reduce(
    (cs_max, cs_payment) => Math.max(cs_max, cs_payment.amount),
    0,
  );

  return (
    <>
      <Cs_DashboardHeading
        cs_title="Transactions"
        cs_subtitle="Every Stripe payment made on FixMate."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Cs_StatCard
          cs_icon={BanknoteIcon}
          cs_label="Total revenue"
          cs_value={cs_formatMoney(cs_total)}
          cs_hint="All paid jobs"
          cs_tone="green"
        />
        <Cs_StatCard
          cs_icon={ReceiptIcon}
          cs_label="Payments"
          cs_value={cs_count}
          cs_hint="Successful checkouts"
        />
        <Cs_StatCard
          cs_icon={TrendingUpIcon}
          cs_label="Average payment"
          cs_value={cs_formatMoney(cs_average)}
          cs_hint={`Largest ${cs_formatMoney(cs_largest)}`}
          cs_tone="blue"
        />
      </div>

      {!cs_payments.length ? (
        <div className="cs_empty_state mt-6">
          <ReceiptTextIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">
            No payments yet
          </p>
          <p className="text-sm text-(--cs_body_color)">
            Payments appear here after customers pay for completed jobs.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="cs_table_wrap mt-6 hidden xl:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Paid at</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Technician</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {cs_payments.map((cs_payment) => (
                  <tr key={cs_payment._id}>
                    <td className="whitespace-nowrap">
                      {cs_formatDateTime(cs_payment.paidAt)}
                    </td>
                    <td>
                      <p className="line-clamp-1 min-w-40 text-(--cs_heading_color)">
                        {cs_payment.serviceTitle}
                      </p>
                    </td>
                    <td>
                      <p className="whitespace-nowrap text-(--cs_heading_color)">
                        {cs_payment.customerName}
                      </p>
                      <p className="text-xs">{cs_payment.customerEmail}</p>
                    </td>
                    <td className="whitespace-nowrap">
                      {cs_payment.technicianName}
                    </td>
                    <td className="font-semibold whitespace-nowrap text-(--cs_heading_color)">
                      {cs_formatMoney(cs_payment.amount)}
                    </td>
                    <td>
                      <code
                        className="cs_code"
                        title={cs_payment.transactionId}
                      >
                        {cs_shortId(cs_payment.transactionId)}
                      </code>
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
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">
                      {cs_payment.serviceTitle}
                    </p>
                    <p className="text-xs text-(--cs_body_color)">
                      {cs_payment.customerName} → {cs_payment.technicianName}
                    </p>
                  </div>
                  <span className="font-heading text-lg font-bold text-(--cs_heading_color)">
                    {cs_formatMoney(cs_payment.amount)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-(--cs_border_color) pt-3 text-xs text-(--cs_body_color)">
                  <span>{cs_formatDateTime(cs_payment.paidAt)}</span>
                  <code className="cs_code" title={cs_payment.transactionId}>
                    {cs_shortId(cs_payment.transactionId)}
                  </code>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_AdminTransactionsPage;
