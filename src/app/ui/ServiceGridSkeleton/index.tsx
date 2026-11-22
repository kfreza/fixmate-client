import { Skeleton } from "@/components/ui/skeleton";

type Cs_ServiceGridSkeletonProps = {
  cs_count?: number;
};

// Same shape as Cs_ServiceCard, so the layout does not jump
const Cs_ServiceGridSkeleton = ({ cs_count = 6 }: Cs_ServiceGridSkeletonProps) => {
  return (
    <div role="status" aria-label="Loading services">
      <Skeleton className="h-5 w-48 bg-(--cs_soft_color)" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cs_count }, (_, cs_index) => (
          <div key={cs_index} className="cs_service_card">
            <Skeleton className="aspect-[4/3] rounded-none bg-(--cs_soft_color)" />
            <div className="flex flex-1 flex-col gap-4 p-5">
              <Skeleton className="h-3.5 w-40 bg-(--cs_soft_color)" />
              <Skeleton className="h-12 w-full bg-(--cs_soft_color)" />
              <Skeleton className="h-7 w-32 bg-(--cs_soft_color)" />
              <div className="mt-auto flex items-end justify-between border-t border-(--cs_border_color) pt-4">
                <Skeleton className="h-10 w-24 bg-(--cs_soft_color)" />
                <Skeleton className="h-10 w-32 rounded-xl bg-(--cs_soft_color)" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cs_ServiceGridSkeleton;
