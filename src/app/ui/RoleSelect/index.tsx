"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import { CS_ROLES, type Cs_Role } from "@/lib/cs_constants";

type Cs_RoleSelectProps = {
  cs_userId: string;
  cs_userName: string;
  cs_role: Cs_Role;
  cs_isSelf: boolean;
};

const CS_ROLE_NOTES: Record<Cs_Role, string> = {
  customer: "They will be able to book repairs. Their services and jobs stay in the database.",
  technician: "They will be able to list services and manage repair jobs.",
  admin: "They will get full access: users, approvals, bookings and payments.",
};

// Asks first; the server also blocks changing your own role
const Cs_RoleSelect = ({ cs_userId, cs_userName, cs_role, cs_isSelf }: Cs_RoleSelectProps) => {
  const cs_router = useRouter();
  const [cs_pending, cs_setPending] = useState<Cs_Role | null>(null);
  const [cs_isSaving, cs_setIsSaving] = useState(false);

  const cs_handleConfirm = async () => {
    if (!cs_pending) return;
    cs_setIsSaving(true);
    try {
      const { data: cs_data } = await cs_api.patch<{ message: string }>(`/api/admin/users/${cs_userId}/role`, { role: cs_pending });
      toast.success(cs_data.message);
      cs_router.refresh();
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not change the role"));
    } finally {
      cs_setIsSaving(false);
      cs_setPending(null);
    }
  };

  return (
    <>
      <select
        value={cs_role}
        disabled={cs_isSelf || cs_isSaving}
        title={cs_isSelf ? "You cannot change your own role" : undefined}
        aria-label={`Role for ${cs_userName}`}
        onChange={(cs_event) => cs_setPending(cs_event.target.value as Cs_Role)}
        className="cs_select h-9 w-36 text-xs disabled:cursor-not-allowed disabled:opacity-60"
      >
        {CS_ROLES.map((cs_option) => (
          <option key={cs_option} value={cs_option}>
            {cs_option.charAt(0).toUpperCase() + cs_option.slice(1)}
          </option>
        ))}
      </select>

      <AlertDialog open={!!cs_pending} onOpenChange={(cs_open) => !cs_open && !cs_isSaving && cs_setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Make {cs_userName} {cs_pending === "admin" ? "an" : "a"} {cs_pending}?
            </AlertDialogTitle>
            <AlertDialogDescription>{cs_pending && CS_ROLE_NOTES[cs_pending]}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cs_isSaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={cs_isSaving}
              onClick={(cs_event) => {
                cs_event.preventDefault();
                cs_handleConfirm();
              }}
            >
              {cs_isSaving && <LoaderCircleIcon className="size-4 animate-spin" />}
              Change role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Cs_RoleSelect;
