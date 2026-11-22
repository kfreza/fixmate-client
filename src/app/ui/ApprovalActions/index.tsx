"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import type { Cs_ApprovalStatus } from "@/lib/cs_types";

type Cs_ApprovalActionsProps = {
  cs_serviceId: string;
  cs_serviceTitle: string;
  cs_status: Cs_ApprovalStatus;
};

// Pending: both; approved: can be pulled back; rejected: can be approved later
const Cs_ApprovalActions = ({ cs_serviceId, cs_serviceTitle, cs_status }: Cs_ApprovalActionsProps) => {
  const cs_router = useRouter();
  const [cs_busy, cs_setBusy] = useState<"approved" | "rejected" | null>(null);
  const [cs_isRejectOpen, cs_setIsRejectOpen] = useState(false);

  const cs_decide = async (cs_next: "approved" | "rejected") => {
    cs_setBusy(cs_next);
    try {
      await cs_api.patch(`/api/admin/services/${cs_serviceId}/approval`, { approvalStatus: cs_next });
      toast.success(cs_next === "approved" ? "Service approved and now live" : "Service rejected");
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not update the service"));
    } finally {
      cs_setBusy(null);
      cs_setIsRejectOpen(false);
      cs_router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      {cs_status !== "approved" && (
        <button type="button" onClick={() => cs_decide("approved")} disabled={!!cs_busy} className="cs_btn cs_btn_style_2 px-3 py-1.5 text-xs">
          {cs_busy === "approved" ? <LoaderCircleIcon className="size-4 animate-spin" /> : <CheckIcon className="size-4" />}
          Approve
        </button>
      )}
      {cs_status !== "rejected" && (
        <AlertDialog open={cs_isRejectOpen} onOpenChange={(cs_open) => !cs_busy && cs_setIsRejectOpen(cs_open)}>
          <AlertDialogTrigger asChild>
            <button type="button" disabled={!!cs_busy} className="cs_table_action text-destructive hover:bg-destructive/10">
              <XIcon className="size-4" />
              {cs_status === "approved" ? "Unpublish" : "Reject"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{cs_status === "approved" ? "Unpublish this service?" : "Reject this service?"}</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-semibold text-(--cs_heading_color)">{cs_serviceTitle}</span> will be hidden from customers. The
                technician can edit it and send it for review again.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!cs_busy}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={!!cs_busy}
                onClick={(cs_event) => {
                  cs_event.preventDefault();
                  cs_decide("rejected");
                }}
              >
                {cs_busy === "rejected" && <LoaderCircleIcon className="size-4 animate-spin" />}
                {cs_status === "approved" ? "Yes, unpublish" : "Yes, reject"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Cs_ApprovalActions;
