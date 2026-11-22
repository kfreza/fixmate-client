"use client";

import type { Cs_ErrorPageProps } from "@/lib/cs_types";
import Cs_ErrorView from "@/app/ui/ErrorView";
import "./globals.css";

// Replaces the root layout, so it needs its own html and body
const Cs_GlobalError = ({ error: cs_error, retry: cs_retry }: Cs_ErrorPageProps) => {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background">
        <title>Something went wrong | FixMate</title>
        <Cs_ErrorView cs_error={cs_error} cs_retry={cs_retry} />
      </body>
    </html>
  );
};

export default Cs_GlobalError;
