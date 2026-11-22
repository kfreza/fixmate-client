"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2Icon, CheckIcon, LoaderCircleIcon, PlayIcon, XIcon } from "lucide-react";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import { cs_formatMoney } from "@/lib/cs_format";
import type { Cs_Booking, Cs_BookingStatus } from "@/lib/cs_types";

// Same limits as the server (Stripe needs at least 0.50 USD)
const CS_MIN_AMOUNT = 0.5;
const CS_MAX_AMOUNT = 100000;

type Cs_JobActionsProps = {
  cs_data: Pick<Cs_Booking, "_id" | "status" | "serviceTitle" | "customerName" | "basePrice" | "finalAmount">;
};

// Only the moves the server allows from the current status
const Cs_JobActions = ({ cs_data }: Cs_JobActionsProps) => {
  const cs_router = useRouter();
  const [cs_busy, cs_setBusy] = useState<Cs_BookingStatus | null>(null);
  const [cs_isRejectOpen, cs_setIsRejectOpen] = useState(false);
  const [cs_isCompleteOpen, cs_setIsCompleteOpen] = useState(false);
  const [cs_amount, cs_setAmount] = useState(String(cs_data.finalAmount ?? cs_data.basePrice));
  const [cs_amountError, cs_setAmountError] = useState("");

  const cs_move = async (cs_next: Cs_BookingStatus, cs_finalAmount?: number) => {
    cs_setBusy(cs_next);
    try {
      await cs_api.patch(`/api/bookings/${cs_data._id}/status`, { status: cs_next, finalAmount: cs_finalAmount });
      const cs_messages: Partial<Record<Cs_BookingStatus, string>> = {
        accepted: "Request accepted",
        rejected: "Request rejected",
        "in-progress": "Job started",
        completed: `Job completed. ${cs_data.customerName} can now pay ${cs_formatMoney(cs_finalAmount ?? 0)}.`,
      };
      toast.success(cs_messages[cs_next] ?? "Status updated");
      cs_setIsRejectOpen(false);
      cs_setIsCompleteOpen(false);
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not update the job"));
      cs_setIsRejectOpen(false);
    } finally {
      cs_setBusy(null);
      // Show the latest state either way (it may have changed meanwhile)
      cs_router.refresh();
    }
  };

  const cs_handleComplete = (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    const cs_value = Math.round(Number(cs_amount) * 100) / 100;
    if (!cs_amount.trim() || !Number.isFinite(cs_value) || cs_value < CS_MIN_AMOUNT || cs_value > CS_MAX_AMOUNT) {
      cs_setAmountError(`Enter an amount between ${CS_MIN_AMOUNT} and ${CS_MAX_AMOUNT}`);
      return;
    }
    cs_setAmountError("");
    cs_move("completed", cs_value);
  };

  const cs_spinner = <LoaderCircleIcon className="size-4 animate-spin" />;

  if (cs_data.status === "requested") {
    return (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <button type="button" onClick={() => cs_move("accepted")} disabled={!!cs_busy} className="cs_btn cs_btn_style_2 px-3 py-1.5 text-xs">
          {cs_busy === "accepted" ? cs_spinner : <CheckIcon className="size-4" />}
          Accept
        </button>
        <AlertDialog open={cs_isRejectOpen} onOpenChange={(cs_open) => !cs_busy && cs_setIsRejectOpen(cs_open)}>
          <AlertDialogTrigger asChild>
            <button type="button" disabled={!!cs_busy} className="cs_table_action text-destructive hover:bg-destructive/10">
              <XIcon className="size-4" />
              Reject
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject this request?</AlertDialogTitle>
              <AlertDialogDescription>
                {cs_data.customerName}&apos;s request for{" "}
                <span className="font-semibold text-(--cs_heading_color)">{cs_data.serviceTitle}</span> will be closed. This cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={!!cs_busy}>Keep it</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={!!cs_busy}
                onClick={(cs_event) => {
                  cs_event.preventDefault();
                  cs_move("rejected");
                }}
              >
                {cs_busy === "rejected" && cs_spinner}
                Yes, reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (cs_data.status === "accepted") {
    return (
      <button type="button" onClick={() => cs_move("in-progress")} disabled={!!cs_busy} className="cs_btn cs_btn_style_2 px-3 py-1.5 text-xs whitespace-nowrap">
        {cs_busy ? cs_spinner : <PlayIcon className="size-4" />}
        Start Work
      </button>
    );
  }

  if (cs_data.status === "in-progress") {
    return (
      <Dialog open={cs_isCompleteOpen} onOpenChange={(cs_open) => !cs_busy && cs_setIsCompleteOpen(cs_open)}>
        <DialogTrigger asChild>
          <button type="button" className="cs_btn cs_btn_style_1 px-3 py-1.5 text-xs whitespace-nowrap">
            <CheckCircle2Icon className="size-4" />
            Mark Completed
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Complete this job</DialogTitle>
            <DialogDescription>
              Set the final amount for <span className="font-semibold text-(--cs_heading_color)">{cs_data.serviceTitle}</span>.
              {` ${cs_data.customerName}`} will pay this online.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={cs_handleComplete} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`cs_amount_${cs_data._id}`} className="cs_form_label">
                Final amount (USD)
              </Label>
              <Input
                id={`cs_amount_${cs_data._id}`}
                type="number"
                inputMode="decimal"
                min={CS_MIN_AMOUNT}
                step="0.01"
                value={cs_amount}
                onChange={(cs_event) => {
                  cs_setAmount(cs_event.target.value);
                  cs_setAmountError("");
                }}
                aria-invalid={!!cs_amountError}
                className="cs_input"
                autoFocus
              />
              <p className="text-xs text-(--cs_body_color)">Starting price was {cs_formatMoney(cs_data.basePrice)}.</p>
              {cs_amountError && <p className="cs_field_error">{cs_amountError}</p>}
            </div>
            <button type="submit" disabled={!!cs_busy} className="cs_btn cs_btn_style_1 w-full py-3">
              {cs_busy ? cs_spinner : <CheckCircle2Icon className="size-4" />}
              Confirm and Complete
            </button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
};

export default Cs_JobActions;
