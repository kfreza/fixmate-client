"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { ImageUpIcon, LoaderCircleIcon, SaveIcon, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import { CS_CATEGORIES, CS_SERVICE_MODES } from "@/lib/cs_constants";
import {
  CS_DESCRIPTION_MAX,
  CS_EMPTY_SERVICE_FORM,
  CS_IMAGE_TYPES,
  cs_validateImageFile,
  cs_validateServiceForm,
  type Cs_ServiceFormErrors,
  type Cs_ServiceFormValues,
} from "@/lib/cs_serviceForm";

type Cs_ServiceFormProps = {
  cs_mode: "create" | "edit";
  cs_serviceId?: string;
  cs_initial?: Cs_ServiceFormValues;
  cs_initialImage?: string;
  cs_onDone?: () => void;
};

type Cs_Phase = "idle" | "uploading" | "saving";

// Shared by Add Service and the edit modal
const Cs_ServiceForm = ({ cs_mode, cs_serviceId, cs_initial, cs_initialImage, cs_onDone }: Cs_ServiceFormProps) => {
  const [cs_values, cs_setValues] = useState<Cs_ServiceFormValues>(cs_initial ?? CS_EMPTY_SERVICE_FORM);
  const [cs_file, cs_setFile] = useState<File | null>(null);
  const [cs_preview, cs_setPreview] = useState<string | null>(null);
  const [cs_errors, cs_setErrors] = useState<Cs_ServiceFormErrors>({});
  const [cs_isTouched, cs_setIsTouched] = useState(false);
  const [cs_phase, cs_setPhase] = useState<Cs_Phase>("idle");
  const cs_isImageRequired = cs_mode === "create";

  // Free the old preview URL
  useEffect(() => () => {
    if (cs_preview) URL.revokeObjectURL(cs_preview);
  }, [cs_preview]);

  const cs_revalidate = (cs_nextValues: Cs_ServiceFormValues, cs_nextFile: File | null) => {
    if (cs_isTouched) cs_setErrors(cs_validateServiceForm(cs_nextValues, cs_nextFile, cs_isImageRequired));
  };

  const cs_update = (cs_field: keyof Cs_ServiceFormValues, cs_value: string) => {
    const cs_next = { ...cs_values, [cs_field]: cs_value };
    cs_setValues(cs_next);
    cs_revalidate(cs_next, cs_file);
  };

  const cs_handleFile = (cs_event: ChangeEvent<HTMLInputElement>) => {
    const cs_picked = cs_event.target.files?.[0] ?? null;
    const cs_error = cs_validateImageFile(cs_picked, false);
    if (cs_picked && cs_error) {
      // Show the problem right away and keep the old choice
      cs_setErrors((cs_old) => ({ ...cs_old, image: cs_error }));
      cs_event.target.value = "";
      return;
    }
    cs_setFile(cs_picked);
    cs_setPreview(cs_picked ? URL.createObjectURL(cs_picked) : null);
    cs_setErrors((cs_old) => ({ ...cs_old, image: undefined }));
    cs_revalidate(cs_values, cs_picked);
  };

  const cs_handleSubmit = async (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    cs_setIsTouched(true);
    const cs_found = cs_validateServiceForm(cs_values, cs_file, cs_isImageRequired);
    cs_setErrors(cs_found);
    if (Object.keys(cs_found).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    try {
      // Upload only on submit, so cancelled forms leave no stray images
      let cs_imageUrl = cs_initialImage;
      if (cs_file) {
        cs_setPhase("uploading");
        const cs_formData = new FormData();
        cs_formData.append("image", cs_file);
        const { data: cs_upload } = await cs_api.post<{ url: string }>("/api/upload", cs_formData);
        cs_imageUrl = cs_upload.url;
      }

      cs_setPhase("saving");
      const cs_payload = {
        title: cs_values.title.trim(),
        category: cs_values.category,
        description: cs_values.description.trim(),
        image: cs_imageUrl,
        basePrice: Number(cs_values.basePrice),
        estimatedDuration: cs_values.estimatedDuration.trim(),
        serviceMode: cs_values.serviceMode,
        serviceArea: cs_values.serviceArea.trim(),
      };

      if (cs_mode === "create") {
        await cs_api.post("/api/services", cs_payload);
        toast.success("Service submitted!", { description: "It is waiting for admin approval and will go live once approved." });
        cs_setValues(CS_EMPTY_SERVICE_FORM);
        cs_setFile(null);
        cs_setPreview(null);
        cs_setIsTouched(false);
        cs_setErrors({});
      } else {
        await cs_api.patch(`/api/services/${cs_serviceId}`, cs_payload);
        toast.success("Service updated", { description: "Changes go back to admin review before going live again." });
      }
      cs_onDone?.();
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not save the service"));
    } finally {
      cs_setPhase("idle");
    }
  };

  const cs_shownImage = cs_preview ?? cs_initialImage;
  const cs_isBusy = cs_phase !== "idle";

  return (
    <form onSubmit={cs_handleSubmit} noValidate className="flex flex-col gap-5">
      <fieldset disabled={cs_isBusy} className="contents">
        <div className="flex flex-col gap-2">
          <Label htmlFor="cs_service_title" className="cs_form_label">
            Service title
          </Label>
          <Input
            id="cs_service_title"
            placeholder="e.g. iPhone screen replacement"
            maxLength={100}
            value={cs_values.title}
            onChange={(cs_event) => cs_update("title", cs_event.target.value)}
            aria-invalid={!!cs_errors.title}
            className="cs_input"
          />
          {cs_errors.title && <p className="cs_field_error">{cs_errors.title}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_service_category" className="cs_form_label">
              Category
            </Label>
            <select
              id="cs_service_category"
              value={cs_values.category}
              onChange={(cs_event) => cs_update("category", cs_event.target.value)}
              aria-invalid={!!cs_errors.category}
              className="cs_select aria-invalid:border-destructive"
            >
              <option value="">Select a category</option>
              {CS_CATEGORIES.map((cs_category) => (
                <option key={cs_category} value={cs_category}>
                  {cs_category}
                </option>
              ))}
            </select>
            {cs_errors.category && <p className="cs_field_error">{cs_errors.category}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_service_mode" className="cs_form_label">
              Service mode
            </Label>
            <select
              id="cs_service_mode"
              value={cs_values.serviceMode}
              onChange={(cs_event) => cs_update("serviceMode", cs_event.target.value)}
              aria-invalid={!!cs_errors.serviceMode}
              className="cs_select aria-invalid:border-destructive"
            >
              <option value="">Select a mode</option>
              {CS_SERVICE_MODES.map((cs_mode_option) => (
                <option key={cs_mode_option} value={cs_mode_option}>
                  {cs_mode_option}
                </option>
              ))}
            </select>
            {cs_errors.serviceMode && <p className="cs_field_error">{cs_errors.serviceMode}</p>}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_service_price" className="cs_form_label">
              Starting price (USD)
            </Label>
            <Input
              id="cs_service_price"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              placeholder="25"
              value={cs_values.basePrice}
              onChange={(cs_event) => cs_update("basePrice", cs_event.target.value)}
              aria-invalid={!!cs_errors.basePrice}
              className="cs_input"
            />
            {cs_errors.basePrice && <p className="cs_field_error">{cs_errors.basePrice}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_service_duration" className="cs_form_label">
              Estimated duration
            </Label>
            <Input
              id="cs_service_duration"
              placeholder="e.g. 2 hours"
              maxLength={50}
              value={cs_values.estimatedDuration}
              onChange={(cs_event) => cs_update("estimatedDuration", cs_event.target.value)}
              aria-invalid={!!cs_errors.estimatedDuration}
              className="cs_input"
            />
            {cs_errors.estimatedDuration && <p className="cs_field_error">{cs_errors.estimatedDuration}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_service_area" className="cs_form_label">
              Service area
            </Label>
            <Input
              id="cs_service_area"
              placeholder="e.g. Mirpur, Dhaka"
              maxLength={100}
              value={cs_values.serviceArea}
              onChange={(cs_event) => cs_update("serviceArea", cs_event.target.value)}
              aria-invalid={!!cs_errors.serviceArea}
              className="cs_input"
            />
            {cs_errors.serviceArea && <p className="cs_field_error">{cs_errors.serviceArea}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="cs_service_description" className="cs_form_label">
              Description
            </Label>
            <span className="text-xs text-(--cs_body_color)">
              {cs_values.description.trim().length}/{CS_DESCRIPTION_MAX}
            </span>
          </div>
          <Textarea
            id="cs_service_description"
            rows={5}
            maxLength={CS_DESCRIPTION_MAX}
            placeholder="What is included, parts used, warranty, anything customers should know"
            value={cs_values.description}
            onChange={(cs_event) => cs_update("description", cs_event.target.value)}
            aria-invalid={!!cs_errors.description}
            className="min-h-32 rounded-xl bg-(--cs_card_color) px-3.5 py-3"
          />
          {cs_errors.description && <p className="cs_field_error">{cs_errors.description}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <span className="cs_form_label">Service image</span>
          <label htmlFor="cs_service_image" className={`cs_dropzone ${cs_errors.image ? "cs_invalid" : ""}`}>
            {cs_shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- local blob preview
              <img src={cs_shownImage} alt="Selected service" className="h-40 w-full rounded-lg object-cover sm:w-64" />
            ) : (
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-(--cs_soft_color) text-(--cs_primary_color)">
                <ImageUpIcon className="size-6" />
              </span>
            )}
            <span className="flex flex-col gap-1 text-center sm:text-left">
              <span className="font-semibold text-(--cs_heading_color)">
                {cs_file ? cs_file.name : cs_shownImage ? "Change image" : "Choose an image"}
              </span>
              <span className="text-xs text-(--cs_body_color)">JPG, PNG, WEBP or GIF, up to 2 MB</span>
            </span>
          </label>
          <input
            id="cs_service_image"
            type="file"
            accept={CS_IMAGE_TYPES.join(",")}
            onChange={cs_handleFile}
            className="sr-only"
          />
          {cs_errors.image && <p className="cs_field_error">{cs_errors.image}</p>}
        </div>
      </fieldset>

      <button type="submit" disabled={cs_isBusy} className="cs_btn cs_btn_style_2 w-full py-3.5 sm:w-auto sm:self-end">
        {cs_isBusy ? (
          <LoaderCircleIcon className="size-4 animate-spin" />
        ) : cs_mode === "create" ? (
          <SendIcon className="size-4" />
        ) : (
          <SaveIcon className="size-4" />
        )}
        {cs_phase === "uploading"
          ? "Uploading image…"
          : cs_phase === "saving"
            ? "Saving…"
            : cs_mode === "create"
              ? "Submit for Approval"
              : "Save Changes"}
      </button>
    </form>
  );
};

export default Cs_ServiceForm;
