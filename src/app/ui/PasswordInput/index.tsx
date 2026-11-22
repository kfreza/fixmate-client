"use client";

import { useState, type ComponentProps } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

// Password field with show/hide toggle
const Cs_PasswordInput = ({ className = "", ...cs_props }: Omit<ComponentProps<"input">, "type">) => {
  const [cs_isVisible, cs_setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...cs_props} type={cs_isVisible ? "text" : "password"} className={`cs_input pr-11 ${className}`} />
      <button
        type="button"
        onClick={() => cs_setIsVisible((cs_prev) => !cs_prev)}
        aria-label={cs_isVisible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-(--cs_body_color) hover:text-(--cs_heading_color)"
      >
        {cs_isVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  );
};

export default Cs_PasswordInput;
