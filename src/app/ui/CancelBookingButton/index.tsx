"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon, XCircleIcon } from "lucide-react";
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

type Cs_CancelBookingButtonProps = {
  cs_bookingId: string;
  cs_serviceTitle: string;
};

// Confirm first; the server allows it only while "requested"
const Cs_CancelBookingButton = ({ cs_bookingId, cs_serviceTitle }: Cs_CancelBookingButtonProps) => {
  const cs_router = useRouter();
  const [cs_isOpen, cs_setIsOpen] = useState(false);
  const [cs_isCancelling, cs_setIsCancelling] = useState(false);

  const cs_handleCancel = async () => {
    cs_setIsCancelling(true);
    try {
      await cs_api.patch(`/api/bookings/${cs_bookingId}/cancel`);
      toast.success("Booking cancelled");
      cs_setIsOpen(false);
      cs_router.refresh();
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not cancel this booking"));
      cs_setIsOpen(false);
      // The status may have changed meanwhile, so show the latest
      cs_router.refresh();
    } finally {
      cs_setIsCancelling(false);
    }
  };

  return (
    <AlertDialog open={cs_isOpen} onOpenChange={(cs_open) => !cs_isCancelling && cs_setIsOpen(cs_open)}>
      <AlertDialogTrigger asChild>
        <button type="button" className="cs_table_action text-destructive hover:bg-destructive/10">
          <XCircleIcon className="size-4" />
          Cancel
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            Your request for <span className="font-semibold text-(--cs_heading_color)">{cs_serviceTitle}</span> will be withdrawn.
            This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cs_isCancelling}>Keep booking</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={cs_isCancelling}
            onClick={(cs_event) => {
              // Keep the dialog open until the request finishes
              cs_event.preventDefault();
              cs_handleCancel();
            }}
          >
            {cs_isCancelling && <LoaderCircleIcon className="size-4 animate-spin" />}
            Yes, cancel it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Cs_CancelBookingButton;
