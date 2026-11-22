"use client";

import type { Cs_ErrorPageProps } from "@/lib/cs_types";
import Cs_ErrorView from "@/app/ui/ErrorView";

const Cs_PublicError = ({ error: cs_error, retry: cs_retry }: Cs_ErrorPageProps) => {
  return <Cs_ErrorView cs_error={cs_error} cs_retry={cs_retry} />;
};

export default Cs_PublicError;
