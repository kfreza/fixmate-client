import { CS_CATEGORIES, CS_SERVICE_MODES } from "@/lib/cs_constants";

// Mirrors the server rules in cs_serviceValidator.ts
export const CS_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const CS_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
export const CS_DESCRIPTION_MIN = 20;
export const CS_DESCRIPTION_MAX = 2000;

export interface Cs_ServiceFormValues {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
}

export type Cs_ServiceFormErrors = Partial<Record<keyof Cs_ServiceFormValues | "image", string>>;

export const CS_EMPTY_SERVICE_FORM: Cs_ServiceFormValues = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

const cs_lengthError = (cs_label: string, cs_value: string, cs_min: number, cs_max: number) => {
  const cs_length = cs_value.trim().length;
  if (!cs_length) return `${cs_label} is required`;
  if (cs_length < cs_min) return `${cs_label} must be at least ${cs_min} characters`;
  if (cs_length > cs_max) return `${cs_label} must be at most ${cs_max} characters`;
  return undefined;
};

export const cs_validateImageFile = (cs_file: File | null, cs_isRequired: boolean) => {
  if (!cs_file) return cs_isRequired ? "Please choose a service image" : undefined;
  if (!CS_IMAGE_TYPES.includes(cs_file.type)) return "Only JPG, PNG, WEBP or GIF images are allowed";
  if (cs_file.size > CS_IMAGE_MAX_BYTES) return "Image must be 2 MB or smaller";
  return undefined;
};

export const cs_validateServiceForm = (
  cs_values: Cs_ServiceFormValues,
  cs_file: File | null,
  cs_isImageRequired: boolean,
): Cs_ServiceFormErrors => {
  const cs_price = Number(cs_values.basePrice);
  const cs_errors: Cs_ServiceFormErrors = {
    title: cs_lengthError("Title", cs_values.title, 3, 100),
    category: CS_CATEGORIES.includes(cs_values.category as never) ? undefined : "Choose a category",
    description: cs_lengthError("Description", cs_values.description, CS_DESCRIPTION_MIN, CS_DESCRIPTION_MAX),
    basePrice:
      cs_values.basePrice.trim() && Number.isFinite(cs_price) && cs_price > 0 && cs_price <= 100000
        ? undefined
        : "Price must be greater than 0 (max 100000)",
    estimatedDuration: cs_lengthError("Estimated duration", cs_values.estimatedDuration, 1, 50),
    serviceMode: CS_SERVICE_MODES.includes(cs_values.serviceMode as never) ? undefined : "Choose a service mode",
    serviceArea: cs_lengthError("Service area", cs_values.serviceArea, 2, 100),
    image: cs_validateImageFile(cs_file, cs_isImageRequired),
  };
  // Keep only the fields that failed
  return Object.fromEntries(Object.entries(cs_errors).filter(([, cs_error]) => cs_error)) as Cs_ServiceFormErrors;
};
