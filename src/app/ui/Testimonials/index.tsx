import { QuoteIcon, StarIcon } from "lucide-react";
import { cs_getInitials } from "@/lib/cs_format";

const cs_data = {
  eyebrow: "Customer stories",
  title: "Trusted by people across Dhaka",
  reviews: [
    {
      name: "Farhana Akter",
      area: "Uttara",
      service: "AC Gas Refill",
      text: "The technician came on time, explained the problem and fixed the cooling in under two hours. Paying after the job felt very safe.",
    },
    {
      name: "Imran Chowdhury",
      area: "Mohammadpur",
      service: "Laptop Repair",
      text: "I could see every status change from my dashboard. My laptop was back in a day and the final price matched the quote.",
    },
    {
      name: "Sadia Rahman",
      area: "Banani",
      service: "Phone Screen Replacement",
      text: "Booking took a minute. Great work on my phone screen, and I loved that I only paid once I had it back in my hands.",
    },
  ],
};

const Cs_Testimonials = () => {
  return (
    <section className="cs_section">
      <div className="cs_container">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h2 className="cs_section_title mt-4">{cs_data.title}</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {cs_data.reviews.map((cs_review) => (
            <figure key={cs_review.name} className="cs_testimonial_card">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, cs_index) => (
                    <StarIcon key={cs_index} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <QuoteIcon className="size-8 text-(--cs_primary_color)/20" />
              </div>
              <blockquote className="mt-5 flex-1 leading-relaxed text-(--cs_body_color)">{cs_review.text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-(--cs_border_color) pt-5">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-(--cs_primary_color) text-sm font-bold text-(--cs_primary_text_color)">
                  {cs_getInitials(cs_review.name)}
                </span>
                <div>
                  <p className="font-semibold text-(--cs_heading_color)">{cs_review.name}</p>
                  <p className="text-xs text-(--cs_body_color)">
                    {cs_review.service} · {cs_review.area}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cs_Testimonials;
