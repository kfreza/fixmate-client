"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon, StarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";

const CS_REVIEW_MAX = 500;
const CS_STAR_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

type Cs_ReviewDialogProps = {
  cs_bookingId: string;
  cs_serviceTitle: string;
  cs_technicianName: string;
};

// Paid jobs only; the server allows one review per booking
const Cs_ReviewDialog = ({ cs_bookingId, cs_serviceTitle, cs_technicianName }: Cs_ReviewDialogProps) => {
  const cs_router = useRouter();
  const [cs_isOpen, cs_setIsOpen] = useState(false);
  const [cs_rating, cs_setRating] = useState(0);
  const [cs_hover, cs_setHover] = useState(0);
  const [cs_review, cs_setReview] = useState("");
  const [cs_error, cs_setError] = useState("");
  const [cs_isSaving, cs_setIsSaving] = useState(false);
  const cs_shown = cs_hover || cs_rating;

  const cs_handleSubmit = async (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    if (!cs_rating) {
      cs_setError("Pick a star rating");
      return;
    }
    cs_setIsSaving(true);
    try {
      await cs_api.patch(`/api/bookings/${cs_bookingId}/review`, { rating: cs_rating, review: cs_review.trim() || undefined });
      toast.success("Thanks for your review!");
      cs_setIsOpen(false);
    } catch (cs_err) {
      toast.error(cs_getErrorMessage(cs_err, "Could not save your review"));
      cs_setIsOpen(false);
    } finally {
      cs_setIsSaving(false);
      cs_router.refresh();
    }
  };

  return (
    <Dialog open={cs_isOpen} onOpenChange={(cs_open) => !cs_isSaving && cs_setIsOpen(cs_open)}>
      <DialogTrigger asChild>
        <button type="button" className="cs_table_action text-amber-600 hover:bg-amber-500/10 dark:text-amber-400">
          <StarIcon className="size-4" />
          Rate job
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Rate this repair</DialogTitle>
          <DialogDescription>
            {cs_serviceTitle} by {cs_technicianName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={cs_handleSubmit} noValidate className="flex flex-col gap-5">
          {/* Radio group: arrow keys move between stars */}
          <fieldset className="flex flex-col items-center gap-2">
            <legend className="sr-only">Rating</legend>
            <div className="flex gap-1" onMouseLeave={() => cs_setHover(0)}>
              {CS_STAR_LABELS.map((cs_label, cs_index) => {
                const cs_value = cs_index + 1;
                return (
                  <label key={cs_value} className="cursor-pointer rounded-md p-1 has-focus-visible:ring-3 has-focus-visible:ring-ring/50" onMouseEnter={() => cs_setHover(cs_value)}>
                    <input
                      type="radio"
                      name="cs_rating"
                      value={cs_value}
                      checked={cs_rating === cs_value}
                      onChange={() => {
                        cs_setRating(cs_value);
                        cs_setError("");
                      }}
                      className="sr-only"
                    />
                    <StarIcon
                      className={`size-9 transition-colors ${cs_value <= cs_shown ? "fill-amber-400 text-amber-400" : "fill-transparent text-(--cs_border_color)"}`}
                    />
                    <span className="sr-only">
                      {cs_value} star{cs_value > 1 ? "s" : ""}, {cs_label}
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="h-5 text-sm font-medium text-(--cs_heading_color)">{cs_shown ? CS_STAR_LABELS[cs_shown - 1] : ""}</p>
            {cs_error && <p className="cs_field_error">{cs_error}</p>}
          </fieldset>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`cs_review_${cs_bookingId}`} className="cs_form_label">
                Your review <span className="font-normal text-(--cs_body_color)">(optional)</span>
              </Label>
              <span className="text-xs text-(--cs_body_color)">
                {cs_review.trim().length}/{CS_REVIEW_MAX}
              </span>
            </div>
            <Textarea
              id={`cs_review_${cs_bookingId}`}
              rows={4}
              maxLength={CS_REVIEW_MAX}
              placeholder="How was the repair, timing and communication?"
              value={cs_review}
              onChange={(cs_event) => cs_setReview(cs_event.target.value)}
              className="min-h-24 rounded-xl px-3.5 py-3"
            />
          </div>

          <button type="submit" disabled={cs_isSaving} className="cs_btn cs_btn_style_1 w-full py-3">
            {cs_isSaving && <LoaderCircleIcon className="size-4 animate-spin" />}
            Submit Review
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Cs_ReviewDialog;
