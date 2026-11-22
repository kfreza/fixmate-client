"use client";

import Image from "next/image";
import { EyeIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Service } from "@/lib/cs_types";
import Cs_StatusBadge from "@/app/ui/StatusBadge";

type Cs_ServicePreviewDialogProps = {
  cs_data: Cs_Service;
};

// Full listing for the admin to review before approving
const Cs_ServicePreviewDialog = ({ cs_data }: Cs_ServicePreviewDialogProps) => {
  const cs_rows = [
    { label: "Technician", value: `${cs_data.technicianName} (${cs_data.technicianEmail ?? "—"})` },
    { label: "Category", value: cs_data.category },
    { label: "Starting price", value: cs_formatMoney(cs_data.basePrice) },
    { label: "Duration", value: cs_data.estimatedDuration },
    { label: "Mode", value: cs_data.serviceMode },
    { label: "Area", value: cs_data.serviceArea },
    { label: "Availability", value: cs_data.isAvailable ? "Available" : "Hidden by technician" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="cs_table_action">
          <EyeIcon className="size-4" />
          Review
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-6 font-heading text-xl">{cs_data.title}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <Cs_StatusBadge cs_status={cs_data.approvalStatus} />
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-(--cs_soft_color)">
          <Image src={cs_data.image} alt={cs_data.title} fill sizes="(min-width: 640px) 640px, 100vw" className="object-cover" />
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {cs_rows.map((cs_row) => (
            <div key={cs_row.label}>
              <dt className="text-xs text-(--cs_body_color)">{cs_row.label}</dt>
              <dd className="font-medium break-words text-(--cs_heading_color)">{cs_row.value}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p className="text-xs text-(--cs_body_color)">Description</p>
          <p className="mt-1 rounded-xl bg-(--cs_soft_color) p-3 text-sm leading-relaxed whitespace-pre-line text-(--cs_heading_color)">
            {cs_data.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Cs_ServicePreviewDialog;
