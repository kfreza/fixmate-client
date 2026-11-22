import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the details page layout
const Cs_ServiceDetailsLoading = () => {
  return (
    <section className="cs_container pt-8 pb-16 md:pb-24" role="status" aria-label="Loading service">
      <Skeleton className="h-5 w-72 max-w-full bg-(--cs_soft_color)" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <Skeleton className="aspect-[16/10] w-full rounded-2xl bg-(--cs_soft_color)" />
          <Skeleton className="mt-8 h-8 w-48 rounded-full bg-(--cs_soft_color)" />
          <Skeleton className="mt-4 h-10 w-4/5 bg-(--cs_soft_color)" />
          <Skeleton className="mt-8 h-24 w-full bg-(--cs_soft_color)" />
        </div>
        <div className="flex flex-col gap-6">
          <Skeleton className="h-96 rounded-2xl bg-(--cs_soft_color)" />
          <Skeleton className="h-48 rounded-2xl bg-(--cs_soft_color)" />
        </div>
      </div>
    </section>
  );
};

export default Cs_ServiceDetailsLoading;
