"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { CS_EMAIL_REGEX, cs_getDashboardPath } from "@/lib/cs_constants";
import Cs_PasswordInput from "@/app/ui/PasswordInput";
import { Cs_GoogleIcon } from "@/app/ui/SocialIcons";

type Cs_SignInFormProps = {
  cs_redirect: string | null;
  cs_hasGoogle: boolean;
};

type Cs_SignInErrors = Partial<Record<"email" | "password", string>>;

const Cs_SignInForm = ({ cs_redirect, cs_hasGoogle }: Cs_SignInFormProps) => {
  const cs_router = useRouter();
  const [cs_email, cs_setEmail] = useState("");
  const [cs_password, cs_setPassword] = useState("");
  const [cs_errors, cs_setErrors] = useState<Cs_SignInErrors>({});
  const [cs_isSubmitting, cs_setIsSubmitting] = useState(false);
  const [cs_isGoogleLoading, cs_setIsGoogleLoading] = useState(false);

  const cs_handleSubmit = async (cs_event: FormEvent<HTMLFormElement>) => {
    cs_event.preventDefault();
    const cs_trimmedEmail = cs_email.trim().toLowerCase();

    const cs_newErrors: Cs_SignInErrors = {};
    if (!cs_trimmedEmail) cs_newErrors.email = "Email is required";
    else if (!CS_EMAIL_REGEX.test(cs_trimmedEmail)) cs_newErrors.email = "Enter a valid email address";
    if (!cs_password) cs_newErrors.password = "Password is required";
    cs_setErrors(cs_newErrors);
    if (Object.keys(cs_newErrors).length) return;

    cs_setIsSubmitting(true);
    const { data: cs_data, error: cs_error } = await signIn.email({
      email: cs_trimmedEmail,
      password: cs_password,
    });

    if (cs_error) {
      cs_setIsSubmitting(false);
      toast.error(cs_error.message || "Sign in failed. Please try again.");
      return;
    }

    toast.success(`Welcome back, ${cs_data.user.name}!`);
    cs_router.push(cs_redirect ?? cs_getDashboardPath(cs_data.user.role));
    cs_router.refresh();
  };

  const cs_handleGoogle = async () => {
    cs_setIsGoogleLoading(true);
    // Guards send other roles to their own dashboard
    const { error: cs_error } = await signIn.social({
      provider: "google",
      callbackURL: cs_redirect ?? "/dashboard/customer",
    });
    if (cs_error) {
      cs_setIsGoogleLoading(false);
      toast.error(cs_error.message || "Google sign in failed.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {cs_hasGoogle && (
        <>
          <button
            type="button"
            onClick={cs_handleGoogle}
            disabled={cs_isGoogleLoading}
            className="cs_btn cs_btn_style_3 w-full"
          >
            {cs_isGoogleLoading ? <Loader2Icon className="size-4 animate-spin" /> : <Cs_GoogleIcon className="size-4" />}
            Continue with Google
          </button>
          <div className="cs_divider">or sign in with email</div>
        </>
      )}

      <form onSubmit={cs_handleSubmit} noValidate className="flex flex-col gap-5">
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
            autoComplete="current-password"
            placeholder="Your password"
            value={cs_password}
            onChange={(cs_event) => cs_setPassword(cs_event.target.value)}
            aria-invalid={!!cs_errors.password}
          />
          {cs_errors.password && <p className="cs_field_error">{cs_errors.password}</p>}
        </div>

        <button type="submit" disabled={cs_isSubmitting} className="cs_btn cs_btn_style_2 mt-2 w-full">
          {cs_isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
          {cs_isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-(--cs_body_color)">
        New to FixMate?{" "}
        <Link href="/sign-up" className="font-semibold text-(--cs_primary_color) hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Cs_SignInForm;
