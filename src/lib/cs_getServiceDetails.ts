import { cache } from "react";
import { notFound } from "next/navigation";
import type { Cs_ServiceDetailsResponse } from "@/lib/cs_types";

const CS_OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

// 404 for a bad id or a hidden service; other failures go to error.tsx
export const cs_getServiceDetails = cache(async (cs_serviceId: string) => {
  if (!CS_OBJECT_ID_REGEX.test(cs_serviceId)) notFound();

  const cs_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${cs_serviceId}`, {
    cache: "no-store",
  });
  if (cs_response.status === 404) notFound();
  if (!cs_response.ok) throw new Error("Could not load this service");

  return (await cs_response.json()) as Cs_ServiceDetailsResponse;
});
