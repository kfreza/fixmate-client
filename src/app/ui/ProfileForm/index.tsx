"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CameraIcon, LoaderCircleIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import { cs_getInitials } from "@/lib/cs_format";
import { CS_IMAGE_TYPES, cs_validateImageFile } from "@/lib/cs_serviceForm";

export interface Cs_ProfileValues {
  name: string;
  phone: string;
  area: string;
  bio: string;
}

type Cs_ProfileFormProps = {
  cs_initial: Cs_ProfileValues;
  cs_image: string | null;
  cs_showBio: boolean;
};

type Cs_ProfileErrors = Partial<Record<keyof Cs_ProfileValues | "image", string>>;

// Same rules as the server's cs_profileValidator
const cs_validate = (cs_values: Cs_ProfileValues): Cs_ProfileErrors => {
  const cs_errors: Cs_ProfileErrors = {};
  const cs_name = cs_values.name.trim();
  const cs_phone = cs_values.phone.replace(/[\s-]/g, "");
  if (cs_name.length < 2 || cs_name.length > 60) cs_errors.name = "Name must be 2 to 60 characters";
  if (cs_phone && !/^\+?\d{7,15}$/.test(cs_phone)) cs_errors.phone = "Phone number must have 7 to 15 digits";
  if (cs_values.area.trim().length > 100) cs_errors.area = "Area must be at most 100 characters";
  if (cs_values.bio.trim().length > 300) cs_errors.bio = "Bio must be at most 300 characters";
  return cs_errors;
};

const Cs_ProfileForm = ({ cs_initial, cs_image, cs_showBio }: Cs_ProfileFormProps) => {
  const cs_router = useRouter();
  const { refetch: cs_refetchSession } = useSession();
  const [cs_values, cs_setValues] = useState(cs_initial);
  const [cs_file, cs_setFile] = useState<File | null>(null);
  const [cs_preview, cs_setPreview] = useState<string | null>(null);
  const [cs_removePhoto, cs_setRemovePhoto] = useState(false);
  const [cs_errors, cs_setErrors] = useState<Cs_ProfileErrors>({});
  const [cs_phase, cs_setPhase] = useState<"idle" | "uploading" | "saving">("idle");

  useEffect(() => () => {
    if (cs_preview) URL.revokeObjectURL(cs_preview);
  }, [cs_preview]);

  const cs_update = (cs_field: keyof Cs_ProfileValues, cs_value: string) => {
    cs_setValues((cs_old) => ({ ...cs_old, [cs_field]: cs_value }));
    cs_setErrors((cs_old) => ({ ...cs_old, [cs_field]: undefined }));
  };

  const cs_handleFile = (cs_event: ChangeEvent<HTMLInputElement>) => {
    const cs_picked = cs_event.target.files?.[0] ?? null;
    cs_event.target.value = "";
    const cs_error = cs_validateImageFile(cs_picked, false);
    if (cs_error) {
      cs_setErrors((cs_old) => ({ ...cs_old, image: cs_error }));
      return;
    }
    cs_setFile(cs_picked);
    cs_setPreview(cs_picked ? URL.createObjectURL(cs_picked) : null);
    cs_setRemovePhoto(false);
    cs_setErrors((cs_old) => ({ ...cs_old, image: undefined }));
  };

  const cs_handleRemove = () => {
    cs_setFile(null);
    cs_setPreview(null);
    cs_setRemovePhoto(true);
  };

  const cs_handleSubmit = async (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    const cs_found = cs_validate(cs_values);
    cs_setErrors(cs_found);
    if (Object.keys(cs_found).length) return;

    try {
      const cs_payload: Record<string, string> = {
        name: cs_values.name.trim(),
        phone: cs_values.phone.trim(),
        area: cs_values.area.trim(),
        ...(cs_showBio ? { bio: cs_values.bio.trim() } : {}),
      };
      if (cs_file) {
        cs_setPhase("uploading");
        const cs_formData = new FormData();
        cs_formData.append("image", cs_file);
        const { data: cs_upload } = await cs_api.post<{ url: string }>("/api/upload", cs_formData);
        cs_payload.image = cs_upload.url;
      } else if (cs_removePhoto) {
        cs_payload.image = "";
      }

      cs_setPhase("saving");
      await cs_api.patch("/api/users/profile", cs_payload);
      // Navbar reads the client session; the dashboard top bar reads the server one
      await cs_refetchSession();
      cs_router.refresh();
      // Show the saved photo from the server, not the local preview
      cs_setFile(null);
      cs_setPreview(null);
      cs_setRemovePhoto(false);
      toast.success("Profile updated");
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not update your profile"));
    } finally {
      cs_setPhase("idle");
    }
  };

  const cs_shownImage = cs_preview ?? (cs_removePhoto ? null : cs_image);
  const cs_isBusy = cs_phase !== "idle";

  return (
    <form onSubmit={cs_handleSubmit} noValidate className="flex flex-col gap-6">
      <fieldset disabled={cs_isBusy} className="contents">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="size-24">
            {cs_shownImage && <AvatarImage src={cs_shownImage} alt="Profile photo" />}
            <AvatarFallback className="bg-(--cs_primary_color) text-2xl font-semibold text-(--cs_primary_text_color)">
              {cs_getInitials(cs_values.name || "?")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <div className="flex flex-wrap justify-center gap-2">
              <label htmlFor="cs_profile_photo" className="cs_btn cs_btn_style_3 cursor-pointer px-4 py-2 text-xs has-[+input:focus-visible]:ring-3">
                <CameraIcon className="size-4" />
                {cs_shownImage ? "Change photo" : "Upload photo"}
              </label>
              <input id="cs_profile_photo" type="file" accept={CS_IMAGE_TYPES.join(",")} onChange={cs_handleFile} className="sr-only" />
              {cs_shownImage && (
                <button type="button" onClick={cs_handleRemove} className="cs_table_action text-destructive hover:bg-destructive/10">
                  <Trash2Icon className="size-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-(--cs_body_color)">
              {cs_file ? `${cs_file.name} will upload when you save` : "JPG, PNG, WEBP or GIF, up to 2 MB"}
            </p>
            {cs_errors.image && <p className="cs_field_error">{cs_errors.image}</p>}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_profile_name" className="cs_form_label">
              Full name
            </Label>
            <Input
              id="cs_profile_name"
              autoComplete="name"
              maxLength={60}
              value={cs_values.name}
              onChange={(cs_event) => cs_update("name", cs_event.target.value)}
              aria-invalid={!!cs_errors.name}
              className="cs_input"
            />
            {cs_errors.name && <p className="cs_field_error">{cs_errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_profile_phone" className="cs_form_label">
              Phone <span className="font-normal text-(--cs_body_color)">(optional)</span>
            </Label>
            <Input
              id="cs_profile_phone"
              type="tel"
              autoComplete="tel"
              placeholder="01712-345678"
              value={cs_values.phone}
              onChange={(cs_event) => cs_update("phone", cs_event.target.value)}
              aria-invalid={!!cs_errors.phone}
              className="cs_input"
            />
            {cs_errors.phone && <p className="cs_field_error">{cs_errors.phone}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="cs_profile_area" className="cs_form_label">
            Area <span className="font-normal text-(--cs_body_color)">(optional)</span>
          </Label>
          <Input
            id="cs_profile_area"
            placeholder="e.g. Mirpur, Dhaka"
            maxLength={100}
            value={cs_values.area}
            onChange={(cs_event) => cs_update("area", cs_event.target.value)}
            aria-invalid={!!cs_errors.area}
            className="cs_input"
          />
          {cs_errors.area && <p className="cs_field_error">{cs_errors.area}</p>}
        </div>

        {cs_showBio && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cs_profile_bio" className="cs_form_label">
                Bio <span className="font-normal text-(--cs_body_color)">(shown on your service pages)</span>
              </Label>
              <span className="text-xs text-(--cs_body_color)">{cs_values.bio.trim().length}/300</span>
            </div>
            <Textarea
              id="cs_profile_bio"
              rows={4}
              maxLength={300}
              placeholder="Your experience, specialities and warranty"
              value={cs_values.bio}
              onChange={(cs_event) => cs_update("bio", cs_event.target.value)}
              aria-invalid={!!cs_errors.bio}
              className="min-h-28 rounded-xl px-3.5 py-3"
            />
            {cs_errors.bio && <p className="cs_field_error">{cs_errors.bio}</p>}
          </div>
        )}
      </fieldset>

      <button type="submit" disabled={cs_isBusy} className="cs_btn cs_btn_style_2 w-full py-3.5 sm:w-auto sm:self-end">
        {cs_isBusy ? <LoaderCircleIcon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
        {cs_phase === "uploading" ? "Uploading photo…" : cs_phase === "saving" ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
};

export default Cs_ProfileForm;
