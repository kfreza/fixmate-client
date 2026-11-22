"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HomeIcon, RotateCwIcon, TriangleAlertIcon } from "lucide-react";

type Cs_ErrorViewProps = {
  cs_error: unknown;
  cs_retry: () => void;
  cs_homeHref?: string;
  cs_homeLabel?: string;
};

// Shared UI for every error.tsx; never shows raw server messages
const Cs_ErrorView = ({ cs_error, cs_retry, cs_homeHref = "/", cs_homeLabel = "Back to Home" }: Cs_ErrorViewProps) => {
  const [cs_isRetrying, cs_setIsRetrying] = useState(false);
  const cs_digest = cs_error instanceof Error && "digest" in cs_error ? String(cs_error.digest) : null;

  useEffect(() => {
    console.error(cs_error);
  }, [cs_error]);

  return (
    <div className="cs_container flex flex-1 flex-col items-center justify-center py-16 text-center md:py-24">
      <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlertIcon className="size-8" />
      </span>
      <h1 className="mt-6 font-heading text-2xl font-bold text-(--cs_heading_color) md:text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-md leading-relaxed text-(--cs_body_color)">
        We could not load this page. It is usually a short hiccup, so please try again.
      </p>
      {cs_digest && <p className="mt-2 font-mono text-xs text-(--cs_body_color)/70">Ref: {cs_digest}</p>}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            cs_setIsRetrying(true);
            cs_retry();
          }}
          disabled={cs_isRetrying}
          className="cs_btn cs_btn_style_2"
        >
          <RotateCwIcon className={`size-4 ${cs_isRetrying ? "animate-spin" : ""}`} />
          Try again
        </button>
        <Link href={cs_homeHref} className="cs_btn cs_btn_style_3">
          <HomeIcon className="size-4" />
          {cs_homeLabel}
        </Link>
      </div>
    </div>
  );
};

export default Cs_ErrorView;
