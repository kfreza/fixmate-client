"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

type Cs_CopyButtonProps = {
  cs_value: string;
  cs_label: string;
};

const Cs_CopyButton = ({ cs_value, cs_label }: Cs_CopyButtonProps) => {
  const [cs_isCopied, cs_setIsCopied] = useState(false);

  const cs_handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cs_value);
      cs_setIsCopied(true);
      setTimeout(() => cs_setIsCopied(false), 1800);
    } catch {
      // Clipboard blocked; the value is still visible to copy by hand
    }
  };

  return (
    <button type="button" onClick={cs_handleCopy} aria-label={cs_label} className="cs_table_action shrink-0 px-2">
      {cs_isCopied ? <CheckIcon className="size-4 text-(--cs_primary_color)" /> : <CopyIcon className="size-4" />}
    </button>
  );
};

export default Cs_CopyButton;
