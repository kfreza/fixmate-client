import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeftIcon, CircleXIcon, HomeIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";

export const metadata: Metadata = { title: "Payment Cancelled" };

// Stripe sends the customer here after "Back"; nothing was charged
const Cs_PaymentCancelPage = async () => {
  await cs_requireRole("customer");

  return (
    <section className="cs_container py-16 md:py-24">
      <div className="cs_result_card">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400">
          <CircleXIcon className="size-8" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-bold text-(--cs_heading_color) md:text-3xl">Payment cancelled</h1>
        <p className="mt-2 max-w-sm text-(--cs_body_color)">
          No money was taken. Your job is still marked as completed and waiting for payment, so you can pay any time.
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/customer/bookings?status=completed" className="cs_btn cs_btn_style_1">
            <ArrowLeftIcon className="size-4" />
            Back to Payment
          </Link>
          <Link href="/" className="cs_btn cs_btn_style_3">
            <HomeIcon className="size-4" />
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cs_PaymentCancelPage;
