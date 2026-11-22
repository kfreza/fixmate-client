"use client";

import { EyeIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cs_formatDay, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Booking } from "@/lib/cs_types";
import Cs_BookingTimeline from "@/app/ui/BookingTimeline";
import Cs_StatusBadge from "@/app/ui/StatusBadge";

type Cs_BookingDetailsDialogProps = {
  cs_data: Cs_Booking;
  // Customer sees the technician; technician sees the customer
  cs_viewer?: "customer" | "technician";
};

const Cs_BookingDetailsDialog = ({ cs_data, cs_viewer = "customer" }: Cs_BookingDetailsDialogProps) => {
  const cs_rows = [
    cs_viewer === "customer"
      ? { label: "Technician", value: cs_data.technicianName }
      : { label: "Customer", value: `${cs_data.customerName} (${cs_data.customerEmail})` },
    { label: "Preferred date", value: cs_formatDay(cs_data.preferredDate) },
    { label: "Phone", value: cs_data.customerPhone },
    { label: "Address", value: cs_data.address },
    { label: cs_data.status === "completed" ? "Final amount" : "Starting price", value: cs_formatMoney(cs_data.finalAmount) },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="cs_table_action">
          <EyeIcon className="size-4" />
          Details
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-6 font-heading text-xl">{cs_data.serviceTitle}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-2">
              <Cs_StatusBadge cs_status={cs_data.status} />
              {cs_data.status === "completed" && <Cs_StatusBadge cs_status={cs_data.paymentStatus} />}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-4">
            <dl className="grid gap-3 text-sm">
              {cs_rows.map((cs_row) => (
                <div key={cs_row.label} className="grid grid-cols-[7.5rem_1fr] gap-3">
                  <dt className="text-(--cs_body_color)">{cs_row.label}</dt>
                  <dd className="font-medium break-words text-(--cs_heading_color)">{cs_row.value}</dd>
                </div>
              ))}
            </dl>
            <div>
              <p className="text-sm text-(--cs_body_color)">Problem</p>
              <p className="mt-1 rounded-xl bg-(--cs_soft_color) p-3 text-sm leading-relaxed whitespace-pre-line text-(--cs_heading_color)">
                {cs_data.problemDescription}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-(--cs_border_color) p-4 sm:min-w-52">
            <p className="mb-4 text-xs font-semibold tracking-wide text-(--cs_body_color) uppercase">Job timeline</p>
            <Cs_BookingTimeline cs_data={cs_data} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Cs_BookingDetailsDialog;
