"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
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

type Cs_DeleteServiceButtonProps = {
  cs_serviceId: string;
  cs_serviceTitle: string;
};

// The server refuses (409) while the service has active bookings
const Cs_DeleteServiceButton = ({ cs_serviceId, cs_serviceTitle }: Cs_DeleteServiceButtonProps) => {
  const cs_router = useRouter();
  const [cs_isOpen, cs_setIsOpen] = useState(false);
  const [cs_isDeleting, cs_setIsDeleting] = useState(false);

  const cs_handleDelete = async () => {
    cs_setIsDeleting(true);
    try {
      await cs_api.delete(`/api/services/${cs_serviceId}`);
      toast.success("Service deleted");
      cs_router.refresh();
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not delete this service"));
    } finally {
      cs_setIsDeleting(false);
      cs_setIsOpen(false);
    }
  };

  return (
    <AlertDialog open={cs_isOpen} onOpenChange={(cs_open) => !cs_isDeleting && cs_setIsOpen(cs_open)}>
      <AlertDialogTrigger asChild>
        <button type="button" className="cs_table_action text-destructive hover:bg-destructive/10">
          <Trash2Icon className="size-4" />
          Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this service?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-(--cs_heading_color)">{cs_serviceTitle}</span> will be removed for good. Past
            bookings keep their own copy of the details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cs_isDeleting}>Keep it</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={cs_isDeleting}
            onClick={(cs_event) => {
              cs_event.preventDefault();
              cs_handleDelete();
            }}
          >
            {cs_isDeleting && <LoaderCircleIcon className="size-4 animate-spin" />}
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Cs_DeleteServiceButton;
