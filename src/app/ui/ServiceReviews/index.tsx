import { MessageSquareQuoteIcon } from "lucide-react";
import { cs_serverFetch } from "@/lib/cs_serverFetch";
import { cs_formatDay, cs_getInitials, cs_plural } from "@/lib/cs_format";
import type { Cs_ReviewsResponse } from "@/lib/cs_types";
import Cs_StarRating from "@/app/ui/StarRating";

type Cs_ServiceReviewsProps = {
  cs_serviceId: string;
};

// Latest public reviews; quietly hidden if the API is down
const Cs_ServiceReviews = async ({ cs_serviceId }: Cs_ServiceReviewsProps) => {
  const cs_data = await cs_serverFetch<Cs_ReviewsResponse>(`/api/services/${cs_serviceId}/reviews`, 0);
  if (!cs_data) return null;

  return (
    <section id="reviews" className="mt-10 scroll-mt-24 border-t border-(--cs_border_color) pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-(--cs_heading_color)">Customer reviews</h2>
        {cs_data.reviewCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-(--cs_body_color)">
            <span className="font-heading text-2xl font-bold text-(--cs_heading_color)">{cs_data.avgRating.toFixed(1)}</span>
            <Cs_StarRating cs_value={cs_data.avgRating} cs_size="md" />
            <span>{cs_plural(cs_data.reviewCount, "review")}</span>
          </div>
        )}
      </div>

      {cs_data.items.length ? (
        <ul className="mt-5 flex flex-col gap-4">
          {cs_data.items.map((cs_item) => (
            <li key={cs_item._id} className="rounded-2xl border border-(--cs_border_color) bg-(--cs_card_color) p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-(--cs_soft_color) text-xs font-bold text-(--cs_primary_color)">
                    {cs_getInitials(cs_item.customerName)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-(--cs_heading_color)">{cs_item.customerName}</p>
                    {cs_item.reviewedAt && <p className="text-xs text-(--cs_body_color)">{cs_formatDay(cs_item.reviewedAt)}</p>}
                  </div>
                </div>
                <Cs_StarRating cs_value={cs_item.rating} />
              </div>
              {cs_item.review && <p className="mt-3 text-sm leading-relaxed text-(--cs_body_color)">{cs_item.review}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-(--cs_border_color) p-5 text-sm text-(--cs_body_color)">
          <MessageSquareQuoteIcon className="size-5 shrink-0 text-(--cs_primary_color)" />
          No reviews yet. Customers can rate this service after their repair is paid.
        </div>
      )}
    </section>
  );
};

export default Cs_ServiceReviews;
