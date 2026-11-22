import { BadgeCheckIcon, MapPinIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cs_getInitials } from "@/lib/cs_format";
import type { Cs_TechnicianSummary } from "@/lib/cs_types";

type Cs_TechnicianCardProps = {
  cs_data: Cs_TechnicianSummary;
  cs_fallbackArea: string;
};

const Cs_TechnicianCard = ({ cs_data, cs_fallbackArea }: Cs_TechnicianCardProps) => {
  return (
    <div className="cs_detail_card">
      <p className="text-xs font-semibold tracking-wide text-(--cs_body_color) uppercase">Your technician</p>

      <div className="mt-4 flex items-center gap-4">
        {/* Avatar falls back to initials if the image fails */}
        <Avatar className="size-14">
          <AvatarImage src={cs_data.image ?? undefined} alt={cs_data.name} />
          <AvatarFallback className="bg-(--cs_primary_color) text-lg font-semibold text-(--cs_primary_text_color)">
            {cs_getInitials(cs_data.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-semibold text-(--cs_heading_color)">
            <span className="truncate">{cs_data.name}</span>
            <BadgeCheckIcon className="size-4 shrink-0 text-(--cs_primary_color)" aria-label="Verified" />
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-(--cs_body_color)">
            <MapPinIcon className="size-3.5 shrink-0" />
            {cs_data.area || cs_fallbackArea}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-(--cs_body_color)">
        {cs_data.bio || "Approved FixMate technician. Every listing is reviewed by our team before it goes live."}
      </p>
    </div>
  );
};

export default Cs_TechnicianCard;
