import { Skeleton } from "@/components/ui/skeleton";
import { CS_SERVICES_PAGE_LIMIT } from "@/lib/cs_constants";
import Cs_ServiceGridSkeleton from "@/app/ui/ServiceGridSkeleton";

// Mirrors the browse page layout
const Cs_ServicesLoading = () => {
  return (
    <>
      <section className="cs_page_hero cs_blueprint_bg">
        <div className="cs_container">
          <Skeleton className="h-7 w-36 rounded-full bg-(--cs_soft_color)" />
          <Skeleton className="mt-4 h-10 w-full max-w-md bg-(--cs_soft_color)" />
          <Skeleton className="mt-3 h-6 w-full max-w-lg bg-(--cs_soft_color)" />
        </div>
      </section>
      <section className="cs_container pt-8 pb-16 md:pb-24">
        <Skeleton className="h-[4.25rem] w-full rounded-2xl bg-(--cs_soft_color)" />
        <div className="mt-8">
          <Cs_ServiceGridSkeleton cs_count={CS_SERVICES_PAGE_LIMIT} />
        </div>
      </section>
    </>
  );
};

export default Cs_ServicesLoading;
