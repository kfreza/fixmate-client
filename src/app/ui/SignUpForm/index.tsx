"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckIcon, Loader2Icon, UserIcon, WrenchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import {
  CS_EMAIL_REGEX,
  CS_PASSWORD_RULES,
  cs_getDashboardPath,
  cs_getPasswordErrors,
  type Cs_SignupRole,
} from "@/lib/cs_constants";
import Cs_PasswordInput from "@/app/ui/PasswordInput";

const cs_data = {
  roles: [
    { value: "customer", icon: UserIcon, title: "Customer", text: "I need a device repaired" },
    { value: "technician", icon: WrenchIcon, title: "Technician", text: "I offer repair services" },
  ] as const,
};

type Cs_SignUpErrors = Partial<Record<"name" | "email" | "password", string>>;

const cs_validate = (cs_name: string, cs_email: string, cs_password: string) => {
  const cs_errors: Cs_SignUpErrors = {};
  if (!cs_name) cs_errors.name = "Full name is required";
  if (!cs_email) cs_errors.email = "Email is required";
  else if (!CS_EMAIL_REGEX.test(cs_email)) cs_errors.email = "Enter a valid email address";
  if (!cs_password) cs_errors.password = "Password is required";
  else if (cs_getPasswordErrors(cs_password).length) cs_errors.password = "Password does not meet the rules below";
  return cs_errors;
};

const Cs_SignUpForm = () => {
  const cs_router = useRouter();
  const [cs_name, cs_setName] = useState("");
  const [cs_email, cs_setEmail] = useState("");
  const [cs_password, cs_setPassword] = useState("");
  const [cs_role, cs_setRole] = useState<Cs_SignupRole>("customer");
  const [cs_errors, cs_setErrors] = useState<Cs_SignUpErrors>({});
  const [cs_isSubmitting, cs_setIsSubmitting] = useState(false);

  const cs_handleSubmit = async (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    const cs_trimmedName = cs_name.trim();
    const cs_trimmedEmail = cs_email.trim().toLowerCase();

    const cs_newErrors = cs_validate(cs_trimmedName, cs_trimmedEmail, cs_password);
    cs_setErrors(cs_newErrors);
    if (Object.keys(cs_newErrors).length) return;

    cs_setIsSubmitting(true);
    const { error: cs_error } = await signUp.email({
      name: cs_trimmedName,
      email: cs_trimmedEmail,
      password: cs_password,
      role: cs_role,
    });

    if (cs_error) {
      cs_setIsSubmitting(false);
      toast.error(cs_error.message || "Sign up failed. Please try again.");
      return;
    }

    toast.success(`Welcome to FixMate, ${cs_trimmedName}!`);
    cs_router.push(cs_getDashboardPath(cs_role));
    cs_router.refresh();
  };

  return (
    <form onSubmit={cs_handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Role selection */}
      <fieldset>
        <legend className="cs_form_label mb-2">I want to join as</legend>
        <div role="radiogroup" className="grid grid-cols-2 gap-3">
          {cs_data.roles.map(({ value, icon: Cs_Icon, title, text }) => (
            <label key={value} className={`cs_role_card ${cs_role === value ? "cs_active" : ""}`}>
              <input
                type="radio"
                name="role"
                value={value}
                checked={cs_role === value}
                onChange={() => cs_setRole(value)}
                className="sr-only"
              />
              <span className="cs_role_card_icon">
                <Cs_Icon className="size-4" />
              </span>
              <span className="font-semibold text-(--cs_heading_color)">{title}</span>
              <span className="text-xs text-(--cs_body_color)">{text}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cs_name" className="cs_form_label">
          Full Name
        </Label>
        <Input
          id="cs_name"
          autoComplete="name"
          placeholder="Rahim Uddin"
          value={cs_name}
          onChange={(cs_event) => cs_setName(cs_event.target.value)}
          aria-invalid={!!cs_errors.name}
          className="cs_input"
        />
        {cs_errors.name && <p className="cs_field_error">{cs_errors.name}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cs_email" className="cs_form_label">
          Email
        </Label>
        <Input
          id="cs_email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={cs_email}
          onChange={(cs_event) => cs_setEmail(cs_event.target.value)}
          aria-invalid={!!cs_errors.email}
          className="cs_input"
        />
        {cs_errors.email && <p className="cs_field_error">{cs_errors.email}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cs_password" className="cs_form_label">
          Password
        </Label>
        <Cs_PasswordInput
          id="cs_password"
          autoComplete="new-password"
          placeholder="Create a password"
          value={cs_password}
          onChange={(cs_event) => cs_setPassword(cs_event.target.value)}
          aria-invalid={!!cs_errors.password}
        />
        {cs_errors.password && <p className="cs_field_error">{cs_errors.password}</p>}

        {/* Live password rules */}
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1.5">
          {CS_PASSWORD_RULES.map((cs_rule) => {
            const cs_isMet = cs_rule.cs_test(cs_password);
            return (
              <li key={cs_rule.cs_message} className={`cs_password_rule ${cs_isMet ? "cs_active" : ""}`}>
                {cs_isMet ? <CheckIcon className="size-3.5" /> : <XIcon className="size-3.5" />}
                {cs_rule.cs_message}
              </li>
            );
          })}
        </ul>
      </div>

      <button type="submit" disabled={cs_isSubmitting} className="cs_btn cs_btn_style_2 mt-2 w-full">
        {cs_isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
        {cs_isSubmitting ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-(--cs_body_color)">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-(--cs_primary_color) hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default Cs_SignUpForm;
