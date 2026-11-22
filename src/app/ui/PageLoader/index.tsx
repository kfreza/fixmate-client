import { WrenchIcon } from "lucide-react";

type Cs_PageLoaderProps = {
  cs_label?: string;
};

// Generic route loader with the spinning wrench mark
const Cs_PageLoader = ({ cs_label = "Loading" }: Cs_PageLoaderProps) => {
  return (
    <div role="status" className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <span className="cs_loader_icon">
        <WrenchIcon className="size-6" />
      </span>
      <p className="text-sm font-medium text-(--cs_body_color)">{cs_label}…</p>
    </div>
  );
};

export default Cs_PageLoader;
