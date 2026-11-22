import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRightIcon } from "lucide-react";
import { cs_getCategoryPath } from "@/lib/cs_constants";
import { cs_plural } from "@/lib/cs_format";
import { CS_CATEGORY_ICONS } from "@/lib/cs_categoryIcons";
import { cs_getServiceDetails } from "@/lib/cs_getServiceDetails";
import Cs_ServiceBookingCard from "@/app/ui/ServiceBookingCard";
import Cs_TechnicianCard from "@/app/ui/TechnicianCard";
import Cs_RequestAction from "@/app/ui/RequestAction";
import Cs_StarRating from "@/app/ui/StarRating";
import Cs_ServiceReviews from "@/app/ui/ServiceReviews";

export const generateMetadata = async ({ params }: PageProps<"/services/[id]">): Promise<Metadata> => {
  const { id: cs_serviceId } = await params;
  const { service: cs_service } = await cs_getServiceDetails(cs_serviceId);
  return { title: cs_service.title, description: cs_service.description.slice(0, 160) };
};

const Cs_ServiceDetailsPage = async ({ params }: PageProps<"/services/[id]">) => {
  const { id: cs_serviceId } = await params;
  const { service: cs_service, technician: cs_technician } = await cs_getServiceDetails(cs_serviceId);
  const Cs_CategoryIcon = CS_CATEGORY_ICONS[cs_service.category];

  return (
    <section className="cs_container pt-8 pb-16 md:pb-24">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-(--cs_body_color)">
        <Link href="/" className="hover:text-(--cs_primary_color)">
          Home
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <Link href="/services" className="hover:text-(--cs_primary_color)">
          Services
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <Link href={cs_getCategoryPath(cs_service.category)} className="hover:text-(--cs_primary_color)">
          {cs_service.category}
        </Link>
        <ChevronRightIcon className="size-3.5" />
        <span className="line-clamp-1 max-w-60 text-(--cs_heading_color)" aria-current="page">
          {cs_service.title}
        </span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <div className="cs_detail_image">
            <Image
              src={cs_service.image}
              alt={cs_service.title}
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <Link href={cs_getCategoryPath(cs_service.category)} className="cs_chip flex items-center gap-1.5 text-sm">
              {Cs_CategoryIcon && <Cs_CategoryIcon className="size-4 text-(--cs_primary_color)" />}
              {cs_service.category}
            </Link>
            {cs_service.reviewCount ? (
              <a href="#reviews" className="flex items-center gap-1.5 text-sm text-(--cs_body_color) hover:underline">
                <Cs_StarRating cs_value={cs_service.avgRating ?? 0} />
                <span className="font-semibold text-(--cs_heading_color)">{cs_service.avgRating?.toFixed(1)}</span>
                {`(${cs_plural(cs_service.reviewCount, "review")})`}
              </a>
            ) : (
              <span className="text-sm text-(--cs_body_color)">No reviews yet</span>
            )}
          </div>

          <h1 className="mt-4 font-heading text-3xl leading-tight font-bold tracking-tight text-(--cs_heading_color) md:text-4xl">
            {cs_service.title}
          </h1>

          <h2 className="mt-8 text-lg font-semibold text-(--cs_heading_color)">About this service</h2>
          <p className="mt-3 leading-relaxed whitespace-pre-line text-(--cs_body_color)">{cs_service.description}</p>

          <Cs_ServiceReviews cs_serviceId={cs_service._id} />
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <Cs_ServiceBookingCard cs_data={cs_service}>
            <Cs_RequestAction cs_serviceId={cs_service._id} cs_serviceTitle={cs_service.title} />
          </Cs_ServiceBookingCard>
          <Cs_TechnicianCard cs_data={cs_technician} cs_fallbackArea={cs_service.serviceArea} />
        </aside>
      </div>
    </section>
  );
};

export default Cs_ServiceDetailsPage;
