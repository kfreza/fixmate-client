"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";

type Cs_AvailabilitySwitchProps = {
  cs_serviceId: string;
  cs_isAvailable: boolean;
};

// Flips at once; rolls back if the server says no
const Cs_AvailabilitySwitch = ({ cs_serviceId, cs_isAvailable }: Cs_AvailabilitySwitchProps) => {
  const cs_router = useRouter();
  const [cs_isOn, cs_setIsOn] = useState(cs_isAvailable);
  const [cs_isSaving, cs_setIsSaving] = useState(false);

  const cs_handleChange = async (cs_next: boolean) => {
    cs_setIsOn(cs_next);
    cs_setIsSaving(true);
    try {
      const { data: cs_data } = await cs_api.patch<{ message: string; service: { isAvailable: boolean } }>(
        `/api/services/${cs_serviceId}/availability`,
      );
      // The server toggles, so trust its answer
      cs_setIsOn(cs_data.service.isAvailable);
      toast.success(cs_data.message);
      cs_router.refresh();
    } catch (cs_error) {
      cs_setIsOn(!cs_next);
      toast.error(cs_getErrorMessage(cs_error, "Could not change availability"));
    } finally {
      cs_setIsSaving(false);
    }
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <Switch checked={cs_isOn} onCheckedChange={cs_handleChange} disabled={cs_isSaving} aria-label="Available for booking" />
      <span className={`text-xs font-semibold ${cs_isOn ? "text-(--cs_primary_color)" : "text-(--cs_body_color)"}`}>
        {cs_isOn ? "Available" : "Hidden"}
      </span>
    </label>
  );
};

export default Cs_AvailabilitySwitch;
