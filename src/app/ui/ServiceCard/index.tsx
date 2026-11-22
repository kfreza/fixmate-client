import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon, HomeIcon, StarIcon, StoreIcon } from "lucide-react";
import type { Cs_Service } from "@/lib/cs_types";

type Cs_ServiceCardProps = {
  cs_data: Pick<
    Cs_Service,
    | "_id"
    | "title"
    | "category"
    | "image"
    | "basePrice"
    | "estimatedDuration"
    | "serviceMode"
    | "technicianName"
    | "avgRating"
    | "reviewCount"
  >;
};

// Equal-height card for home and browse pages
const Cs_ServiceCard = ({ cs_data }: Cs_ServiceCardProps) => {
  const Cs_ModeIcon = cs_data.serviceMode === "Home Visit" ? HomeIcon : StoreIcon;
  const cs_initial = cs_data.technicianName?.charAt(0).toUpperCase() || "T";

  return (
    <article className="cs_service_card group">
      <div className="cs_service_card_image">
        <Image
          src={cs_data.image}
          alt={cs_data.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="cs_service_card_category">{cs_data.category}</span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--cs_body_color)">
          <span className="flex items-center gap-1.5">
            <Cs_ModeIcon className="size-3.5 text-(--cs_primary_color)" />
            {cs_data.serviceMode}
          </span>
          <span className="flex items-center gap-1.5">
            <ClockIcon className="size-3.5 text-(--cs_primary_color)" />
            {cs_data.estimatedDuration}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg leading-snug font-semibold text-(--cs_heading_color)">
          {cs_data.title}
        </h3>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-(--cs_soft_color) text-xs font-bold text-(--cs_primary_color)">
              {cs_initial}
            </span>
            <span className="truncate text-sm text-(--cs_body_color)">{cs_data.technicianName}</span>
          </div>
          {cs_data.reviewCount ? (
            <span className="flex shrink-0 items-center gap-1 text-sm" aria-label={`Rated ${cs_data.avgRating?.toFixed(1)} from ${cs_data.reviewCount} reviews`}>
              <StarIcon className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-(--cs_heading_color)">{cs_data.avgRating?.toFixed(1)}</span>
              <span className="text-xs text-(--cs_body_color)">({cs_data.reviewCount})</span>
            </span>
          ) : (
            <span className="cs_chip shrink-0 px-2 py-0.5 text-[11px]">New</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-(--cs_border_color) pt-4">
          <div>
            <p className="text-xs text-(--cs_body_color)">Starting from</p>
            <p className="font-heading text-2xl font-bold text-(--cs_heading_color)">${cs_data.basePrice}</p>
          </div>
          <Link href={`/services/${cs_data._id}`} className="cs_btn cs_btn_style_2 px-4 py-2.5">
            View Details
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Cs_ServiceCard;
