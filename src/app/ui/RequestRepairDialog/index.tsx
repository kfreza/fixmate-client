"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LoaderCircleIcon, SendIcon, WrenchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import {
  CS_BOOKING_MAX_DAYS_AHEAD,
  CS_PROBLEM_MAX,
  CS_PROBLEM_MIN,
  cs_getDhakaDay,
  cs_validateBookingForm,
  type Cs_BookingFormErrors,
  type Cs_BookingFormValues,
} from "@/lib/cs_bookingForm";

type Cs_RequestRepairDialogProps = {
  cs_serviceId: string;
  cs_serviceTitle: string;
  cs_customer: { name: string; email: string };
};

const CS_EMPTY_FORM: Cs_BookingFormValues = { customerPhone: "", address: "", preferredDate: "", problemDescription: "" };

// Customer-only modal; name and email come from the session
const Cs_RequestRepairDialog = ({ cs_serviceId, cs_serviceTitle, cs_customer }: Cs_RequestRepairDialogProps) => {
  const [cs_isOpen, cs_setIsOpen] = useState(false);
  const [cs_values, cs_setValues] = useState<Cs_BookingFormValues>(CS_EMPTY_FORM);
  const [cs_errors, cs_setErrors] = useState<Cs_BookingFormErrors>({});
  const [cs_isTouched, cs_setIsTouched] = useState(false);
  const [cs_isSubmitting, cs_setIsSubmitting] = useState(false);

  // Live errors only after the first submit attempt
  const cs_update = (cs_field: keyof Cs_BookingFormValues, cs_value: string) => {
    const cs_next = { ...cs_values, [cs_field]: cs_value };
    cs_setValues(cs_next);
    if (cs_isTouched) cs_setErrors(cs_validateBookingForm(cs_next));
  };

  const cs_handleSubmit = async (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    cs_setIsTouched(true);
    const cs_found = cs_validateBookingForm(cs_values);
    cs_setErrors(cs_found);
    if (Object.keys(cs_found).length) return;

    cs_setIsSubmitting(true);
    try {
      await cs_api.post("/api/bookings", { serviceId: cs_serviceId, ...cs_values });
      toast.success("Repair request sent!", {
        description: "The technician will review it soon. You can track it from your dashboard.",
      });
      cs_setIsOpen(false);
      cs_setValues(CS_EMPTY_FORM);
      cs_setIsTouched(false);
      cs_setErrors({});
    } catch (cs_error) {
      const cs_status = axios.isAxiosError(cs_error) ? cs_error.response?.status : undefined;
      if (cs_status === 409) {
        // Already has an active request; nothing to fix in the form
        toast.warning("You already requested this service", {
          description: "Wait until your current request is finished before sending a new one.",
        });
        cs_setIsOpen(false);
      } else {
        toast.error(cs_getErrorMessage(cs_error, "Could not send your request. Please try again."));
      }
    } finally {
      cs_setIsSubmitting(false);
    }
  };

  const cs_problemLength = cs_values.problemDescription.trim().length;

  return (
    <Dialog open={cs_isOpen} onOpenChange={(cs_open) => !cs_isSubmitting && cs_setIsOpen(cs_open)}>
      <DialogTrigger asChild>
        <button type="button" className="cs_btn cs_btn_style_1 w-full py-3.5 text-base">
          <WrenchIcon className="size-5" />
          Request Repair
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-h-[92vh] overflow-y-auto sm:max-w-lg"
        // Skip the read-only fields and start on phone
        onOpenAutoFocus={(cs_event) => {
          cs_event.preventDefault();
          document.getElementById("cs_booking_phone")?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Request a repair</DialogTitle>
          <DialogDescription className="line-clamp-2">{cs_serviceTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={cs_handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cs_booking_name" className="cs_form_label">
                Name
              </Label>
              <Input id="cs_booking_name" value={cs_customer.name} readOnly className="cs_input cs_input_readonly" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cs_booking_email" className="cs_form_label">
                Email
              </Label>
              <Input id="cs_booking_email" value={cs_customer.email} readOnly className="cs_input cs_input_readonly" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cs_booking_phone" className="cs_form_label">
                Phone
              </Label>
              <Input
                id="cs_booking_phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="01712-345678"
                value={cs_values.customerPhone}
                onChange={(cs_event) => cs_update("customerPhone", cs_event.target.value)}
                aria-invalid={!!cs_errors.customerPhone}
                className="cs_input"
              />
              {cs_errors.customerPhone && <p className="cs_field_error">{cs_errors.customerPhone}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cs_booking_date" className="cs_form_label">
                Preferred date
              </Label>
              <Input
                id="cs_booking_date"
                type="date"
                min={cs_getDhakaDay()}
                max={cs_getDhakaDay(CS_BOOKING_MAX_DAYS_AHEAD)}
                value={cs_values.preferredDate}
                onChange={(cs_event) => cs_update("preferredDate", cs_event.target.value)}
                aria-invalid={!!cs_errors.preferredDate}
                className="cs_input dark:scheme-dark"
              />
              {cs_errors.preferredDate && <p className="cs_field_error">{cs_errors.preferredDate}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_booking_address" className="cs_form_label">
              Address
            </Label>
            <Input
              id="cs_booking_address"
              autoComplete="street-address"
              placeholder="House, road, area"
              value={cs_values.address}
              onChange={(cs_event) => cs_update("address", cs_event.target.value)}
              aria-invalid={!!cs_errors.address}
              className="cs_input"
            />
            {cs_errors.address && <p className="cs_field_error">{cs_errors.address}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cs_booking_problem" className="cs_form_label">
                Describe the problem
              </Label>
              <span
                className={`text-xs ${cs_problemLength < CS_PROBLEM_MIN ? "text-(--cs_body_color)" : "text-(--cs_primary_color)"}`}
              >
                {cs_problemLength}/{CS_PROBLEM_MIN}+
              </span>
            </div>
            <Textarea
              id="cs_booking_problem"
              rows={4}
              maxLength={CS_PROBLEM_MAX}
              placeholder="What is wrong, since when, and anything you already tried"
              value={cs_values.problemDescription}
              onChange={(cs_event) => cs_update("problemDescription", cs_event.target.value)}
              aria-invalid={!!cs_errors.problemDescription}
              className="min-h-28 rounded-xl bg-(--cs_card_color) px-3.5 py-3"
            />
            {cs_errors.problemDescription && <p className="cs_field_error">{cs_errors.problemDescription}</p>}
          </div>

          <button type="submit" disabled={cs_isSubmitting} className="cs_btn cs_btn_style_1 mt-2 w-full py-3.5">
            {cs_isSubmitting ? <LoaderCircleIcon className="size-5 animate-spin" /> : <SendIcon className="size-4" />}
            {cs_isSubmitting ? "Sending request…" : "Send Request"}
          </button>
          <p className="text-center text-xs text-(--cs_body_color)">You pay only after the job is completed.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Cs_RequestRepairDialog;
