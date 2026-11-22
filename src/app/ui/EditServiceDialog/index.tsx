"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Cs_Service } from "@/lib/cs_types";
import Cs_ServiceForm from "@/app/ui/ServiceForm";

type Cs_EditServiceDialogProps = {
  cs_data: Cs_Service;
};

// Pre-filled form; saving sends the service back to admin review
const Cs_EditServiceDialog = ({ cs_data }: Cs_EditServiceDialogProps) => {
  const cs_router = useRouter();
  const [cs_isOpen, cs_setIsOpen] = useState(false);

  return (
    <Dialog open={cs_isOpen} onOpenChange={cs_setIsOpen}>
      <DialogTrigger asChild>
        <button type="button" className="cs_table_action">
          <PencilIcon className="size-4" />
          Edit
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Edit service</DialogTitle>
          <DialogDescription>
            {cs_data.approvalStatus === "pending"
              ? "This service is still waiting for approval."
              : "Saving changes sends this service back to admin review until it is approved again."}
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so it always starts from the latest data */}
        {cs_isOpen && (
          <Cs_ServiceForm
            cs_mode="edit"
            cs_serviceId={cs_data._id}
            cs_initialImage={cs_data.image}
            cs_initial={{
              title: cs_data.title,
              category: cs_data.category,
              description: cs_data.description,
              basePrice: String(cs_data.basePrice),
              estimatedDuration: cs_data.estimatedDuration,
              serviceMode: cs_data.serviceMode,
              serviceArea: cs_data.serviceArea,
            }}
            cs_onDone={() => {
              cs_setIsOpen(false);
              cs_router.refresh();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cs_EditServiceDialog;
