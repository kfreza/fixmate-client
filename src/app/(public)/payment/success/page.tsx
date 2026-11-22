import Link from "next/link";
import type { Metadata } from "next";
import { CalendarCheckIcon, CircleCheckBigIcon, ClockIcon, ReceiptIcon, SearchXIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApiResult } from "@/lib/cs_serverApi";
import { cs_formatDateTime, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Payment } from "@/lib/cs_types";
import Cs_CopyButton from "@/app/ui/CopyButton";

export const metadata: Metadata = { title: "Payment Successful" };

type Cs_VerifyResponse = { success: boolean; message?: string; alreadyRecorded?: boolean; payment?: Cs_Payment };

// Problem states share one layout
const Cs_ResultMessage = ({ cs_icon: Cs_Icon, cs_title, cs_text }: { cs_icon: typeof ClockIcon; cs_title: string; cs_text: string }) => (
  <div className="cs_result_card">
    <span className="inline-flex size-16 items-center justify-center rounded-full bg-(--cs_soft_color) text-(--cs_primary_color)">
      <Cs_Icon className="size-8" />
    </span>
    <h1 className="mt-5 font-heading text-2xl font-bold text-(--cs_heading_color)">{cs_title}</h1>
    <p className="mt-2 max-w-sm text-(--cs_body_color)">{cs_text}</p>
    <Link href="/dashboard/customer/bookings" className="cs_btn cs_btn_style_2 mt-7">
      <CalendarCheckIcon className="size-4" />
      Go to My Bookings
    </Link>
  </div>
);

// Stripe sends the customer here; verify is idempotent, so reloads are safe
const Cs_PaymentSuccessPage = async ({ searchParams }: PageProps<"/payment/success">) => {
  await cs_requireRole("customer");
  const { session_id: cs_sessionParam } = await searchParams;
  const cs_sessionId = typeof cs_sessionParam === "string" ? cs_sessionParam : "";

  if (!cs_sessionId) {
    return (
      <section className="cs_container py-16 md:py-24">
        <Cs_ResultMessage cs_icon={SearchXIcon} cs_title="No payment to show" cs_text="This page needs a payment session. Open your bookings to see what is paid." />
      </section>
    );
  }

  const { status: cs_status, data: cs_data } = await cs_serverApiResult<Cs_VerifyResponse>(
    `/api/payments/verify?session_id=${encodeURIComponent(cs_sessionId)}`,
  );

  if (cs_status === 402) {
    return (
      <section className="cs_container py-16 md:py-24">
        <Cs_ResultMessage
          cs_icon={ClockIcon}
          cs_title="Payment is still processing"
          cs_text="Stripe has not confirmed this payment yet. Refresh this page in a minute, or check My Bookings later."
        />
      </section>
    );
  }
  if (cs_status === 400 || cs_status === 404) {
    return (
      <section className="cs_container py-16 md:py-24">
        <Cs_ResultMessage cs_icon={SearchXIcon} cs_title="Payment not found" cs_text="We could not find this payment for your account." />
      </section>
    );
  }
  // Anything else (amount mismatch, server down) goes to error.tsx
  if (!cs_data.payment) throw new Error(cs_data.message ?? "Could not verify the payment");

  const cs_payment = cs_data.payment;
  const cs_rows = [
    { label: "Service", value: cs_payment.serviceTitle },
    { label: "Technician", value: cs_payment.technicianName },
    { label: "Paid on", value: cs_formatDateTime(cs_payment.paidAt) },
  ];

  return (
    <section className="cs_container py-16 md:py-24">
      <div className="cs_result_card">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
          <CircleCheckBigIcon className="size-8" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-bold text-(--cs_heading_color) md:text-3xl">Payment successful</h1>
        <p className="mt-2 text-(--cs_body_color)">Thank you! Your repair is now fully paid.</p>
        <p className="mt-6 font-heading text-4xl font-bold text-(--cs_heading_color)">{cs_formatMoney(cs_payment.amount)}</p>

        <dl className="mt-6 w-full divide-y divide-(--cs_border_color) rounded-xl border border-(--cs_border_color) text-left text-sm">
          {cs_rows.map((cs_row) => (
            <div key={cs_row.label} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-(--cs_body_color)">{cs_row.label}</dt>
              <dd className="text-right font-medium text-(--cs_heading_color)">{cs_row.value}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <dt className="shrink-0 text-(--cs_body_color)">Transaction ID</dt>
            <dd className="flex min-w-0 items-center gap-1">
              <code className="cs_code truncate">{cs_payment.transactionId || "—"}</code>
              {cs_payment.transactionId && <Cs_CopyButton cs_value={cs_payment.transactionId} cs_label="Copy transaction ID" />}
            </dd>
          </div>
        </dl>

        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/customer/bookings" className="cs_btn cs_btn_style_2">
            <CalendarCheckIcon className="size-4" />
            My Bookings
          </Link>
          <Link href="/dashboard/customer/payments" className="cs_btn cs_btn_style_3">
            <ReceiptIcon className="size-4" />
            Payment History
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cs_PaymentSuccessPage;
